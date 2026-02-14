const pino = require('pino')

const isDev = process.env.NODE_ENV === 'dev'

const logger = pino(
    { 
        level : process.env.LOG_LEVEL
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