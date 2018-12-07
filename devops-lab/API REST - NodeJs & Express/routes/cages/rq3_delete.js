const express = require('express')
const cors = require('cors')
const corsOptions = require('../../config/cors.js')
const sql = require('../../config/mysql.js')

const rq3_delete = express()

/** DELETE */
rq3_delete.delete("/cages", cors(corsOptions.getCors()), (req, res) => {
  console.log("Trying to delete all cages")

  const connection = sql.getConnection()
  const queryString = "DELETE FROM cages"

  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to delete all cages: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to delete all cages ")
    res.sendStatus(200)
  })
})

rq3_delete.delete("/cages/:id(\\d+)", cors(corsOptions.getCors()), (req, res) => {
  console.log("Trying to delete a cage")

  const connection = sql.getConnection()
  const queryString = "DELETE FROM cages WHERE id = ?"
  const userId = req.params.id

  // TODO: check if this animal exists
  connection.query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to delete a cage: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to delete a cage " + userId)
    res.sendStatus(200)
  })
})

module.exports = rq3_delete
