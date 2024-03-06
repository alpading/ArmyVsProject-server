require('dotenv').config()

const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const path = require('path')
const { BadRequest } = require('../module/customError')
const { AWS_OPTION, MULTER_ERROR } = require('../module/global')

const allowedExtensions = ['.png', '.jpg', '.jpeg']

AWS.config.update({
	region: AWS_OPTION.REGION,
	accessKeyId: process.env.AWS_ACCESS_ID,
	secretAccessKey : process.env.AWS_SECRET_KEY
})

const s3 = new AWS.S3()

const uploader = multer({
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

const elemImageUploader = (req, res, next) => {
		uploader.single("elemImage")(req, res, (error) => {
		if (!error)
			return next()
			
		if (error.code == MULTER_ERROR.UNEXPECTED_FILE)
			return next(new BadRequest("하나의 이미지가 아닙니다."))
			
		if (error.code == MULTER_ERROR.FILE_SIZE)
			return next(new BadRequest("이미지가 너무 큽니다."))
	})
}

module.exports = elemImageUploader