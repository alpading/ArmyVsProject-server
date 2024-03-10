const errorHandler = () => {
	return (error, req, res, next) => {
		// console.log(error)
		// res.send(error.message)
	}
}

module.exports = errorHandler