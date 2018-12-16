const express = require('express')
const cors = require('cors')
const corsOptions = require('../../../config/cors.js')
const sql = require('../../../config/mysql.js')
const filters = require('./filters/filters.js')

const rq1_read = express()

/** READ */
rq1_read.get("/animals/:id(\\d+)/food", cors(corsOptions.getCors()), (req, res) => {
  console.log("Get all food")

  const connection = sql.getConnection()
  var queryString = "SELECT f.* FROM animals as a JOIN food as f ON a.id = f.id_animal WHERE a.id = ?"
  const animalId = req.params.id

  queryString = filters.selection(req, queryString)
  queryString = filters.sorting(req, queryString)
  queryString = filters.filtering(req, queryString)
  queryString = filters.pagination(req, queryString)

  connection.query(queryString, [animalId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for food: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to query for food")
    res.json(rows)
  })
})

rq1_read.get("/animals/:animalid(\\d+)/food/:foodid(\\d+)", cors(corsOptions.getCors()), (req, res) => {
  console.log("(Console) Get the animal: " + req.params.id)

  // Connection to a MySQL Database
  const connection = sql.getConnection()

  var queryString = "SELECT f.* FROM animals as a JOIN food as f ON a.id = f.animal WHERE a.id = ? AND f.id = ?"

  queryString = filters.filtering(req, queryString)

  const animalId = req.params.animalid
  const foodId = req.params.foodid

  queryString = filters.selection(req, queryString)
  queryString = filters.sorting(req, queryString)
  queryString = filters.filtering(req, queryString)
  queryString = filters.pagination(req, queryString)

  // First SQL Query
  connection.query(queryString, [animalId, foodId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for animal: " + err)
      res.sendStatus(500)
      return
    }
    console.log("We fetch animal successfuly")

    res.json(rows)
  })
})

module.exports = rq1_read
