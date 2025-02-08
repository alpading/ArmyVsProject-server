require('dotenv').config()

const jwt = require('jsonwebtoken')
const { JWT_OPTION } = require('./global')

const secretKey = process.env.JWT_SECRET_KEY

const jwtSign = (id) => {
	const payload = {
		id : id
	}
	
	const option = {
		expiresIn : JWT_OPTION.EXPIRES_IN,
		issuer : JWT_OPTION.ISSUER,
		algorithm : JWT_OPTION.ALGORITHM
	}
	
	return jwt.sign(payload, secretKey, option)
}

module.exports = jwtSign