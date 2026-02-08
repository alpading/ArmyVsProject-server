const router = require('express').Router()
const pool = require('../config/database/postgresql/postgresql')
const validate = require('../module/validation')
const asyncHandler  = require('../middleware/asyncHandler')
const { NotFound } = require('../module/customError')

// 요소 조회
router.get('/:elemId', asyncHandler( async(req, res) => {
	const { elemId } = req.params
	
    validate(elemId, "elemId").number()
    
    const selectElemQuery = `
        SELECT
            type_id, name, win_count, created_at
        FROM
            elem 
        WHERE
            id = $1 
            AND 
            is_deleted = false`
    const selectElemParams = [elemId]
    const selectElemResult = await pool.query(selectElemQuery, selectElemParams)

    if(!selectElemResult.rows[0]) throw new NotFound()
		
	res.status(200).json({ data : selectElemResult.rows[0] })
}))

// 요소 중 승률 높은 순으로 조회
router.get("/:type/list/ranking", asyncHandler ( async (req, res) => {
	const { type } = req.params

    validate(type, "type").number()
    
    const selectElemByRankQuery = `
        SELECT
            id, name, win_count
        FROM
            elem
        WHERE
            type_id = $1
        AND
            is_deleted = false
        ORDER BY
            win_count
        DESC`
    const selectElemByRankParams = [type]
    const selectElemByRankResult = await pool.query(selectElemByRankQuery, selectElemByRankParams)

    if(!selectElemByRankResult.rows[0]) throw new NotFound()
	
	res.status(200).json({ data : selectElemByRankResult.rows})
}))

// 11개 요소 랜덤 조회
router.get('/list/:type', asyncHandler ( async (req, res) => {
	const { type } = req.params

    validate(type, "type").number()

    const selectRandomElemListQuery = `
    SELECT
        id, name
    FROM
        elem 
    WHERE
        type_id = $1 
        AND
        is_deleted = false
    ORDER BY 
        RANDOM()
    LIMIT
        11`
    const selectRandomElemListParams = [type]
    const selectRandomElemListResult = await pool.query(selectRandomElemListQuery, selectRandomElemListParams)
    
    if (!selectRandomElemListResult.rows[0]) throw new NotFound()
	
	res.status(200).json({ data : selectRandomElemListResult.rows})
}))

// 요소 우승 횟수 추가
router.put('/win', asyncHandler( async (req, res) => {
	const { elemId } = req.body

    validate(elemId, "elemId").required().number()
    
    const selectElemWinCountQuery = `
        SELECT
            win_count
        FROM
            elem 
        WHERE
            id = $1 
            AND 
            is_deleted = false
                                `
    const selectElemWinCountParams = [elemId]
    const selectElemWinCountResult = await pool.query(selectElemWinCountQuery, selectElemWinCountParams)

    if(!selectElemWinCountResult.rows[0]) throw new NotFound()
        
    const winCount = selectElemWinCountResult.rows[0].win_count
    
    const updateWinCountQuery = `
    UPDATE
        elem
    SET
        win_count = $1
    WHERE
        id = $2
        AND
        is_deleted = false`
    const updateWinCountParams = [winCount + 1,elemId]
    const updateWinCountResult = await pool.query(updateWinCountQuery, updateWinCountParams)

    if(!updateWinCountResult.rowCount) throw new NotFound()

	res.status(200).json({ data : null })
}))

module.exports = router