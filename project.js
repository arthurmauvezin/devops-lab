//Lab1 - Creation of a simple web service

const express = require ( 'express' ); // import the express library into the"express" constant
const app = express(); //create an "express application" into the "app" constant 
const mysql = require ( 'mysql' ); //add the mysql libray to allow to set up a connection with the database.

const bodyParser = require ( 'body-parser' ); //use the body-parser library which allows us to extract the data from our POST request of type x-www-form-urlencoded.
app.use(bodyParser.urlencoded({ extended: true })); //To use the body-parser library in our application we use this method

var db = mysql.createConnection({ //create a new connection to prepare the login information
	host: "localhost" ,
	user: "root" ,
	password: "" ,
	database: "zoo" ,
	port: "3306"
});

app.get( '/query' , function (req, res) { //we use req.query object to access the values for filters
	res.send( JSON .stringify(req.query));
});

//Lab4 - Firewall

app.use(function (req, res, next) {
    //checks if the user provided his apikey as a parameter

    console.log(req.originalUrl);
    console.log(req.body);

    if ("key" in req.query) {
        var query = "SELECT * from users where apikey='" + req.query["key"] + "'";

        db.query(query, function (err, result, fields) {
            if (err) throw err;

            if (result.length > 0) {
                //we got a result for the apikey
                next();
            } else {
                //no results, token was invalid or did not match any user
                res.status(403).send("access denied");
            }
        });
    } else {
        //no token provided in query
        res.status(403).send("access denied");
        //res.send("acess denied, user did not provide a key");
    }
});

//Lab2 - Implementation of CRUD

// ---------------------------- DIFFERENT ROUTES FOR ANIMALS ---------------------------- //

// ************** POST: allow the creation ************** // 

app.post('/animals/', function(req, res) {
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;

	var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" + name + "','" + breed + "','" + food_per_day + "','" + birthday + "','" + entry_date + "','" + id_cage + "')";
	db.query(query, function(err, result, fields) {	
		if (err) throw err;
		
		res.send(JSON.stringify("Success"));
	});
});

// ************** GET: allow the reading: the whole animals table is retrieved and returned in JSON response ************** //

app.get('/animals/', function(req, res) { 
	var query = "SELECT * FROM animals"

	var conditions = [ "name" , "breed","food_per_day","birthday","entry_date","id_cage" ];
	
	for ( var index in conditions) { // FILTER BY SELECTION (?key1=value1&key2=value2)
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}

			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'" ;
		}
	}
	
	if ( "sort" in req.query) { // FILTER BY SORTING (?sort=+value,-id)
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
	
		for ( var index in sort) {
			var direction = sort[index].substr( 0 , 1 );
			var field = sort[index].substr( 1 );
			query += " " + field;

			if (direction == "-" )
				query += " DESC," ;
			else
				query += " ASC," ;
		}

		query = query.slice( 0 , -1 );
	}

	if ( "fields" in req.query) { // FILTER BY FILTERING (?fields=value)
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) { // FILTER BY PAGINATION
		query += " LIMIT " + req.query[ "limit" ];

		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});

// ************** GET: allow the reading: all fields are selected in the animals table with the id passed as a routing parameter ********** //

app.get('/animals/:id/', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id=" + id;

	var conditions = [ "name" , "breed","food_per_day","birthday","entry_date","id_cage" ];

	for ( var index in conditions) { // FILTER BY SELECTION (?key1=value1&key2=value2)
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}

			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'" ;
		}
	}
	
	if ( "sort" in req.query) { // FILTER BY SORTING (?sort=+value,-id)
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
	
		for ( var index in sort) {
			var direction = sort[index].substr( 0 , 1 );
			var field = sort[index].substr( 1 );
			query += " " + field;

			if (direction == "-" )
				query += " DESC," ;
			else
				query += " ASC," ;
		}

		query = query.slice( 0 , -1 );
	}

	if ( "fields" in req.query) { // FILTER BY FILTERING (?fields=value)
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) { // FILTER BY PAGINATION
		query += " LIMIT " + req.query[ "limit" ];

		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

// ************** UPDATE: allow the modification ********** //

app.put('/animals/:id/', function(req, res) {
	var id = req.params.id;
	var query = "UPDATE animals SET";
	var fields = ["name","breed","food_per_day","birthday","entry_date","id_cage"]; //list of all fields of "animals" that can be update

	for (var i in fields) { //
		if (fields[i]in req.body){
			query += " " + fields[i] + "='" + req.body[fields[i]] + "' ,";
		}
	}

	query = query.slice(0, -1);
	query += "WHERE id=" + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

// ************** DELETE: allow the deletion: the whole animals table is deleted ********** //

app.delete('/animals/', function(req, res) {
	var query = "DELETE FROM animals";
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
	
		res.send(JSON.stringify("Success"));
	});
});

// ************** DELETE: allow the deletion: only the row with the id specified is deleted  ********** //

app.delete('/animals/:id/', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id=" + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});


// ---------------------------- DIFFERENT ROUTES FOR CAGES ---------------------------- //

// ************** POST: allow the creation ************** // 

app.post('/cages/', function(req, res) {
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;

	var query = "INSERT INTO cages (name,description,area) VALUES ('" + name + "','" + description + "','" + area + "')";
	db.query(query, function(err, result, fields) {	
		if (err) throw err;
		
		res.send(JSON.stringify("Success"));
	});
});

// ************** GET: allow the reading: the whole cages table is retrieved and returned in JSON response ************** //

app.get('/cages/', function(req, res) { 
	var query = "SELECT * FROM cages"


	var conditions = [ "name" , "description","area"];
	
	for ( var index in conditions) { // FILTER BY SELECTION (?key1=value1&key2=value2)
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}

			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'" ;
		}
	}

	if ( "sort" in req.query) { // FILTER BY SORTING (?sort=+value,-id)
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
	
		for ( var index in sort) {
			var direction = sort[index].substr( 0 , 1 );
			var field = sort[index].substr( 1 );
			query += " " + field;

			if (direction == "-" )
				query += " DESC," ;
			else
				query += " ASC," ;
		}

		query = query.slice( 0 , -1 );
	}

	if ( "fields" in req.query) { // FILTER BY FILTERING (?fields=value)
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) { // FILTER BY PAGINATION
		query += " LIMIT " + req.query[ "limit" ];

		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});

// ************** GET: allow the reading: all fields are selected in the cages table with the id passed as a routing parameter ********** //

app.get('/cages/:id/', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;

	var conditions = [ "name" , "description","area"];

	for ( var index in conditions) { // FILTER BY SELECTION (?key1=value1&key2=value2)
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}

			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'" ;
		}
	}

	if ( "sort" in req.query) { // FILTER BY SORTING (?sort=+value,-id)
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
	
		for ( var index in sort) {
			var direction = sort[index].substr( 0 , 1 );
			var field = sort[index].substr( 1 );
			query += " " + field;

			if (direction == "-" )
				query += " DESC," ;
			else
				query += " ASC," ;
		}

		query = query.slice( 0 , -1 );
	}

	if ( "fields" in req.query) { // FILTER BY FILTERING (?fields=value)
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) { // FILTER BY PAGINATION
		query += " LIMIT " + req.query[ "limit" ];

		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

// ************** UPDATE: allow the modification ********** //

app.put('/cages/:id/', function(req, res) {
	var id = req.params.id;
	var query = "UPDATE cages SET";
	var fields = ["name","description","area"]; //list of all fields of "cages" that can be update

	for (var i in fields) { //
		if (fields[i]in req.body){
			query += " " + fields[i] + "='" + req.body[fields[i]] + "' ,";
		}
	}

	query = query.slice(0, -1);
	query += "WHERE id=" + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

// ************** DELETE: allow the deletion: the whole cages table is deleted ********** //

app.delete('/cages/', function(req, res) {
	var query = "DELETE FROM cages";
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
	
		res.send(JSON.stringify("Success"));
	});
});

// ************** DELETE: allow the deletion: only the row with the id specified is deleted  ********** //

app.delete('/cages/:id/', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id=" + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

// ---------------------------- DIFFERENT ROUTES FOR FOOD ---------------------------- //

// ************** POST: allow the creation ************** // 

app.post('/food/', function(req, res) {
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;

	var query = "INSERT INTO food (name,quantity,id_animal) VALUES ('" + name + "','" + quantity + "','" + id_animal + "')";
	db.query(query, function(err, result, fields) {	
		if (err) throw err;
		
		res.send(JSON.stringify("Success"));
	});
});

// ************** GET: allow the reading: the whole food table is retrieved and returned in JSON response ************** //

app.get('/food/', function(req, res) { 
	var query = "SELECT * FROM food"

	var conditions = [ "name" , "quantity","id_animal"];
	
	for ( var index in conditions) { // FILTER BY SELECTION (?key1=value1&key2=value2)
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}

			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'" ;
		}
	}

	if ( "sort" in req.query) { // FILTER BY SORTING (?sort=+value,-id)
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
	
		for ( var index in sort) {
			var direction = sort[index].substr( 0 , 1 );
			var field = sort[index].substr( 1 );
			query += " " + field;

			if (direction == "-" )
				query += " DESC," ;
			else
				query += " ASC," ;
		}

		query = query.slice( 0 , -1 );
	}

	if ( "fields" in req.query) { // FILTER BY FILTERING (?fields=value)
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) { // FILTER BY PAGINATION
		query += " LIMIT " + req.query[ "limit" ];

		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});

// ************** GET: allow the reading: all fields are selected in the food table with the id passed as a routing parameter ********** //

app.get('/food/:id/', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id=" + id;

	var conditions = [ "name" , "quantity","id_animal"];
	
	for ( var index in conditions) { // FILTER BY SELECTION (?key1=value1&key2=value2)
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}

			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'" ;
		}
	}

	if ( "sort" in req.query) { // FILTER BY SORTING (?sort=+value,-id)
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
	
		for ( var index in sort) {
			var direction = sort[index].substr( 0 , 1 );
			var field = sort[index].substr( 1 );
			query += " " + field;

			if (direction == "-" )
				query += " DESC," ;
			else
				query += " ASC," ;
		}

		query = query.slice( 0 , -1 );
	}

	if ( "fields" in req.query) { // FILTER BY FILTERING (?fields=value)
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) { // FILTER BY PAGINATION
		query += " LIMIT " + req.query[ "limit" ];

		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

// ************** UPDATE: allow the modification ********** //

app.put('/food/:id/', function(req, res) {
	var id = req.params.id;
	var query = "UPDATE food SET";
	var fields = ["name","quantity","id_animal"]; //list of all fields of "food" that can be update

	for (var i in fields) { //
		if (fields[i]in req.body){
			query += " " + fields[i] + "='" + req.body[fields[i]] + "' ,";
		}
	}

	query = query.slice(0, -1);
	query += "WHERE id=" + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

// ************** DELETE: allow the deletion: the whole food table is deleted ********** //

app.delete('/food/', function(req, res) {
	var query = "DELETE FROM food";
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
	
		res.send(JSON.stringify("Success"));
	});
});

// ************** DELETE: allow the deletion: only the row with the id specified is deleted  ********** //

app.delete('/food/:id/', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id=" + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

// ---------------------------- DIFFERENT ROUTES FOR STAFF ---------------------------- //

// ************** POST: allow the creation ************** // 

app.post('/staff/', function(req, res) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;

	var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('" + firstname + "','" + lastname + "','" + wage + "')";
	db.query(query, function(err, result, fields) {	
		if (err) throw err;
		
		res.send(JSON.stringify("Success"));
	});
});

// ************** GET: allow the reading: the whole staff table is retrieved and returned in JSON response ************** //

app.get('/staff/', function(req, res) { 
	var query = "SELECT * FROM staff"

	var conditions = [ "firstname" , "lastname","wage"];
	
	for ( var index in conditions) { // FILTER BY SELECTION (?key1=value1&key2=value2)
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}

			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'" ;
		}
	}

	if ( "sort" in req.query) { // FILTER BY SORTING (?sort=+value,-id)
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
	
		for ( var index in sort) {
			var direction = sort[index].substr( 0 , 1 );
			var field = sort[index].substr( 1 );
			query += " " + field;

			if (direction == "-" )
				query += " DESC," ;
			else
				query += " ASC," ;
		}

		query = query.slice( 0 , -1 );
	}

	if ( "fields" in req.query) { // FILTER BY FILTERING (?fields=value)
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) { // FILTER BY PAGINATION
		query += " LIMIT " + req.query[ "limit" ];

		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});

// ************** GET: allow the reading: all fields are selected in the food table with the id passed as a routing parameter ********** //

app.get('/staff/:id/', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id=" + id;

	var conditions = [ "firstname" , "lastname","wage"];
	
	for ( var index in conditions) { // FILTER BY SELECTION (?key1=value1&key2=value2)
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}

			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'" ;
		}
	}

	if ( "sort" in req.query) { // FILTER BY SORTING (?sort=+value,-id)
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
	
		for ( var index in sort) {
			var direction = sort[index].substr( 0 , 1 );
			var field = sort[index].substr( 1 );
			query += " " + field;

			if (direction == "-" )
				query += " DESC," ;
			else
				query += " ASC," ;
		}

		query = query.slice( 0 , -1 );
	}

	if ( "fields" in req.query) { // FILTER BY FILTERING (?fields=value)
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) { // FILTER BY PAGINATION
		query += " LIMIT " + req.query[ "limit" ];

		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

// ************** UPDATE: allow the modification ********** //

app.put('/staff/:id/', function(req, res) {
	var id = req.params.id;
	var query = "UPDATE staff SET";
	var fields = ["firstname","lastname","wage"]; //list of all fields of "staff" that can be update

	for (var i in fields) { //
		if (fields[i]in req.body){
			query += " " + fields[i] + "='" + req.body[fields[i]] + "' ,";
		}
	}

	query = query.slice(0, -1);
	query += "WHERE id=" + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

// ************** DELETE: allow the deletion: the whole staff table is deleted ********** //

app.delete('/staff/', function(req, res) {
	var query = "DELETE FROM staff";
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
	
		res.send(JSON.stringify("Success"));
	});
});

// ************** DELETE: allow the deletion: only the row with the id specified is deleted  ********** //

app.delete('/staff/:id/', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id=" + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

app.listen( 3000 , function () {
	console .log( 'Example app listening on port 3000!' );
});

//Lab3 - Relations and filters

// ---------------------------- RELATIONSHIPS ---------------------------- //

// ************** RELATIONS FOOD / ANIMALS  ********** //

app.get( '/food/:id/animals/' , function (req, res) { // "animals in food: read all"
	var id = req.params.id;
	var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal=animals.id WHERE food.id=" + id;

	var conditions = [ "name" , "breed","food_per_day","birthday","entry_date","id_cage" ];
	
	for ( var index in conditions) { // FILTER BY SELECTION (?key1=value1&key2=value2)
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}

			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'" ;
		}
	}
	if ( "fields" in req.query) { // FILTER BY FILTERING (?fields=value)
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) { // FILTER BY PAGINATION
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

app.get( '/food/:id_food/animals/:id_animal/' , function (req, res) { // "animals in food: read one"
	var id_food = req.params.id_food;
	var id_animal = req.params.id_animal;
	var query = "SELECT animals.id FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE animals.id =" + id_animal+ " AND food.id ="+ id_food;

	db.query(query, function (err, result, fields) {
		if (err) throw err;

		res.send( JSON .stringify(result));
	});
});

app.get( '/animals/:id/food/' , function (req, res) { // "food in animals: read all" 
	var id = req.params.id;
	var query = "SELECT food.* FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE animals.id=" + id;

	var conditions = [ "name" , "quantity","id_animal"];
	
	for ( var index in conditions) { // FILTER BY SELECTION (?key1=value1&key2=value2)
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}

			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'" ;
		}
	}
	if ( "fields" in req.query) { // FILTER BY FILTERING (?fields=value)
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) { // FILTER BY PAGINATION
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

// ************** RELATIONS ANIMALS / CAGES  ********** //

app.get( '/animals/:id/cages/' , function (req, res) { // "cages in animals: read all" 
	var id = req.params.id;
	var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage= cages.id WHERE animals.id=" + id;

	var conditions = [ "name" , "description","area"];
	
	for ( var index in conditions) { // FILTER BY SELECTION (?key1=value1&key2=value2)
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}

			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'" ;
		}
	}
	if ( "fields" in req.query) { // FILTER BY FILTERING (?fields=value)
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) { // FILTER BY PAGINATION
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

app.get( '/animals/:id_animal/cages/:id_cage/' , function (req, res) { // "cages in animals: read one"
	var id_animal = req.params.id_animal;
	var id_cage = req.params.id_cage;
	var query = "SELECT cages.id FROM animals INNER JOIN cages ON animals.id_cage= cages.id WHERE animals.id =" + id_animal+ " AND cages.id ="+ id_cage;

	db.query(query, function (err, result, fields) {
		if (err) throw err;

		res.send( JSON .stringify(result));
	});
});

app.get( '/cages/:id/animals/' , function (req, res) { // "animals in cage: read all"
	var id = req.params.id;
	var query = "SELECT animals.* FROM cages INNER JOIN animals ON animals.id_cage= cages.id WHERE cages.id=" + id;

	var conditions = [ "name" , "breed","food_per_day","birthday","entry_date","id_cage" ];
	
	for ( var index in conditions) { // FILTER BY SELECTION (?key1=value1&key2=value2)
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}

			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'" ;
		}
	}
	if ( "fields" in req.query) { // FILTER BY FILTERING (?fields=value)
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) { // FILTER BY PAGINATION
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

app.get('/food-stats/', function(req,res) { //a read-only route that shows how much time is left before there is no more food for each animal.
	var query = "SELECT animals.id, IF(animals.food_per_day=0,0,food.quantity/animals.food_per_day) AS days_left from animals INNER JOIN food ON food.id_animal=animals.id";

	db.query(query, function (err, result, fields) {
		if (err) throw err;

		res.send( JSON .stringify(result));
	});
});

