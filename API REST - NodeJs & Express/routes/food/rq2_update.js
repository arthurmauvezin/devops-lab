const express = require('express')
const cors = require('cors')
const corsOptions = require('../../config/cors.js')
const sql = require('../../config/mysql.js')
const bodyParser = require('body-parser') //import body-parser

const rq2_update = express()

/** UPDATE */
rq2_update.put("/food/:id(\\d+)", cors(corsOptions.getCors()), (req, res) => {
  console.log("Trying to update a food")

  const connection = sql.getConnection()

  var queryString = "UPDATE food SET "
  var paramList = []

  if(req.body.name) {
    const name = req.body.name
    if(paramList.length >= 1) {
      queryString += ","
    }
    queryString += " name = ? "
    paramList.push(name)
  }
  if(req.body.quantity) {
    const quantity = req.body.quantity
    if(paramList.length >= 1) {
      queryString += ","
    }
    queryString += " quantity = ? "
    paramList.push(quantity)
  }
  if(req.body.id_animal) {
    const id_animal = req.body.id_animal
    if(paramList.length >= 1) {
      queryString += ","
    }
    queryString += " id_animal = ? "
    paramList.push(id_animal)
  }

  const id = req.params.id
  queryString += " WHERE id = ?"
  paramList.push(id)
  console.log(paramList)
  console.log(queryString)

  // TODO: We have to check if animal #userId is in the table
  connection.query(queryString, paramList, (err, rows, fields) => {
    if (err) {
      console.log("Failed to update an animal: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Succeeded to update animal " + id)
    res.sendStatus(200)
  })
})

module.exports = rq2_update
