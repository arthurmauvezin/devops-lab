const express = require('express')

const foodRouter = express()

const rq1_read = require('./rq1_read.js')

foodRouter.use(rq1_read)

module.exports = foodRouter
