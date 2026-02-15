const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const { httpLogger } = require('./middleware/httpLogger')
const healthApi = require('./routes/health')
const elemApi = require('./routes/elem')
const selectionApi = require('./routes/selection')
const genreApi = require('./routes/genre')

const errorHandler = require('./middleware/errorHandler')
const { NotFound } = require('./module/customError')
const ERROR_CODE = require('./module/errorCodes')

//global middleware
app.use(
    cors({
        origin: '*',
    })
)
app.use(httpLogger)
app.use(express.json())
app.use(express.static(path.join(__dirname, 'client/build/')))
app.use(cookieParser())

//call api middleware
app.use('/', healthApi)
app.use('/api/elem', elemApi)
app.use('/api/selection', selectionApi)
app.use('/api/genre', genreApi)

//invalid api route
app.use('/api', (req, res, next) => {
    next(new NotFound(ERROR_CODE.ROUTE_NOT_FOUND, 'Invalid Api route'))
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

//errorhandling middleware
app.use(errorHandler())

module.exports = app
