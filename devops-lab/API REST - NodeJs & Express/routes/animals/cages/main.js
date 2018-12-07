const express = require('express')

const cagesRouter = express()

const rq1_read = require('./rq1_read.js')

cagesRouter.use(rq1_read)

module.exports = cagesRouter
