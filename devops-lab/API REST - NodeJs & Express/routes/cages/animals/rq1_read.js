const express = require('express')
const cors = require('cors')
const corsOptions = require('../../../config/cors.js')
const sql = require('../../../config/mysql.js')
const filters = require('./filters/filters.js')

const rq1_read = express()

/** READ */
rq1_read.get("/cages/:id(\\d+)/animals", cors(corsOptions.getCors()), (req, res) => {
  console.log("Get all animals")

  const connection = sql.getConnection()
  const cageId = req.params.id
  var queryString = "SELECT a.* FROM cages as c JOIN animals as a ON c.id = a.id_cage WHERE c.id = ?"

  queryString = filters.selection(req, queryString)
  queryString = filters.sorting(req, queryString)
  queryString = filters.filtering(req, queryString)
  queryString = filters.pagination(req, queryString)

  connection.query(queryString, [cageId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for animals: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succed to query for animals")
    res.json(rows)
  })
})

rq1_read.get("/cages/:cageid(\\d+)/animals/:animalid(\\d+)", cors(corsOptions.getCors()), (req, res) => {
  console.log("(Console) Get the animal: " + req.params.id)

  const connection = sql.getConnection()
  var queryString = "SELECT a.* FROM cages as c JOIN animals as a ON c.id = a.id_cage WHERE c.id = ? AND a.id = ?"

  queryString = filters.filtering(req, queryString)

  const cageId = req.params.cageid
  const animalId = req.params.animalid

  queryString = filters.selection(req, queryString)
  queryString = filters.sorting(req, queryString)
  queryString = filters.filtering(req, queryString)
  queryString = filters.pagination(req, queryString)

  connection.query(queryString, [cageId, animalId], (err, rows, fields) => {
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
