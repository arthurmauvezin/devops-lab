const express = require('express')
const cors = require('cors')
const corsOptions = require('../../config/cors.js')
const sql = require('../../config/mysql.js')
const bodyParser = require('body-parser') //import body-parser

const rq0_create = express()

/** CREATE */
rq0_create.post("/food", cors(corsOptions.getCors()), (req, res) => {
  console.log("Trying to create a new food")

  const connection = sql.getConnection()
  const name = req.body.name
  const id_animal = req.body.id_animal
  const quantity = req.body.quantity
  const queryString = "INSERT INTO food (name, quantity, id_animal) VALUES ('" + name + "', '" + quantity + "', '" + id_animal + "')"

  connection.query(queryString, [name, quantity, id_animal], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for food: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to query for food")
    res.sendStatus(200)
  })
})

module.exports = rq0_create
