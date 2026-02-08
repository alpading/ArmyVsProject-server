const { InternalServerError } = require('../module/customError')

const errorHandler = () => {
	return (error, req, res, next) => {
        if(!error.status){
            error = new InternalServerError(error.message)
        }

		console.log(error)

		res.status(error.status).json({
            error : { code : error.code , message : error.message }
        })
	}
}

module.exports = errorHandler