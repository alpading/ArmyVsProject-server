const pinoHttp = require('pino-http')
const { nanoid } = require('nanoid')
const { logger } = require('../module/logger')

const genReqId = (req, res) => {
    const id = nanoid(12)

    res.setHeader('x-request-id', id)
    return id
}

const httpLogger = pinoHttp({
    logger,
    genReqId,
    customLogLevel(req, res, err){
        if (res.statusCode === 503) return 'warn'
        if (res.statusCode >= 500) return 'error'
        if (res.statusCode >= 400) return 'warn'
        return 'info'
    },
    serializers: {
        req(req) {
            return { id : req.id, method: req.method, url: req.url }
        },
        res(res) {
            return { statusCode: res.statusCode }
        }
    },
    customSuccessObject(req, res) {
        return { req, res, responseTime: res.responseTime }
    },

    customErrorObject(req, res) {
        return { req, res, responseTime: res.responseTime }
    },

    customSuccessMessage(req, res) {
        return `${req.method} ${req.url} -> ${res.statusCode}`
    },

    customErrorMessage(req, res, err) {
        return `${req.method} ${req.url} -> ${res.statusCode}`
    },
})

module.exports = { httpLogger }