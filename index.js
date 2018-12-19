express = require('express');
mysql = require('mysql');

app = express();

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
});

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/test', function(req, res) {
    res.send('Test page');
});

app.listen(3000, function() {
    console.log('App started (Port 3000)');

    // connection.connect(function(error) {
    //     if(error) throw error;
    //     console.info('Info: Connected to the database')
    // });
});