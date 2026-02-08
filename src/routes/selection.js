const router = require('express').Router()
const pool = require('../config/database/postgresql/postgresql')
const { NotFound, BadRequest } = require('../module/customError')
const asyncHandler = require('../middleware/asyncHandler')
const ERROR_CODE = require('../module/errorCodes')
const validate = require('../module/validation')

//답변 저장
router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { selectedElemId, unselectedElemId } = req.body

        validate(selectedElemId, 'selectedElemId').required().number()
        validate(unselectedElemId, 'unselectedElemId').required().number()

        // selected_elem_id와 unselected_elem_id가 같은 type인지 체크
        const checkTypeQuery = `
        WITH picked AS (
            SELECT 
                id, type_id
            FROM
                elem
            WHERE
                id = ANY($1::int[])
        )
        SELECT
            COUNT(*) AS "foundCount",
            (COUNT(DISTINCT type_id) = 1) AS "isSame"
        FROM
            picked
        `
        const checkTypeParams = [[selectedElemId, unselectedElemId]]
        const checkTypeResult = await pool.query(checkTypeQuery, checkTypeParams)

        const { foundCount, isSame } = checkTypeResult.rows[0]

        if (foundCount == 0) throw new NotFound()
        if (!isSame)
            throw new BadRequest(
                ERROR_CODE.TYPE_MISMATCH,
                'selectedElemId, unselectedElemId must have same type'
            )

        // 답변 저장
        const insertSelectionQuery = `
        INSERT INTO
            unselected_elem (elem_id, selected_elem_id)
        VALUES 
            (
                $1, 
                (
                    SELECT
                        selected_elem.id
                    FROM
                        selected_elem
                    WHERE 
                        selected_elem.elem_id = $2
                        AND
                        selected_elem.is_deleted = false
                )
            )`
        const insertSelectionParams = [unselectedElemId, selectedElemId]
        await pool.query(insertSelectionQuery, insertSelectionParams)

        res.status(200).json({ data: null })
    })
)

//특정 질문에 대한 답변 통계 반환
router.get(
    '/stat/:elemId1/:elemId2',
    asyncHandler(async (req, res) => {
        const { elemId1, elemId2 } = req.params

        validate(elemId1, 'elemId1').number()
        validate(elemId2, 'elemId2').number()

        // elem1, elem2가 짝지어진 결과 검색
        const selectCountQuery = `
        WITH types AS (
            SELECT
                ( SELECT type_id FROM elem WHERE id = $1 ) AS type1,
                ( SELECT type_id FROM elem WHERE id = $2 ) AS type2
        ),
        counts AS (
            SELECT
                COUNT(*) FILTER (
                    WHERE selected.elem_id = $1 AND unselected.elem_id = $2
                ) AS forward,
                COUNT(*) FILTER (
                    WHERE selected.elem_id = $2 AND unselected.elem_id = $1
                ) AS reverse
            FROM
                unselected_elem unselected
            JOIN
                selected_elem selected
                ON
                unselected.selected_elem_id = selected.id
            WHERE
                unselected.is_deleted = false
        )
        SELECT
            types.type1 AS "elemType1",
            types.type2 AS "elemType2",
            counts.forward AS "selectedElemCount",
            counts.reverse AS "unselectedElemCount"
        FROM
            types, counts`
        const selectElemCountParams = [elemId1, elemId2]
        const selectElemCountResult = await pool.query(selectCountQuery, selectElemCountParams)
        const { elemType1, elemType2, selectedElemCount, unselectedElemCount } =
            selectElemCountResult.rows[0]

        if (elemType1 == null || elemType2 == null) throw new NotFound()
        if (elemType1 != elemType2)
            throw new BadRequest(
                ERROR_CODE.TYPE_MISMATCH,
                'selectedElemId, unselectedElemId must have same type'
            )

        res.status(200).json({
            data: {
                selectedElemCount: selectedElemCount,
                unselectedElemCount: unselectedElemCount,
            },
        })
    })
)

module.exports = router
