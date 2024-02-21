const express = require('express')
const app = express()

const path = require('path')

const authApi = require('./routes/auth')

const errorHandler = require('./middleware/errorHandler')

//global middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

//call api middleware
app.use('/auth', authApi)

//errorhandling middleware
app.use('/', errorHandler)

module.exports = app