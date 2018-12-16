const express = require('express')
const cors = require('cors')
const corsOptions = require('../../config/cors.js')
const sql = require('../../config/mysql.js')
const filters = require('./filters/filters.js')

const rq1_read = express()

/** READ */
rq1_read.get("/staff", cors(corsOptions.getCors()), (req, res) => {
  console.log("Get all staff")

  const connection = sql.getConnection()
  var queryString = "SELECT * FROM staff"

  queryString = filters.selection(req, queryString)
  queryString = filters.sorting(req, queryString)
  queryString = filters.filtering(req, queryString)
  queryString = filters.pagination(req, queryString)

  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for staff: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to query for staff")
    res.json(rows)
  })
})

rq1_read.get("/staff/:id(\\d+)", cors(corsOptions.getCors()), (req, res) => {
  console.log("(Console) Get a staff: " + req.params.id)

  // Connection to a MySQL Database
  const connection = sql.getConnection()

  var queryString = "SELECT * FROM staff WHERE id = ?"

  queryString = filters.filtering(req, queryString)

  const userId = req.params.id
  // First SQL Query
  connection.query(queryString, [userId], (err, rows, fields) => {
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
