const express=require('express');
const app = express();
const mysql = require('mysql');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, function() {});
var db = require('./config/database.js');
require('./config/routes.js')(app);
console.log('Example app listening on port 3000!');
db.connect( function(err) {
    if(err) throw err;
    console.log('Connection to database successful!');
});
