const express = require('express')
const cors = require('cors')
const corsOptions = require('../../../config/cors.js')
const sql = require('../../../config/mysql.js')
const filters = require('./filters/filters.js')

const rq1_read = express()

/** READ */
rq1_read.get("/food/:id(\\d+)/animals", cors(corsOptions.getCors()), (req, res) => {
  console.log("Get all animals")

  const connection = sql.getConnection()
  var queryString = "SELECT a.* FROM animals as a JOIN food as f ON a.id = f.id_animal WHERE f.id = ?"
  const foodId = req.params.id

  queryString = filters.selection(req, queryString)
  queryString = filters.sorting(req, queryString)
  queryString = filters.filtering(req, queryString)
  queryString = filters.pagination(req, queryString)

  connection.query(queryString, [foodId], (err, rows, fields) => {
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

rq1_read.get("/food/:id(\\d+)/animals/:animalid(\\d+)", cors(corsOptions.getCors()), (req, res) => {
  console.log("(Console) Get the animal: " + req.params.id)

  const connection = sql.getConnection()
  var queryString = "SELECT a.* FROM animals as a JOIN food as f ON a.id = f.id_animal WHERE f.id = ? AND a.id = ?"

  const foodId = req.params.id
  const animalId = req.params.animalid

  queryString = filters.selection(req, queryString)
  queryString = filters.sorting(req, queryString)
  queryString = filters.filtering(req, queryString)
  queryString = filters.pagination(req, queryString)

  connection.query(queryString, [foodId, animalId], (err, rows, fields) => {
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
