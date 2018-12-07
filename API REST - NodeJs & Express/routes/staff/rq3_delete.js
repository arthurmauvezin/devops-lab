const express = require('express')
const cors = require('cors')
const corsOptions = require('../../config/cors.js')
const sql = require('../../config/mysql.js')

const rq3_delete = express()

/** DELETE */
rq3_delete.delete("/staff", cors(corsOptions.getCors()), (req, res) => {
  console.log("Trying to delete all staff")

  const connection = sql.getConnection()
  const queryString = "DELETE FROM staff"

  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to delete all staff: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to delete all staff ")
    res.sendStatus(200)
  })
})

rq3_delete.delete("/staff/:id(\\d+)", cors(corsOptions.getCors()), (req, res) => {
  console.log("Trying to delete an animal")

  const connection = sql.getConnection()
  const queryString = "DELETE FROM staff WHERE id = ?"
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
