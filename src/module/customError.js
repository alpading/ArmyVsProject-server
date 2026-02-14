const ERROR_CODE = require('./errorCodes')

class BadRequest extends Error {
    constructor(code, message) {
        super(message)
        this.status = 400
        this.code = code
    }
}

class NotFound extends Error {
    constructor() {
        super('Resource not found')
        this.status = 404
        this.code = ERROR_CODE.RESOURCE_NOT_FOUND
    }
}

class InternalServerError extends Error {
    constructor(err) {
        super(err.message || 'Internal server error', { cause : err })
        this.status = 500
        this.code = ERROR_CODE.INTERNAL_SERVER_ERROR
    }
}

module.exports = { BadRequest, NotFound, InternalServerError }
