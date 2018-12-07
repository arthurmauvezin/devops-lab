const cors = require('cors')

var whitelist =  ['http://localhost:3000', 'http://localhost:3006', 'http://localhost:4200', 'http://localhost:8080']
var localhostRegex = /http:\/\/localhost.*$/
var devRegex = /.*$/
var prodRegex = /.*$/

var corsOptions = {
  origin: function (origin, callback) {
    if ( whitelist.indexOf(origin) !== -1 || localhostRegex.test(origin) || devRegex.test(origin) || prodRegex.test(origin) ) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

exports.getCors = function getCors() {
  return corsOptions
}
