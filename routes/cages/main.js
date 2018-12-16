const express = require('express')

const cagesRouter = express()

const animals = require('./animals/main.js')
const rq0_create = require('./rq0_create.js')
const rq1_read = require('./rq1_read.js')
const rq2_update = require('./rq2_update.js')
const rq3_delete = require('./rq3_delete.js')

cagesRouter.use(animals)
cagesRouter.use(rq0_create)
cagesRouter.use(rq1_read)
cagesRouter.use(rq2_update)
cagesRouter.use(rq3_delete)

module.exports = cagesRouter
