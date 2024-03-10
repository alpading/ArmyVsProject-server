const router = require('express').Router()
const pool = require('../config/database/postgresql/postgresql')
const jwtSign = require('../module/jwt')
const { BadRequest } = require('../module/customError')
const validate = require('../module/validation')

// 관리자 계정 로그인
router.post('/', async (req, res, next) => {
	const { pw } = req.body
	const result = {
		data : {},
		message : ""
	}
	
	let conn = null
	
	try {
		validate(pw, "pw").input()
		
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
		
		if(selectPwResult.rowCount == 0) {
			throw new BadRequest("비밀번호가 잘못되었습니다.")
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