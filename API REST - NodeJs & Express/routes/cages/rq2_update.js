const express = require('express')
const cors = require('cors')
const corsOptions = require('../../config/cors.js')
const sql = require('../../config/mysql.js')
const bodyParser = require('body-parser') //import body-parser

const rq2_update = express()

/** UPDATE */
rq2_update.put("/cages/:id(\\d+)", cors(corsOptions.getCors()), (req, res) => {
  console.log("Trying to update a cage")

  var queryString = "UPDATE cages SET "
  var paramList = []

  if(req.body.name) {
    const name = req.body.name
    if(paramList.length >= 1) {
      queryString += ","
    }
    queryString += " name = ? "
    paramList.push(name)
  }
  if(req.body.description) {
    const description = req.body.description
    if(paramList.length >= 1) {
      queryString += ","
    }
    queryString += " description = ? "
    paramList.push(description)
  }
  if(req.body.area) {
    const area = req.body.area
    if(paramList.length >= 1) {
      queryString += ","
    }
    queryString += " area = ? "
    paramList.push(area)
  }

  const id = req.params.id
  queryString += " WHERE id = ?"
  paramList.push(id)
  console.log(paramList)
  console.log(queryString)

  const connection = sql.getConnection()

  // TODO: We have to check if animal #userId is in the table
  connection.query(queryString, paramList, (err, rows, fields) => {
    if (err) {
      console.log("Failed to update a cage: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to update cage " + id)
    res.sendStatus(200)
  })
})

module.exports = rq2_update
