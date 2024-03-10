const { BadRequest } = require('./customError')

function Validation(input, name) {
	this.input	= () => {
		if(input == undefined || input == "") throw new BadRequest(name + " : 빈 값입니다")
		return this
	}
	
	this.isNumber	= () => {
		if (isNaN(Number(input))) throw new BadRequest(name + " : 숫자가 아닙니다")
		return this
	}
}

const validate = (input, name) => new Validation(input, name)

module.exports = validate