const router = require('express').Router()
const pool = require('../config/database/postgresql/postgresql')
const validate = require('../module/validation')

// 5개의 장르 랜덤으로 반환
router.get('/', async (req, res, next) => {
	const result = {
		data : {},
		message : ""
	}
	
	let conn = null
	
	try {
		const conn = await pool.connect()
		await conn.query("BEGIN")
		
		const selectGenreSql = `SELECT
									id, name
								FROM
									type
								ORDER BY
									RANDOM()
								LIMIT
									5`
		
		const selectGenreResult = await conn.query(selectGenreSql)
		
		result.data = selectGenreResult.rows
		
		await conn.query("COMMIT")
		await conn.release()
	} catch(error) {
		if(conn) await conn.query("ROLLBACK")
		return next(error)
	}
	
	res.send(result.data)
})

// 장르 목록 전체 반환
router.get('/all', async (req, res, next) => {
	const result = {
		data : {},
		message : ""
	}
	
	let conn = null
	
	try {
		const conn = await pool.connect()
		await conn.query("BEGIN")
		
		const selectGenreSql = `SELECT
									id, name
								FROM
									type
								`
		
		const selectGenreResult = await conn.query(selectGenreSql)
		
		result.data = selectGenreResult.rows
		
		await conn.query("COMMIT")
		await conn.release()
	} catch(error) {
		if(conn) await conn.query("ROLLBACK")
		return next(error)
	}
	
	res.send(result.data)
})

module.exports = router