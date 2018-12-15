const express = require ( 'express' );
const mysql = require ( 'mysql' );
const bodyParser = require ( 'body-parser' );
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//Init connection to database with params needed
var db = mysql.createConnection({
	host: "localhost" ,
	user: "root" ,
	password: "" ,
	database: "zoo"
});


//Firewall definition
app.use( function (req, res, next) {
	if ( "key" in req.query) {
	var key = req.query[ "key" ];
	var query = "SELECT * FROM users WHERE apikey='" + key + "'" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	if (result.length > 0 ) {
	next();
	}
	else {
	res.send( "Access denied" );
	}
	});
	} else {
	res.send( "Access denied" );
	}
});


//Create a new animal and add it into the db
app.post( '/animals' , function (req, res) {
	///All the variables are declared in the body section
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;
	///Query insert new animal to db in sql
	var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES('" + name + "','" + breed + "','" + food_per_day + "','" + birthday + "','" + entry_date + "','" + id_cage + "')" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});



///Read all animals in db
app.get( '/animals' , function (req, res) {


	///Query read all animals
	var query = "SELECT * FROM animals";

	///Filter fiels
	if ( "fields" in req.query) {
	query = query.replace( "*" , req.query[ "fields" ]);
	}

	///Filter condition
	var conditions = [ "id" , "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];
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

	///Filter sort
	if ( "sort" in req.query) {
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

	///Filter limit
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




///Read a specific animal in db
app.get( '/animals/:id' , function (req, res) {

	///Id in the body section
	var id = req.params.id;
	///Query sql to read a specific animal
	var query = "SELECT * FROM animals WHERE id=" + id;

	///Filters declaration

	if ( "fields" in req.query) {
	query = query.replace( "*" , req.query[ "fields" ]);
	}

	var conditions = [ "id" , "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];
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

	if ( "sort" in req.query) {
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


//Read  all cages relationships of a specific animal
app.get( '/animals/:id/cages' , function (req, res) {

	///Id in body section
	var id = req.params.id;
	///Query sql to read all cages of an animal
	var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;

	///Filters declaration


	if ( "fields" in req.query) {
	query = query.replace( "cages.id, cages.name, cages.description, cages.area" , req.query[ "fields" ]);
	}

	var conditions = [ "id" , "name", "description", "area" ];
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

	if ( "sort" in req.query) {
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


///Read a specific cages relationship of a specific animal
app.get( '/animals/:id/cages/:id_cage' , function (req, res) {

	///All variables declared in body section
	var id = req.params.id;
	var id_cage = req.params.id_cage;
	///Query sql to read a specific cages of a specific animal
	var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id + " AND cages.id=" +id_cage;

	///Filters declaration

	if ( "fields" in req.query) {
	query = query.replace( "cages.id, cages.name, cages.description, cages.area" , req.query[ "fields" ]);
	}

	var conditions = [ "id" , "name", "description", "area" ];
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

	if ( "sort" in req.query) {
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


///Read food relationship of a specific animal
app.get( '/animals/:id/food' , function (req, res) {

	///Id in body section
	var id = req.params.id;
	///Query sql to read food  of a specific animal
	var query = "SELECT food.id, food.name, food.quantity, food.id_animal FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE animals.id=" + id;

	///Filters declaration
	if ( "fields" in req.query) {
	query = query.replace( "food.id, food.name, food.quantity, food.id_animal" , req.query[ "fields" ]);
	}

	var conditions = [ "id" , "name", "quantity", "id_animal" ];
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

	if ( "sort" in req.query) {
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


///Update an existing animal in db
app.put( '/animals/:id' , function (req, res) {

	var set="";
	///All variables are in the body section
	var id = req.params.id;

	///If an other element is in the body section
	///Update var set to make the right partial/full update
	if(req.body.name!=null)
	{var name = req.body.name;
	set+="name = '" + name + "', ";
	}

	if(req.body.breed!=null)
	{var breed = req.body.breed;
	set+="breed = '" + breed + "', ";
	}


	if(req.body.food_per_day!=null)
	{var food_per_day = req.body.food_per_day;
	set+="food_per_day = '" + food_per_day + "', ";
	}

	if(req.body.birthday!=null)
	{var birthday = req.body.birthday;
	set+="birthday = '" + birthday + "', ";
	}

	if(req.body.id_cage!=null)
	{var id_cage = req.body.id_cage;
	set+="id_cage = '" + id_cage + "', ";
	}

	if(req.body.entry_date!=null)
	{var entry_date = req.body.entry_date;
	set+="entry_date = '" + entry_date + "' ";
	}
	else
	set=set.substr(0, set.length-2); ///At the end we eraser the possible ',' existing

	///Query sql to update a specific animal depending of the elements in the body section
	var query = "UPDATE animals SET " + set + "  WHERE id=" + id;

	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});


///Delete all animals
app.delete( '/animals' , function (req, res) {
	///Query sql to delete all animals
	var query = "DELETE FROM animals" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

///Delete a specific animal
app.delete( '/animals/:id' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});




///Create a new cages in db
app.post( '/cages' , function (req, res) {
	///All variables are in the body section
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	///Query sql to insert a new cages in db
	var query = "INSERT INTO cages (name,description,area) VALUES('" + name + "','" + description + "','" + area + "')" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});



///Read all cages in db
app.get( '/cages' , function (req, res) {

	///Query sql to read all cages
	var query = "SELECT * FROM cages"

	///Filters declaration

	if ( "fields" in req.query) {
	query = query.replace( "*" , req.query[ "fields" ]);
	}

	var conditions = [ "id" , "name", "description", "area"];
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

	if ( "sort" in req.query) {
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




///Read a specific cage
app.get( '/cages/:id' , function (req, res) {
 	
 	///Id in the body section
	var id = req.params.id;
	///Query sql to read a specific cage
	var query = "SELECT * FROM cages WHERE id=" + id;

	///Filters declaration

	if ( "fields" in req.query) {
	query = query.replace( "*" , req.query[ "fields" ]);
	}

	var conditions = [ "id" , "name", "description", "area"];
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

	if ( "sort" in req.query) {
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

///Read animals relationships of a specific cage
app.get( '/cages/:id/animals' , function (req, res) {

	///Id in the body section
	var id = req.params.id;
	///Query sql to read animals relationships of a specific cage
	var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id=" + id;

	///Filters declaration

	if ( "fields" in req.query) {
	query = query.replace( "animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage" , req.query[ "fields" ]);
	}

	var conditions = [ "id" , "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];
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

	if ( "sort" in req.query) {
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


///Update an existing cage in db
app.put( '/cages/:id' , function (req, res) {

	///Id in body section
	var id = req.params.id;
	var set="";

	///If an other element is in the body section
	///Update var set to make the right partial/full update

	if(req.body.name!=null)
	{var name = req.body.name;
	set+="name = '" + name + "', ";
	}

	if(req.body.description!=null)
	{var description = req.body.description;
	set+="description = '" + description + "', ";
	}

	if(req.body.area!=null)
	{var area = req.body.area;
	set+="area = '" + area + "' ";
	}
	else
	set=set.substr(0, set.length-2);

	///Query sql to update a specific cage according element in the body
	var query = "UPDATE cages SET " + set + "  WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

///Delete all cages in the db
app.delete( '/cages' , function (req, res) {
	///Query sql to delete all cages in db
	var query = "DELETE FROM cages" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});


///Delete a specific cage in db
app.delete( '/cages/:id' , function (req, res) {
	///Id in the body section
	var id = req.params.id;
	///Query sql to delete a specific cage in db
	var query = "DELETE FROM cages WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});




///Create a new food in db
app.post( '/food' , function (req, res) {
	///All variables are in the body section
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;
	///Query sql to create a new food in db
	var query = "INSERT INTO food (name,quantity,id_animal) VALUES('" + name + "','" + quantity + "','" + id_animal + "')" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});


///Real all food in db
app.get( '/food' , function (req, res) {
	///Query sql to read all food in db
	var query = "SELECT * FROM food"

	///Filters declaration

	if ( "fields" in req.query) {
	query = query.replace( "*" , req.query[ "fields" ]);
	}

	var conditions = [ "id" , "name", "quantity", "id_animal" ];
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

	if ( "sort" in req.query) {
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



///Read a specific food in db
app.get( '/food/:id' , function (req, res) {

	///Id in the body section
	var id = req.params.id;
	///Query sql to read a specific food in db
	var query = "SELECT * FROM food WHERE id=" + id;

	///Filters declaration

	if ( "fields" in req.query) {
	query = query.replace( "*" , req.query[ "fields" ]);
	}

	var conditions = [ "id" , "name", "quantity", "id_animal"];
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

	if ( "sort" in req.query) {
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

///Read animal relationships with a specific food
app.get( '/food/:id/animals' , function (req, res) {

	///Id is in the body section
	var id = req.params.id;
	///Query sql to read animal relationships with a specific food
	var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id=" + id;

	///Filters declaration
	if ( "fields" in req.query) {
	query = query.replace( "animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage" , req.query[ "fields" ]);
	}

	var conditions = [ "id" , "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];
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

	if ( "sort" in req.query) {
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


///Read a specific animal relationship from a specific food
app.get( '/food/:id/animals/:id_animal' , function (req, res) {

	///All variables in the body section
	var id = req.params.id;
	var id_animal = req.params.id_animal;
	///Querry sql to read a specific animal relationship from a specific food
	var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE animals.id=" + id_animal + " AND food.id=" +id;

	///Filters declaration

	if ( "fields" in req.query) {
	query = query.replace( "animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage" , req.query[ "fields" ]);
	}

	var conditions = [ "id" , "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];
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

	if ( "sort" in req.query) {
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


///update an existing food
app.put( '/food/:id' , function (req, res) {

	///All variables are in the body section
	var id = req.params.id;
	var set="";

	if(req.body.name!=null)
	{var name = req.body.name;
	set+="name = '" + name + "', ";
	}

	if(req.body.quantity!=null)
	{var quantity = req.body.quantity;
	set+="quantity = '" + quantity + "', ";
	}

	if(req.body.id_animal!=null)
	{var id_animal = req.body.id_animal;
	set+="id_animal = '" + id_animal + "' ";
	}
	else
	set=set.substr(0, set.length-2);

	///Query sql to update a specific food according to others elements in the body section
	var query = "UPDATE food SET " + set + "  WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

///Delete all food in db
app.delete( '/food' , function (req, res) {
	///Query sql to delete all food in db
	var query = "DELETE FROM food" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});


///Delete a specific food in db 
app.delete( '/food/:id' , function (req, res) {
	///Id in body section
	var id = req.params.id;
	///Query sql to delete a specific food in db 
	var query = "DELETE FROM food WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});


///Create a new staff in db
app.post( '/staff' , function (req, res) {
	///All variables are in the body section
	var lastname = req.body.lastname;
	var firstname = req.body.firstname;
	var wage = req.body.wage;
	///Query sql to create a new staff in db
	var query = "INSERT INTO staff (lastname,firstname,wage) VALUES('" + lastname + "','" + firstname + "','" + wage + "')" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});


///Read all staff in db
app.get( '/staff' , function (req, res) {
	///Query sql to read all staff
	var query = "SELECT * FROM staff"

	///Filters declaration

	if ( "fields" in req.query) {
	query = query.replace( "*" , req.query[ "fields" ]);
	}

	var conditions = [ "id" , "lastname", "firstbreed", "wage" ];
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

	if ( "sort" in req.query) {
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


///Read aspecific animal
app.get( '/staff/:id' , function (req, res) {

	///Id in the body section
	var id = req.params.id;
	///Query sql to read aspecific animal
	var query = "SELECT * FROM staff WHERE id=" + id;

	///Filters declaration

	if ( "fields" in req.query) {
	query = query.replace( "*" , req.query[ "fields" ]);
	}

	var conditions = [ "id" , "lastname", "firstbreed", "wage" ];
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

	if ( "sort" in req.query) {
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


///Update an existing staff
app.put( '/staff/:id' , function (req, res) {

	///All variables are in the body section
	var id = req.params.id;
	var set="";

	if(req.body.lastname!=null)
	{var lastname = req.body.lastname;
	set+="lastname = '" + lastname + "', ";
	}

	if(req.body.firstname!=null)
	{var firstname = req.body.firstname;
	set+="firstname = '" + firstname + "', ";
	}

	if(req.body.wage!=null)
	{var wage = req.body.wage;
	set+="wage = '" + wage + "' ";
	}
	else
	set=set.substr(0, set.length-2);

	///Query sql to update staff according others elements in the body section
	var query = "UPDATE staff SET " + set + "  WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});


///Delete all staff in db
app.delete( '/staff' , function (req, res) {
	///Query sql to delete all staff
	var query = "DELETE FROM staff" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

///Delete a specific staff in db
app.delete( '/staff/:id' , function (req, res) {
	///Query sql to delete a specific staff in db
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id=" + id;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});


///Display food stats
app.get( '/food-stats' , function (req, res) {
	///If an animal has a food in the db, calculate and display the number of days left as an integer
	///If an animal has no food in the db, return 0 as number of days left
	var query = "(SELECT animals.id, FLOOR(quantity/food_per_day)as days_left FROM animals inner join food where animals.id=food.id_animal)UNION (SELECT id, 0 as stats FROM animals where id not in (select animals.id from animals inner join food where animals.id=food.id_animal)) ";
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify(result));
	});
});




///Listening on the port 3000
app.listen( 3000 , function () {
	db.connect( function (err) {
	if (err) throw err;
	console .log( 'Connection to database successful!' );
	});
	console .log( 'Example app listening on port 3000!' );
});

