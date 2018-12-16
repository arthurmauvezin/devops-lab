const express = require('express')
const cors = require('cors')
const corsOptions = require('../../config/cors.js')
const sql = require('../../config/mysql.js')
const filters = require('./filters/filters.js')

const rq1_read = express()

/** READ */
rq1_read.get("/cages", cors(corsOptions.getCors()), (req, res) => {
  console.log("Get all cages")

  const connection = sql.getConnection()
  var queryString = "SELECT * FROM cages"

  queryString = filters.selection(req, queryString)
  queryString = filters.sorting(req, queryString)
  queryString = filters.filtering(req, queryString)
  queryString = filters.pagination(req, queryString)

  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for cages: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to query for cages")
    res.json(rows)
  })
})

rq1_read.get("/cages/:id(\\d+)", cors(corsOptions.getCors()), (req, res) => {
  console.log("(Console) Get the cages: " + req.params.id)

  // Connection to a MySQL Database
  const connection = sql.getConnection()

  var queryString = "SELECT * FROM cages WHERE id = ?"

  queryString = filters.filtering(req, queryString)

  const userId = req.params.id
  // First SQL Query
  connection.query(queryString, [userId], (err, rows, fields) => {
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
