const ERROR_CODE = require('./errorCodes')

class BadRequest extends Error {
    constructor(code, message) {
        super(message)
        this.status = 400
        this.code = code
    }
}

class NotFound extends Error {
    constructor(code = ERROR_CODE.RESOURCE_NOT_FOUND, message = 'Resource not found') {
        super(message)
        this.status = 404
        this.code = code
    }
}

class InternalServerError extends Error {
    constructor(err) {
        super(err.message || 'Internal server error', { cause : err })
        this.status = 500
        this.code = ERROR_CODE.INTERNAL_SERVER_ERROR
    }
}

class ServiceUnavailable extends Error {
    constructor(code, message, cause) {
        super(message, { cause })
        this.status = 503
        this.code = code
    }
}

module.exports = { BadRequest, NotFound, InternalServerError, ServiceUnavailable }
