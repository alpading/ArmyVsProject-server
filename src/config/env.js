const { ConfigurationError } = require('../module/customError')
const ERROR_CODE = require('../module/errorCodes')

const required = (key, defaultValue) => {
    let value = process.env[key]
    if (value != undefined) value = String(value).trim()

    if (!value && defaultValue != undefined){
        return defaultValue
    }

    if (!value){
        throw new ConfigurationError(ERROR_CODE.CONFIG_MISSING, `Environment variable ${key} is missing`)
    }
    return value
}

const number = (key, defaultValue) => {
    let value = process.env[key]
    if (value != undefined) value = String(value).trim()
    
    if((!value || value === '') && defaultValue != undefined){
        return defaultValue
    }

    if((!value || value === '')){
        throw new ConfigurationError(ERROR_CODE.CONFIG_MISSING, `Environment variable ${key} is missing`)
    }

    if(isNaN(value)){
        throw new ConfigurationError(ERROR_CODE.CONFIG_INVALID, `Environment variable ${key} must be number`)
    }
    
    return Number(value)
}

module.exports = {
    NODE_ENV: required('NODE_ENV', 'development'),
    PORT: number('PORT', 3000),
    DATABASE_URL: required('DATABASE_URL'),
    DATABASE_POOL_MAX: number('DATABASE_POOL_MAX', 30),
    LOG_LEVEL: required('LOG_LEVEL', 'debug')
}
