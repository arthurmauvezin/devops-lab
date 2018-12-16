const express = require ( 'express' );
const mysql = require ( 'mysql' );
const app = express();
const bodyParser = require ( 'body-parser' );

app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({
	host: "localhost" ,
	user: "root" ,
	password: "" ,
	database: "project" ,
	port: "3306"
});

//////////////////////////////////////////////////
//												//
//				Table animals					//
//												//
//////////////////////////////////////////////////

app.post( '/animals' , function (req, res) {  
	var name 			= req.body.name;
	var breed 			= req.body.breed
	var food_per_day	= req.body.food_per_day;
	var birthday 		= req.body.birthday;
	var entry_date		= req.body.entry_date;
	var id_cage			= req.body.id_cage;
	var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('" 
						+ name + "','" + breed + "'," + food_per_day + ",'" + birthday + "','" + entry_date + "'," + id_cage + ")" ;
	
	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.get( '/animals/:id' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id=" + id;

	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});

app.delete( '/animals' , function (req, res) {
	var query = "DELETE FROM animals" ;
	
	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.delete( '/animals/:id' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id=" + id;

	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.put( '/animals/:id' , function (req, res) {
	var id 			= req.params.id;
	var name 		= req.body.name;
	var breed 		= req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday 	= req.body.birthday;
	var entry_date	= req.body.entry_date;
	var id_cage 	= req.body.id_cage;
	var i = 0;

	var query = "UPDATE animals SET ";

	if(name){
		if (i==1) {
			query = query + ", ";
		}
		query = query + "name = " + name;
		i = 1; 
	}

	if(breed){
		if (i==1) {
			query = query + ", ";
		}
		query = query + "breed = " + breed;
		i = 1; 
	}

	if(food_per_day){
		if (i==1) {
			query = query + ", ";
		}
		query = query + "food_per_day = " + food_per_day;
		i = 1; 
	}

	if(birthday){
		if (i==1) {
			query = query + ", ";
		}
		query = query + "birthday = " + birthday;
		i = 1; 
	}

	if(entry_date){
		if (i==1) {
			query = query + ", ";
		}
		query = query + "birthday = " + birthday;
		i = 1; 
	}

	if (id_cage) {
		if (i==1) {
			query = query + ", ";
		}
		query = query + "id_cage = " + id_cage; 
	}

	query = query + " WHERE id="+ id;

	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});


//////////////////////////////////////////////////
//												//
//				Table cages						//
//												//
//////////////////////////////////////////////////

app.post( '/cages' , function (req, res) { 
	var name 		= req.body.name;
	var description	= req.body.description;
	var area	 	= req.body.area;
	var query = "INSERT INTO cages (name, description, area) VALUES ('" + name + "','" + description + "'," + area + ")";
	
	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.get( '/cages/:id' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;

	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});

app.delete( '/cages' , function (req, res) {
	var query = "DELETE FROM cages" ;
	
	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.delete( '/cages/:id' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id=" + id;

	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.put( '/cages/:id' , function (req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	var i = 0;

	var query = "UPDATE cages SET ";

	if(name){
		query = query + "name = '" + name + "'";
		i = 1; 
	}

	if (description) {
		if (i==1) {
			query = query + ", ";
		}
		query = query + "description = '" + description + "' "; 
		i = 1;
	}

	if (area) {
		if (i == 1) {
			query = query + ", ";
		}
		query = query + "area = " + area; 
	}

	query = query + " WHERE id="+ id;

	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});


//////////////////////////////////////////////////
//												//
//				Table food						//
//												//
//////////////////////////////////////////////////

app.post( '/food' , function (req, res) { 
	var name 		= req.body.name;
	var quantity	= req.body.quantity;
	var id_animal	= req.body.id_animal;
	var query = "INSERT INTO food (name, quantity, id_animal) VALUES ('" + name + "'," + quantity + "," + id_animal + ")";
	
	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.get( '/food/:id' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id=" + id;

	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});

app.delete( '/food' , function (req, res) {
	var query = "DELETE FROM food" ;
	
	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.delete( '/food/:id' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id=" + id;

	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.put( '/food/:id' , function (req, res) {
	var id = req.params.id;
	var name = reg.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;
	var i = 0;

	var query = "UPDATE food SET ";

	if (name) {
		if (i==1) {
			query = query + ", ";
		}
		query = query + "name = " + name; 
		i = 1;
	}

	if(quantity){
		if (i==1) {
			query = query + ", ";
		}
		query = query + "quantity = " + quantity;
		i = 1; 
	}

	if (id_animal) {
		if (i==1) {
			query = query + ", ";
		}
		query = query + "id_animal = " + id_animal; 
	}

	query = query + " WHERE id="+ id;

	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});


//////////////////////////////////////////////////
//												//
//				Table staff						//
//												//
//////////////////////////////////////////////////

app.post( '/staff' , function (req, res) {      
	var firstname	= req.body.firstname;
	var lastname	= req.body.lastname;
	var wage	 	= req.body.wage;
	var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('" + firstname + "','" + lastname + "'," + wage + ")";
	
	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});


app.get( '/staff/:id' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id=" + id;

	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});

app.delete( '/staff' , function (req, res) {
	var query = "DELETE FROM staff" ;
	
	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.delete( '/staff/:id' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id=" + id;

	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.put( '/staff/:id' , function (req, res) {
	var id = req.params.id;
	var wage = req.body.wage;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;

	var query = "UPDATE staff SET ";

	if (firstname) {
		if (i==1) {
			query = query + ", ";
		}
		query = query + "firstname = " + firstname; 
	}

	if (lastname) {
		if (i==1) {
			query = query + ", ";
		}
		query = query + "lastname = " + lastname; 
	}

	if (wage) {
		if (i==1) {
			query = query + ", ";
		}
		query = query + "wage = " + wage; 
	}

	 query = query + " WHERE id="+ id;

	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

//////////////////////////////////////////////////
//												//
//				Table users						//
//												//
//////////////////////////////////////////////////

app.post( '/users' , function (req, res) {
	var username	= req.body.username;
	var apikey		= req.body.apikey;
	
	var query = "INSERT INTO users (username, apikey) VALUES ('" + username + "','" + apikey + "')";
	
	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.get( '/users/:id' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM users WHERE id=" + id;

	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});

app.delete( '/users' , function (req, res) {
	var query = "DELETE FROM users" ;
	
	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.delete( '/users/:id' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM users WHERE id=" + id;

	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.put( '/users/:id' , function (req, res) {
	var id = req.params.id;
	var apikey = req.body.apikey;
	var username = req.body.username;

	var query = "UPDATE staff SET ";

	if (username) {
		if (i==1) {
			query = query + ", ";
		}
		query = query + "username = " + username; 
	}

	if (apikey) {
		if (i==1) {
			query = query + ", ";
		}
		query = query + "apikey = " + apikey; 
	}

	query = query + " WHERE id="+ id;

	db.query(query, function (err, result, fields) {
	
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});


//////////////////////////////////////////////////
//												//
//				Relationships					//
//												//
//////////////////////////////////////////////////

app.get('/animals/:id/cages', function(req, res) {
	var id = req.params.id;
	var query = "SELECT animals.name, animals.breed, animals.id_cage, cages.name as cage, cages.area " +
	"FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;
	
	db.query(query, function(err, result, fields) {
	
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});

app.get('/animals/:id/food', function(req, res) {
	var id = req.params.id;
	var query = "SELECT animals.name, animals.breed, animals.food_per_day, animals.id_cage, food.name as food, food.quantity " +
	"FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;
	
	db.query(query, function(err, result, fields) {
	
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});

app.get('/animals/:ida/cages/:idc', function(req, res) {
	var id_user = req.params.ida;
	var id_data = req.params.idc;
	var query = "SELECT * FROM animals INNER JOIN cages ON animals.id_cage = cage.id WHERE animals.id=" + ida + " AND cages.id=" +idc;

	db.query(query, function(err, result, fields) {

	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});

app.get('/animals/:ida/food/:idf', function(req, res) {
	var id_user = req.params.ida;
	var id_data = req.params.idf;
	var query = "SELECT * FROM animals INNER JOIN food ON animals.id = food.animal_id WHERE animals.id=" + ida + " AND food.id=" +idc;

	db.query(query, function(err, result, fields) {

	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});

//////////////////////////////////////////////////
//												//
//				get	animals						//
//												//
//////////////////////////////////////////////////

app.get( '/animals' , function (req, res) {
	var query = "SELECT * FROM animals" ;
	var conditions = [ "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];

	for ( var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} else {
				query += " AND" ;
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'" ;	
		}
	}

	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}	
	}

	if ( "sort" in req.query) {
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
		for ( var index in sort) {
			var direction = sort[index].substr( -1 );
			var field = sort[index].slice(0,-1);
			
			query += " " + field;
			if (direction == "-" ) query += " DESC" ;
			else query += " ASC" ;
		}
	}

	db.query(query, function (err, result, fields) {

	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});


//////////////////////////////////////////////////
//												//
//				get	cages						//
//												//
//////////////////////////////////////////////////

app.get( '/cages' , function (req, res) {
	var query = "SELECT * FROM cages" ;
	var conditions = [ "id", "name", "description", "area" ];
	
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

	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}	
	}

	if ( "sort" in req.query) {
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
		for ( var index in sort) {
			var direction = sort[index].substr( -1 );
			var field = sort[index].slice(0,-1);
			
			query += " " + field;
			if (direction == "-" ) query += " DESC" ;
			else query += " ASC" ;
		}
	}

	db.query(query, function (err, result, fields) {

	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});

//////////////////////////////////////////////////
//												//
//				get	food						//
//												//
//////////////////////////////////////////////////

app.get( '/food' , function (req, res) {
	var query = "SELECT * FROM food" ;
	var conditions = [ "id", "name", "quantity", "id_animal" ];
	
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

	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}	
	}

	if ( "sort" in req.query) {
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
		for ( var index in sort) {
			var direction = sort[index].substr( -1 );
			var field = sort[index].slice(0,-1);
			
			query += " " + field;
			if (direction == "-" ) query += " DESC" ;
			else query += " ASC" ;
		}
	}

	db.query(query, function (err, result, fields) {

	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});

//////////////////////////////////////////////////
//												//
//				get	staff						//
//												//
//////////////////////////////////////////////////


app.get('/staff', function(req, res) {
	var query = "SELECT * FROM staff";
	var conditions = ["firstname", "lastname", "wage"];
	
	for (var index in conditions) {
	if (conditions[index] in req.query) {
		if (query.indexOf("WHERE") < 0) {
			query += " WHERE";
		} else {
			query += " AND";
		}
			query += " " + conditions[index] + "='" +
			req.query[conditions[index]] + "'";
		}
	}

	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}	
	}

	if ( "sort" in req.query) {
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
		for ( var index in sort) {
			var direction = sort[index].substr( -1 );
			var field = sort[index].slice(0,-1);
			
			query += " " + field;
			if (direction == "-" ) query += " DESC" ;
			else query += " ASC" ;
		}
	}

	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});


//////////////////////////////////////////////////
//												//
//				get	users						//
//												//
//////////////////////////////////////////////////

app.get( '/users' , function (req, res) {
	var query = "SELECT * FROM users" ;
	var conditions = [ "username", "apikey" ];
	
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

	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}	
	}

	if ( "sort" in req.query) {
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
		for ( var index in sort) {
			var direction = sort[index].substr( -1 );
			var field = sort[index].slice(0,-1);
			
			query += " " + field;
			if (direction == "-" ) query += " DESC" ;
			else query += " ASC" ;
		}
	}

	db.query(query, function (err, result, fields) {

	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});


//////////////////////////////////////////////////
//												//
//				food-stats						//
//												//
//////////////////////////////////////////////////

app.get('/food-stats', function(req, res) {
	var query = "SELECT animals.id as id, if(animals.food_per_day = 0,0,food.quantity/animals.food_per_day) as days_left " +
	"from animals join food where animals.id = food.id_animal";

	var conditions = [ "id", "days_left" ];
	
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

	if ( "limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}	
	}

	if ( "sort" in req.query) {
		var sort = req.query[ "sort" ].split( "," );
		query += " ORDER BY" ;
		for ( var index in sort) {
			var direction = sort[index].substr( -1 );
			var field = sort[index].slice(0,-1);
			
			query += " " + field;
			if (direction == "-" ) query += " DESC" ;
			else query += " ASC" ;
		}
	}
	
	db.query(query, function(err, result, fields) {
		
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


app.listen( 3000 , function () {
	db.connect( function (err) {
	if (err) throw err;
	console .log( 'Connection to database successful!' );
	});
	console .log( 'Example app listening on port 3000!' );
});
