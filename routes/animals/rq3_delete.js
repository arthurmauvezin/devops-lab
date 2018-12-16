const express = require('express')
const cors = require('cors')
const corsOptions = require('../../config/cors.js')
const sql = require('../../config/mysql.js')

const rq3_delete = express()

/** DELETE */
rq3_delete.delete("/animals", cors(corsOptions.getCors()), (req, res) => {
  console.log("Trying to delete all animals")

  const connection = sql.getConnection()
  const queryString = "DELETE FROM animals"

  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to delete all animals: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to delete all animals ")
    res.sendStatus(200)
  })
})

rq3_delete.delete("/animals/:id(\\d+)", cors(corsOptions.getCors()), (req, res) => {
  console.log("Trying to delete an animal")

  const connection = sql.getConnection()
  const queryString = "DELETE FROM animals WHERE id = ?"
  const userId = req.params.id

  // TODO: check if this animal exists
  connection.query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to delete an animal: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to delete an animal " + userId)
    res.sendStatus(200)
  })
})

module.exports = rq3_delete
