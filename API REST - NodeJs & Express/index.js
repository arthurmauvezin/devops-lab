// Load our app using express
const express = require('express') // import express
const app = express() // add an instance of express
const morgan = require('morgan') // import morgan
const bodyParser = require('body-parser') //import body-parser
const cors = require('cors')
const fs = require('fs')
const http = require('http')
const https = require('https')

const corsOptions = require('./config/cors.js')
const sql = require('./config/mysql.js')


const animalsRouter = require('./routes/animals/main.js')
const cagesRouter = require('./routes/cages/main.js')
const foodRouter = require('./routes/food/main.js')
const foodStatsRouter = require('./routes/food-stats/main.js')
const staffRouter = require('./routes/staff/main.js')

app.use(express.static('./public')) // to let server to public folder as a static route

/** Firewall with key=thisismytoken */
app.use(function(req, res, next) {
  /*
  if ("key" in req.query && req.query["key"] == "thisismytoken") {
    next()
  } else {
    res.sendStatus(401)
    return
  }
  */

  if ("key" in req.query) {
    const connection = sql.getConnection()
    const queryString = "SELECT * FROM users WHERE apikey = ?"
    const key = req.query["key"]
    //const key = "thisismytoken"

    connection.query(queryString, [key], (err, rows, fields) => {
      if (err) {
        console.log("Blocked by firewall: " + err)
        res.sendStatus(401)
        return
      }
      if (rows.length > 0) {
        next()
      } else {
        console.log("Access denied")
        res.sendStatus(403)
        return
      }
    })
  } else {
    console.log("Access denied")
    res.sendStatus(403)
  }

})

// HTTPS
/*
var key = fs.readFileSync('encryption/private.key')
var cert = fs.readFileSync( 'encryption/primary.crt' )
var ca = fs.readFileSync( 'encryption/primary.crt' ) // need of intermediate.crt

var options = {
  key: key,
  cert: cert,
  ca: ca
}
*/
//https.createServer(options, app).listen(3007)
//http.createServer(app).listen(3000)

// To force HTTPS port
/*
app.use(function(req, res, next) {
  if (req.secure) {
    next()
  } else {
    res.redirect('https://' + 'localhost:3007' + req.url)
  }
})
*/

// END of https

app.use(morgan('short')) // 'short', or 'combined' to more details
app.use(bodyParser.urlencoded({extended: true})) // to help to understant POST request and form data

app.use(animalsRouter)
app.use(cagesRouter)
app.use(foodRouter)
app.use(foodStatsRouter)
app.use(staffRouter)


app.get("/", cors(corsOptions.getCors()), (req, res) => {
  console.log("Responding to root route")
  res.send("Hello from ROOT.")
})

/*
app.listen(3006, () => {
  console.log("Server is up and listening on 3006...")
})
*/
