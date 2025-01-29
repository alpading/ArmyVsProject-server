const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require("cookie-parser")
const cors = require('cors')


const authApi = require('./routes/auth')
const elemApi = require('./routes/elem')
const selectionApi = require('./routes/selection')
const genreApi = require('./routes/genre')

const errorHandler = require('./middleware/errorHandler')

//cors
app.use(cors({
    origin: '*',
}))

//global middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.use(cookieParser())

//call api middleware
app.use('/auth', authApi)
app.use('/elem', elemApi)
app.use('/selection', selectionApi)
app.use('/genre', genreApi)

//errorhandling middleware
app.use('/', errorHandler)

module.exports = app