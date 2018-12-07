const express = require('express')
const cors = require('cors')
const corsOptions = require('../../config/cors.js')
const sql = require('../../config/mysql.js')
const bodyParser = require('body-parser') //import body-parser

const rq0_create = express()

/** CREATE */
rq0_create.post("/animals", cors(corsOptions.getCors()), (req, res) => {
  console.log("Trying to create a new user")

  const connection = sql.getConnection()
  const name = req.body.name
  const breed = req.body.breed
  const food_per_day = req.body.food_per_day
  const birthday = req.body.birthday
  const entry_date = req.body.entry_date
  const id_cage = req.body.id_cage
  const queryString = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('" + name + "', '" + breed + "', '" + food_per_day + "', '" + birthday + "', '" + entry_date + "', '" + id_cage + "')"

  connection.query(queryString, [name, breed, food_per_day, birthday, entry_date, id_cage], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for animals: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to query for animals")
    res.sendStatus(200)
  })
})

module.exports = rq0_create
