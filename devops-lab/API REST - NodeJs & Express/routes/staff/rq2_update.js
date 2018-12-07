const express = require('express')
const cors = require('cors')
const corsOptions = require('../../config/cors.js')
const sql = require('../../config/mysql.js')
const bodyParser = require('body-parser') //import body-parser

const rq2_update = express()

/** UPDATE */
rq2_update.put("/staff/:id(\\d+)", cors(corsOptions.getCors()), (req, res) => {
  console.log("Trying to update a staff")

  const connection = sql.getConnection()

  var queryString = "UPDATE staff SET "
  var paramList = []

  if(req.body.firstname) {
    const firstname = req.body.firstname
    if(paramList.length >= 1) {
      queryString += ","
    }
    queryString += " firstname = ? "
    paramList.push(firstname)
  }
  if(req.body.lastname) {
    const lastname = req.body.lastname
    if(paramList.length >= 1) {
      queryString += ","
    }
    queryString += " lastname = ? "
    paramList.push(lastname)
  }
  if(req.body.wage) {
    const wage = req.body.wage
    if(paramList.length >= 1) {
      queryString += ","
    }
    queryString += " wage = ? "
    paramList.push(wage)
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
