const router = require('express').Router()
const pool = require('../config/database/postgresql/postgresql')
const jwtSign = require('../module/jwt')
const { BadRequest } = require('../module/customError')
const validate = require('../module/validation')

// 장르 추가
router.post('/', adminAuth, async (req, res, next) => {
	const { name } = req.body
	const result = {
		data : {},
		message : ""
	}
	
	let conn = null
	
	try {
		validate(name, "name").input()
		
		const conn = await pool.connect()
		await conn.query("BEGIN")
		
		const insertGenreSql = `INSERT INTO
								type (name)
							VALUES
								($1)
							RETURNING`
		const insertGenreParam = [name]
		const insertGenreResult = await conn.query(insertGenreSql, insertGenreParam)
		
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
	} catch(error) {
		if(conn) await conn.query("ROLLBACK")
		return next(error)
	} finally {
		if(conn) conn.release
	}
	
	res.send(result.data)
})

module.exports = router