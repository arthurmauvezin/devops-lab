const express = require('express')
const cors = require('cors')
const corsOptions = require('../../config/cors.js')
const sql = require('../../config/mysql.js')
const filters = require('./filters/filters.js')

const rq1_read = express()

rq1_read.get("/food-stats", cors(corsOptions.getCors()), (req, res) => {
  const connection = sql.getConnection()
  var queryString = "SELECT a.id, COALESCE(f.quantity/ NULLIF(a.food_per_day,0), 0) AS days_left FROM animals AS a JOIN food as f ON a.id = f.id_animal"

  queryString = filters.selection(req, queryString)
  queryString = filters.sorting(req, queryString)
  queryString = filters.filtering(req, queryString)
  queryString = filters.pagination(req, queryString)

  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      res.sendStatus(500)
      return
    }
    res.json(rows)
  })
})

module.exports = rq1_read
