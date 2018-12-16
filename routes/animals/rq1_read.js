const express = require('express')
const cors = require('cors')
const corsOptions = require('../../config/cors.js')
const sql = require('../../config/mysql.js')
const filters = require('./filters/filters.js')

const rq1_read = express()

/** READ */
rq1_read.get("/animals", cors(corsOptions.getCors()), (req, res) => {
  console.log("Get all animals")

  const connection = sql.getConnection()
  var queryString = "SELECT * FROM animals"

  queryString = filters.selection(req, queryString)
  queryString = filters.sorting(req, queryString)
  queryString = filters.filtering(req, queryString)
  queryString = filters.pagination(req, queryString)

  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for animals: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to query for animals")
    res.status(200).json(rows)
    //res.sendStatus(200)
  })
})

rq1_read.get("/animals/:id(\\d+)", cors(corsOptions.getCors()), (req, res) => {
  console.log("(Console) Get the animal: " + req.params.id)

  const connection = sql.getConnection()
  var queryString = "SELECT * FROM animals WHERE id = ?"

  queryString = filters.filtering(req, queryString)

  const userId = req.params.id
  connection.query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for animal: " + err)
      res.sendStatus(500)
      return
    }
    console.log("We fetch animal successfuly")

    res.status(200).json(rows)
  })
})

module.exports = rq1_read
