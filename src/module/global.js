module.exports = {
	JWT_OPTION : {
		EXPIRES_IN : '15m',
		ISSUER : 'ju',
		ALGORITHM : 'HS256'
	},
	
	AWS_OPTION : {
		REGION : 'ap-northeast-2',
		ACL : 'public-read-write'
	},
	
	MULTER_ERROR : {
		UNEXPECTED_FILE : "LIMIT_UNEXPECTED_FILE",
		FILE_SIZE : "LIMIT_FILE_SIZE"
	}
}