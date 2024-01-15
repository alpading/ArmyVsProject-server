require('dotenv').config()

const app = require('../src/server')
const port = process.env.PORT


app.listen(port, (req, res) => {
	console.log(port + '번 포트에서 서버 실행')	
})