const router = require('express').Router()
const pool = require('../config/database/postgresql/postgresql')
const validate = require('../module/validation')

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
									win_count,
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
		await conn.release()
	} catch(error) {
		if(conn) await conn.query("ROLLBACK")
		await conn.release()
		return next(error)
	}
	
	res.send(result.data)
})

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
		await conn.release()
    } catch(error) {
        if(conn) await conn.query("ROLLBACK")
		await conn.release()
        return next(error)
    }
	
	res.send(result)
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
		const selectElemByRankResult = await conn.query(selectElemByRankQuery, selectElemByRankParams)
		
		result.data = selectElemByRankResult.rows
		
        await conn.query("COMMIT")
		await conn.release()
    } catch(error) {
        if(conn) await conn.query("ROLLBACK")
		await conn.release()
        return next(error)
    }
	
	res.send(result)
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
		await conn.release()
	} catch(error) {
		if(conn) await conn.query("ROLLBACK")
		await conn.release()
		return next(error)
	}
	
	res.send(result.data)
})

// 요소 우승 횟수 추가
router.put('/win', async (req, res, next) => {
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
		
		const selectElemWinCountQuery = `SELECT
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
		const winCount = selectElemWinCountResult.rows[0].win_count
		
		const updateWinCountQuery = ` UPDATE
										elem
									SET
										win_count = $1
									WHERE
										id = $2
									AND
										is_deleted = false
									`
		const updateWinCountParams = [winCount + 1,elemId]
		const updateWinCountResult = await pool.query(updateWinCountQuery, updateWinCountParams)
		
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