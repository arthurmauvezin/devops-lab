const express = require('express')
const cors = require('cors')
const corsOptions = require('../../config/cors.js')
const sql = require('../../config/mysql.js')
const bodyParser = require('body-parser') //import body-parser

const rq2_update = express()

/** UPDATE */
rq2_update.put("/animals/:id(\\d+)", cors(corsOptions.getCors()), (req, res) => {
  console.log("Trying to update an animal")

  const connection = sql.getConnection()

  var queryString = "UPDATE animals SET "
  var paramList = []

  if(req.body.name) {
    const name = req.body.name
    if(paramList.length >= 1) {
      queryString += ","
    }
    queryString += " name = ? "
    paramList.push(name)
  }
  if(req.body.breed) {
    const breed = req.body.breed
    if(paramList.length >= 1) {
      queryString += ","
    }
    queryString += " breed = ? "
    paramList.push(breed)
  }
  if(req.body.food_per_day) {
    const food_per_day = req.body.food_per_day
    if(paramList.length >= 1) {
      queryString += ","
    }
    queryString += " food_per_day = ? "
    paramList.push(food_per_day)
  }
  if(req.body.birthday) {
    const birthday = req.body.birthday
    if(paramList.length >= 1) {
      queryString += ","
    }
    queryString += " birthday = ? "
    paramList.push(birthday)
  }
  if(req.body.entry_date) {
    const entry_date = req.body.entry_date
    if(paramList.length >= 1) {
      queryString += ","
    }
    queryString += " entry_date = ? "
    paramList.push(entry_date)
  }
  if(req.body.id_cage) {
    const id_cage = req.body.id_cage
    if(paramList.length >= 1) {
      queryString += ","
    }
    queryString += " id_cage = ? "
    paramList.push(id_cage)
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
