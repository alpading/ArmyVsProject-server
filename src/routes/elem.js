const router = require('express').Router()
const pool = require('../config/database/postgresql/postgresql')
const { BadRequest } = require('../module/customError')
const validate = require('../module/validation')
const adminAuth = require('../middleware/adminAuth')
/*const elemImageUploader = require('../middleware/imageUploader')*/

//새로운 요소 등록
router.post('/', adminAuth, /*elemImageUploader,*/ async (req, res, next) => {
	const { type, name } = req.body
	const result = {
		data : {},
		message : ""
	}
	
	let conn = null
	
	try {
		validate(type, "type").input().isNumber()
		validate(name, "name").input()
		
		if(!req.file){
			throw new BadRequest("이미지가 없습니다.")
		}
		
		const image = req.file.location
		
		const conn = await pool.connect()
		await conn.query("BEGIN")
		
		const insertElemQuery = `INSERT INTO 
									elem (type_id, name, image)
								VALUES
									($1, $2, $3)
								RETURNING
									id`
		const insertElemParams = [type, name, image]
		const insertElemResult = await pool.query(insertElemQuery, insertElemParams)
		
		//선택 결과 저장을 위한 매핑 테이블인 selected_elem에 요소 추가
		const insertSelectedElemQuery = `INSERT INTO
											selected_elem (elem_id)
										VALUES
											($1)`
		const insertSelectedElemParams = [insertElemResult.rows[0].id]
		await pool.query(insertSelectedElemQuery, insertSelectedElemParams)
		
		await conn.query("COMMIT")
	} catch(error) {
		if(conn) await conn.query("ROLLBACK")
		return next(error)
	} finally {
		if(conn) conn.release
	}
	
	res.send(result.data)
})

// 요소 수정
router.put('/', adminAuth, /*elemImageUploader,*/ async (req, res, next) => {
	const { elemId, type, name } = req.body
	const result = {
		data : {},
		message : ""
	}
	
	let conn = null
	
	try {
		validate(elemId, "elemId").input().isNumber()
		validate(type, "type").input().isNumber()
		validate(name, "name").input()
		
		const conn = await pool.connect()
		await conn.query("BEGIN")
		
		const updateElemQuery = `UPDATE
									elem 
								SET
									type_id = $1,
									name = $2
								WHERE
									id = $3`
		const updateElemParams = [type, name, elemId]
		const updateElemResult = await pool.query(updateElemQuery, updateElemParams)
		
		let image
		if(req.file) image = req.file.location

		const updateElemImageQuery = `UPDATE
									elem 
								SET
									image = $1
								WHERE
								id = $2`
		const updateElemImageParams = [image, elemId]
		if(req.file) await pool.query(updateElemImageQuery, updateElemImageParams)
		
		await conn.query("COMMIT")
	} catch(error) {
		if(conn) await conn.query("ROLLBACK")
		return next(error)
	} finally {
		if(conn) conn.release
	}
	
	res.send(result.data)
})

// 요소 삭제 (softdelete)
router.delete('/', adminAuth, async (req, res, next) => {
	const { elemId } = req.body
	const result = {
		data : {},
		message : ""
	}
	
	let conn = null
	
	try {
		validate(elemId, "elemId").input().isNumber()
		
		const conn = await pool.connect()
		await conn.query("BEGIN")
		
		const deleteElemQuery = `UPDATE
									elem 
								SET
									is_deleted = true
								WHERE
									id = $1`
		const deleteElemParams = [elemId]
		const deleteElemResult = await pool.query(deleteElemQuery, deleteElemParams)
		
		await conn.query("COMMIT")
	} catch(error) {
		if(conn) await conn.query("ROLLBACK")
		return next(error)
	} finally {
		if(conn) conn.release
	}
	
	res.send(result.data)
})

// 요소 조회
router.get('/:elemId', async (req, res, next) => {
	const { elemId } = req.params
	const result = {
		data : {},
		message : ""
	}
	
	let conn = null
	
	try {
		validate(elemId, "elemId").input().isNumber()
		
		const conn = await pool.connect()
		await conn.query("BEGIN")
		
		const selectElemQuery = `SELECT
									type_id,
									name,
									image,
									selected_count,
									unselected_count,
									created_at
								FROM
									elem 
								WHERE
									id = $1 
								AND 
									is_deleted = false`
		const selectElemParams = [elemId]
		const selectElemResult = await pool.query(selectElemQuery, selectElemParams)
		
		result.data = selectElemResult.rows[0]
		
		await conn.query("COMMIT")
	} catch(error) {
		if(conn) await conn.query("ROLLBACK")
		return next(error)
	} finally {
		if(conn) conn.release
	}
	
	res.send(result.data)
})

// 요소 목록 조회
/*
router.get('/list/:type', async (req, res, next) => {
	const { type } = req.params
	const result = {
		data : {},
		message : ""
	}
	
	let conn = null
	
	try {
		validate(type, "type").input().isNumber()
		
		const conn = await pool.connect()
		await conn.query("BEGIN")
		
		const selectElemListQuery = `SELECT
										id,
										name,
										selected_count,
										unselected_count
									FROM
										elem 
									WHERE
										type_id = $1 
									AND 
										is_deleted = false
									ORDER BY created_at`
		const selectElemListParams = [type]
		const selectElemListResult = await pool.query(selectElemListQuery, selectElemListParams)
		
		result.data = selectElemListResult.rows
		
		await conn.query("COMMIT")
	} catch(error) {
		if(conn) await conn.query("ROLLBACK")
		return next(error)
	} finally {
		if(conn) conn.release
	}
	
	res.send(result.data)
})
*/

// 질문 생성 -> 랜덤으로 2개 요소 추출
router.get("/:type/question", async (req, res, next) => {
	const { type } = req.params
    const result = {
        message: "",
        data: {}
    }

    let conn = null

    try {
		validate(type, "type").input().isNumber()
		
        conn = await pool.connect()
        await conn.query("BEGIN")

        const selectRandomElemSql = `SELECT
										id,
										name,
										image
									FROM
										elem
									WHERE
										is_deleted = false
									AND
										type_id = $1
									ORDER BY
										RANDOM()
									LIMIT
										2`
        const selectRandomElemParams = [type]
        const selectRandomElemResult = await conn.query(selectRandomElemSql, selectRandomElemParams)
		
		if(selectRandomElemResult.rowCount != 2) throw new BadRequest("잘못된 타입입니다")
		
		result.data = selectRandomElemResult.rows
		
        await conn.query("COMMIT")
    } catch(error) {
        if(conn) await conn.query("ROLLBACK")
        return next(error)
    } finally {
        if(conn) conn.release
        res.send(result)
    }
})

// 요소 중 승률 높은 순으로 조회
router.get("/:type/list/ranking", async (req, res, next) => {
	const { type } = req.params
    const result = {
        message: "",
        data: {}
    }

    let conn = null

    try {
		validate(type, "type").input().isNumber()
		
        conn = await pool.connect()
        await conn.query("BEGIN")
		
		const selectElemByRankQuery = `SELECT
											id, name, image, selected_count, unselected_count,
											CAST(100 AS FLOAT4) * selected_count / (selected_count + unselected_count) AS rate
										FROM
											elem
										WHERE
											type_id = $1
										AND
											is_deleted = false
										AND
											selected_count + unselected_count != 0
										ORDER BY
											rate
										DESC`
		const selectElemByRankParams = [type]
		const selectElemByRankResult = await conn.query(selectElemByRankQuery, selectElemByRankParams)
		
		result.data = selectElemByRankResult.rows
		
        await conn.query("COMMIT")
    } catch(error) {
        if(conn) await conn.query("ROLLBACK")
        return next(error)
    } finally {
        if(conn) conn.release
        res.send(result)
    }
})

// 11개 요소 랜덤 조회
router.get('/list/:type', async (req, res, next) => {
	const { type } = req.params
	const result = {
		data : {},
		message : ""
	}
	
	let conn = null
	
	try {
		validate(type, "type").input().isNumber()
		
		const conn = await pool.connect()
		await conn.query("BEGIN")
		
		const selectRandomElemListQuery = `SELECT
										id,
										name
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
		
		result.data = selectRandomElemListResult.rows
		
		await conn.query("COMMIT")
	} catch(error) {
		if(conn) await conn.query("ROLLBACK")
		return next(error)
	} finally {
		if(conn) conn.release
	}
	
	res.send(result.data)
})

module.exports = router