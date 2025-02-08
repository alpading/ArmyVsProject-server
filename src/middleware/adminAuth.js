require('dotenv').config()

const jwt = require('jsonwebtoken')
const { Unauthorized } = require('../module/customError')

module.exports = (req, res, next) => {
	
	const { token } = req.cookies
	
	try {
		const id = jwt.verify(token, process.env.JWT_SECRET_KEY)
	} catch(error) {
		return next(new Unauthorized("잘못된 권한입니다"))
	}
	
	next()
}