const router = require('express').Router()
const pool = require('../config/database/postgresql/postgresql')
const jwtSign = require('../module/jwt')

router.post('/', async (req, res, next) => {
	const { pw } = req.body
	const result = {
		data : {},
		message : ""
	}
	
	let conn = null
	
	try {
		const conn = await pool.connect()
		await conn.query("BEGIN")
		
		const selectPwSql = `SELECT
								id
							FROM
								account
							WHERE
								pw = $1`
		const selectPwParam = [pw]
		const selectPwResult = await conn.query(selectPwSql, selectPwParam)
		
		console.log(selectPwResult.rows[0])
		console.log(selectPwResult.rowCount)
		
		if(selectPwResult.rowCount == 0) {
			throw "비밀번호가 올바르지 않습니다"
		}
		
		const token = jwtSign(selectPwResult.rows[0].id)
		
		console.log(token)
		
		res.cookie("token", token)
		
		result.data = selectPwResult.rows
		
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