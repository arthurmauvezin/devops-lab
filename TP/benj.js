const express = require ( 'express' );
const mysql = require ( 'mysql' );
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));


var db = mysql.createConnection({
host: "localhost" ,
user: "root" ,
password: "" ,
database: "zoo" ,
port: "3306"
});



//CRUD



///Create
app.post('/animals', function(req,res) {
    var query = "INSERT INTO animals ("
    for(var prop in req.body) {
        query+=prop;
        query += ",";
    }
    var query = query.substring(0, query.length-1);
    query += ") VALUES (";
    for(var prop in req.body) {
        query+="'" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query +=")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.post('/staff', function(req,res) {
    var query = "INSERT INTO staff ("
    for(var prop in req.body) {
        query+=prop;
        query += ",";
    }
    var query = query.substring(0, query.length-1);
    query += ") VALUES (";
    for(var prop in req.body) {
        query+="'" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query +=")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});



app.post('/food', function(req,res) {
    var query = "INSERT INTO food ("
    for(var prop in req.body) {
        query+=prop;
        query += ",";
    }
    var query = query.substring(0, query.length-1);
    query += ") VALUES (";
    for(var prop in req.body) {
        query+="'" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query +=")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.post('/cages', function(req,res) {
    var query = "INSERT INTO cages ("
    for(var prop in req.body) {
        query+=prop;
        query += ",";
    }
    var query = query.substring(0, query.length-1);
    query += ") VALUES (";
    for(var prop in req.body) {
        query+="'" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query +=")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});


//Read
app.get( '/' , function (req, res) {
	db.query( "SELECT * FROM users" , function (err, result, fields) {
	if (err) throw err;
	var response = { "page" : "home" , "result" : result };
	res.send( JSON .stringify(response));
	});
});



app.get( '/animals' , function (req, res) {
	var query = "SELECT * FROM animals"
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});

app.get( '/cages' , function (req, res) {
	var query = "SELECT * FROM cages"
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});

app.get( '/food' , function (req, res) {
	var query = "SELECT * FROM food"
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});

app.get( '/staff' , function (req, res) {
	var query = "SELECT * FROM staff"
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});

app.get( '/users' , function (req, res) {
	var query = "SELECT * FROM users"
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});

//Read better
app.get( '/animals/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});

app.get( '/cages/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify(result));x
	});
});

app.get( '/food/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});

app.get( '/staff/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});


//

app.get( '/users/:id/data' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT data.id, data.value FROM users INNER JOIN data ON users.id = data.user_id WHERE users.id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});


app.get( '/users/:id_user/data/:id_data' , function (req, res) {
	var id_user = req.params.id_user;
	var id_data = req.params.id_data;
	var query = "SELECT data.id, data.value FROM users INNER JOIN data ON users.id = data.user_id WHERE users.id=" + id_user + " AND data.id=" +
	id_data;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});





//Put
app.put( '/users/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var username = req.body.username;
	var query = "UPDATE users SET username = '" + username + "' WHERE id="
	+ id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});


//Delete
app.delete( '/animals' , function (req, res) {
	var query = "DELETE FROM animals" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.delete( '/animals/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});
//


app.delete( '/cages' , function (req, res) {
	var query = "DELETE FROM cages" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.delete( '/cages/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});
//

app.delete( '/food' , function (req, res) {
	var query = "DELETE FROM food" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.delete( '/food/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});
//

app.delete( '/staff' , function (req, res) {
	var query = "DELETE FROM staff" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.delete( '/staff/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});
//

app.delete( '/users' , function (req, res) {
	var query = "DELETE FROM users" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.delete( '/users/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM users WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});
//





//Optional filters
app.get( '/query' , function (req, res) {
res.send( JSON .stringify(req.query));
});


//Selection
app.get( '/data' , function (req, res) {
	var query = "SELECT * FROM data" ;

	var conditions = [ "user_id" , "value" ];
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
			query += " WHERE" ;
			} else {
			query += " AND" ;
			}
		query += " " + conditions[index] + "='" +
		req.query[conditions[index]] + "'" ;
		}
	}
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});

//Filtering
app.get( '/data' , function (req, res) {
	var query = "SELECT * FROM data" ;
	if ( "fields" in req.query) {
	query = query.replace( "*" , req.query[ "fields" ]);
	}
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});



//Pagination
app.get( '/data' , function (req, res) {
	var query = "SELECT * FROM data" ;
	if ( "limit" in req.query) {
	query += " LIMIT " + req.query[ "limit" ];
	if ( "offset" in req.query) {
	query += " OFFSET " + req.query[ "offset" ];
	}
	}
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});



app.listen( 3000 , function () {
db.connect( function (err) {
if (err) throw err;
console .log( 'Connection to database successful!' );
});
console .log( 'Example app listening on port 3000!' );
});