const { InternalServerError } = require('../module/customError')

const errorHandler = () => {
    return (err, req, res, next) => {
        if (!err.status) {
            err = new InternalServerError(err)
        }

        const status = err.status

        if (status >= 500 && status != 503){
            req.log.error({ err, code: err.code, status: status }, 'Unhandled error')
        }

        if (status == 503){
            req.log.warn({ code: err.code, status, message: err.message}, 'Service unavailable')
        }

        if (status >= 400 && status < 500){
            req.log.warn({ code: err.code, status, message: err.message }, 'Handled error')
        }

        return res.status(status).json({
            error: { code: err.code, message: err.message }
        })
    }
}

module.exports = errorHandler
