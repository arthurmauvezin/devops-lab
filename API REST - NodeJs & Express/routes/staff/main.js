const express = require('express')

const staffRouter = express()

const rq0_create = require('./rq0_create.js')
const rq1_read = require('./rq1_read.js')
const rq2_update = require('./rq2_update.js')
const rq3_delete = require('./rq3_delete.js')

staffRouter.use(rq0_create)
staffRouter.use(rq1_read)
staffRouter.use(rq2_update)
staffRouter.use(rq3_delete)

module.exports = staffRouter
