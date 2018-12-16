const express = require('express')
const cors = require('cors')
const corsOptions = require('../../config/cors.js')
const sql = require('../../config/mysql.js')
const bodyParser = require('body-parser') //import body-parser

const rq0_create = express()

/** CREATE */
rq0_create.post("/cages", cors(corsOptions.getCors()), (req, res) => {
  console.log("Trying to create a new user")

  const connection = sql.getConnection()
  const name = req.body.name
  const description = req.body.description
  const area = req.body.area
  const queryString = "INSERT INTO cages (name, description, area) VALUES ('" + name + "', '" + description + "', '" + area + "')"

  connection.query(queryString, [name, description, area], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for cages: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to query for cages")
    res.sendStatus(200)
  })
})

module.exports = rq0_create
