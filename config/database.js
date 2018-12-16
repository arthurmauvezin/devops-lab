// module.exports = {
//
//     'url' : 'mongodb://127.1.1.0/express' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
//
//      //Please replace your host file Here : 127.1.1.0 , Express is Collection Name (Database Name)
// };
// CONNECTION TO THE DATABASE
const mysql = require('mysql');
var db = mysql.createConnection({
    host:  "localhost" ,
    user: "root",
    password: "" ,
    database: "zoo"
});
module.exports=db;