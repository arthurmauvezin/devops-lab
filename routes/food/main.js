const express = require('express')

const foodRouter = express()

const animals = require('./animals/main.js')
const rq0_create = require('./rq0_create.js')
const rq1_read = require('./rq1_read.js')
const rq2_update = require('./rq2_update.js')
const rq3_delete = require('./rq3_delete.js')

foodRouter.use(animals)
foodRouter.use(rq0_create)
foodRouter.use(rq1_read)
foodRouter.use(rq2_update)
foodRouter.use(rq3_delete)

module.exports = foodRouter
