require('dotenv').config()

const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const path = require('path')
const { BadRequest } = require('../module/customError')
const { AWS_OPTION } = require('../module/global')

const allowedExtensions = ['.png', '.jpg', '.jpeg']

AWS.config.update({
	region: AWS_OPTION.REGION,
	accessKeyId: process.env.AWS_ACCESS_ID,
	secretAccessKey : process.env.AWS_SECRET_KEY
})

const s3 = new AWS.S3()

const elemImageUploder = multer({
	storage: multerS3({
		s3 : s3,
		bucket : process.env.AWS_BUCKET_NAME,
		key: (req, file, callback) => {
			const extension = path.extname(file.originalname)
			if(!allowedExtensions.includes(extension))
				return callback(new BadRequest("잘못된 확장자입니다."))
			callback(null, `elem/${Date.now()}_${file.originalname}`)
		},
		acl : AWS_OPTION.ACL
		
	}),
	limits: {
		fileSize : 10 * 1024 * 1024 // 10MB
	}
})

module.exports = elemImageUploder