const env = require('../src/config/env')

const app = require('../src/server')
const port = env.PORT

app.listen(port, (req, res) => {
    console.log(port + '번 포트에서 서버 실행')
})
