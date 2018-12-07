const express = require('express')

const animalsRouter = express()

const cages = require('./cages/main.js')
const food = require('./food/main.js')
const rq0_create = require('./rq0_create.js')
const rq1_read = require('./rq1_read.js')
const rq2_update = require('./rq2_update.js')
const rq3_delete = require('./rq3_delete.js')

animalsRouter.use(cages)
animalsRouter.use(food)
animalsRouter.use(rq0_create)
animalsRouter.use(rq1_read)
animalsRouter.use(rq2_update)
animalsRouter.use(rq3_delete)

module.exports = animalsRouter
