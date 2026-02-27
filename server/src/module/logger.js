const pino = require('pino')
const env = require('../config/env')

const isDev = env.NODE_ENV === 'development'

const logger = pino(
    { 
        level : env.LOG_LEVEL
    }, 
    isDev
        ? pino.transport({ // for dev
            target: 'pino-pretty',
            options: {
                translateTime : 'SYS:standard',
                singleLine: true,
                ignore: 'pid, hostname',
            },
        })
        : undefined
)

module.exports = { logger }