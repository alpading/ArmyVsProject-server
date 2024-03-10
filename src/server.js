const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require("cookie-parser")

const authApi = require('./routes/auth')
const elemApi = require('./routes/elem')

const errorHandler = require('./middleware/errorHandler')

//global middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.use(cookieParser())

//call api middleware
app.use('/auth', authApi)
app.use('/elem', elemApi)

//errorhandling middleware
app.use('/', errorHandler)

module.exports = app