const express = require('express')
const cors = require('cors')
const corsOptions = require('../../config/cors.js')
const sql = require('../../config/mysql.js')
const bodyParser = require('body-parser') //import body-parser

const rq0_create = express()

/** CREATE */
rq0_create.post("/staff", cors(corsOptions.getCors()), (req, res) => {
  console.log("Trying to create a new user")

  const connection = sql.getConnection()
  const firstname = req.body.firstname
  const lastname = req.body.lastname
  const wage = req.body.wage
  const queryString = "INSERT INTO staff (firstname, lastname, wage) VALUES ('" + firstname + "', '" + lastname + "', '" + wage + "')"

  connection.query(queryString, [firstname, lastname, wage], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for staff: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to query for staff")
    res.sendStatus(200)
  })
})

module.exports = rq0_create
