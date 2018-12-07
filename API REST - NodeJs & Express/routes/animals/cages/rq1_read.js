const express = require('express')
const cors = require('cors')
const corsOptions = require('../../../config/cors.js')
const sql = require('../../../config/mysql.js')
const filters = require('./filters/filters.js')

const rq1_read = express()

/** READ */
rq1_read.get("/animals/:id(\\d+)/cages", cors(corsOptions.getCors()), (req, res) => {
  console.log("Get all cages")

  const connection = sql.getConnection()
  const animalId = req.params.id
  var queryString = "SELECT c.* FROM cages as c JOIN animals as a ON c.id = a.id_cage WHERE a.id = ?"

  queryString = filters.selection(req, queryString)
  queryString = filters.sorting(req, queryString)
  queryString = filters.filtering(req, queryString)
  queryString = filters.pagination(req, queryString)

  connection.query(queryString, [animalId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for cages: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to query for cages")
    res.json(rows)
  })
})

rq1_read.get("/animals/:id(\\d+)/cages/:cageid(\\d+)", cors(corsOptions.getCors()), (req, res) => {
  console.log("(Console) Get the cages: " + req.params.id)

  // Connection to a MySQL Database
  const connection = sql.getConnection()

  var queryString = "SELECT c.* FROM cages as c JOIN animals as a ON c.id = a.id_cage WHERE a.id = ? AND c.id = ?"

  queryString = filters.filtering(req, queryString)

  const animalId = req.params.id
  const cageId = req.params.cageid
  // First SQL Query
  connection.query(queryString, [animalId, cageId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for cage: " + err)
      res.sendStatus(500)
      return
    }
    console.log("We fetch cage successfuly")

    res.json(rows)
  })
})

module.exports = rq1_read
