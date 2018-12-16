express = require('express');
mysql = require('mysql');

app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zoo',
    port: '3306'
});

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/test', function(req, res) {
    res.send('Test page');
});

app.listen(3000, function() {
    console.log('App started (Port 3000)');
});