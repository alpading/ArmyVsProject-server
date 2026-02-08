const { BadRequest } = require('./customError')
const ERROR_CODE = require('./errorCodes')

function Validation(input, name) {
    this.required = () => {
        if (input == undefined || input == '') {
            throw new BadRequest(ERROR_CODE.REQUIRED_FEILD_MISSING, name + ' is null')
        }
        return this
    }

    this.number = () => {
        if (isNaN(Number(input))) {
            throw new BadRequest(ERROR_CODE.INVALID_FORMAT, name + ' is not a number')
        }
        return this
    }
}

const validate = (input, name) => new Validation(input, name)

module.exports = validate
