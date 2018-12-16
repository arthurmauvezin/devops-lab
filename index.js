express = require('express');
mysqsl = require('mysql');

app = express();

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/test', function(req, res) {
    res.send('Test page');
});

app.listen(3000, function() {
    console.log('App started!');
});