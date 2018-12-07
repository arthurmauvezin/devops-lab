const express = require('express')

const animalsRouter = express()

const rq1_read = require('./rq1_read.js')

animalsRouter.use(rq1_read)

module.exports = animalsRouter
