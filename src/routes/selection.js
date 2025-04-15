const router = require('express').Router()
const pool = require('../config/database/postgresql/postgresql')
const { BadRequest } = require('../module/customError')
const validate = require('../module/validation')

//답변 저장
router.post('/', async (req, res, next) => {
	const result = {
		messsage : "",
		data : {}
	}
	const { selected_elem_id, unselected_elem_id } = req.body
	
	let conn = null
	
	try{
		validate(selected_elem_id, "selected_elem_id").input().isNumber()
		validate(unselected_elem_id, "unselected_elem_id").input().isNumber()
		
		conn = await pool.connect()
		await conn.query("BEGIN")
		
		// selected_elem_id와 unselected_elem_id가 같은 type인지 체크
		const checkTypeQuery = `SELECT
									*
								FROM
									elem
								WHERE
									id = $1
								AND
									type_id = (
										SELECT
											type_id
										FROM
											elem
										WHERE
											id = $2
									)
								`
		const checkTypeParams = [unselected_elem_id, selected_elem_id]
		const checkTypeResult = await conn.query(checkTypeQuery, checkTypeParams)
		
		if(checkTypeResult.rowCount == 0) throw new BadRequest("두 요소가 같은 타입이 아닙니다.")
		
		// 답변 저장
		const insertSelectionQuery = `INSERT INTO
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
		const insertSelectionParams = [unselected_elem_id, selected_elem_id]
		const insertSelectionResult = await conn.query(insertSelectionQuery, insertSelectionParams)
		
		await conn.query("COMMIT")
		await conn.release()
	} catch(error) {
		if(conn) await conn.query("ROLLBACK")
		await conn.release()
		return next(error)
	}
	res.send(result.data)
})

//특정 질문에 대한 답변 통계 반환
router.get('/stat/:elemId1/:elemId2', async (req, res, next) => {
	const result = {
		messsage : "",
		data : {}
	}
	const { elemId1, elemId2 } = req.params
	
	let conn = null
	
	try{
		validate(elemId1, "elemId1").input().isNumber()
		validate(elemId2, "elemId2").input().isNumber()
		
		conn = await pool.connect()
		await conn.query("BEGIN")
		
		// elem1, elem2가 짝지어진 결과 검색
		const selectCountQuery = `SELECT
									count(*)
								FROM
									unselected_elem
								LEFT JOIN
									selected_elem
								ON
									unselected_elem.selected_elem_id = selected_elem.id
								WHERE
									selected_elem.elem_id = $1
								AND
									unselected_elem.elem_id = $2
								AND
									unselected_elem.is_deleted = false`
		// elem1을 선택한 답변 갯수
		const selectElem1CountParams = [elemId1, elemId2]
		const selectElem1CountResult = await conn.query(selectCountQuery, selectElem1CountParams)
		
		// elem2을 선택한 답변 갯수
		const selectElem2CountParams = [elemId2, elemId1]
		const selectElem2CountResult = await conn.query(selectCountQuery, selectElem2CountParams)
		
		result.data = {
			"selectedElemCount" : selectElem1CountResult.rows[0].count,
			"unselectedElemCount" : selectElem2CountResult.rows[0].count
		}
		
		await conn.query("COMMIT")
		await conn.release()
	} catch(error) {
		if(conn) await conn.query("ROLLBACK")
		await conn.release()
		return next(error)
	}
	res.send(result.data)
})

module.exports = router