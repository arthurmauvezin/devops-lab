	const express = require ( 'express' );
	const mysql = require ( 'mysql' );
	const app = express();
	const bodyParser = require ( 'body-parser' );
	app.use(bodyParser.urlencoded({ extended: true }));

	//Initialisation of the connection
	var db = mysql.createConnection({
		host: "localhost" ,
		user: "root" ,
		password: "" ,
		database: "zoo",
		port: "3306"
	});

	//Firewall
	app.use(function(req, res, next) {
		if (req.query.key === 'ceciestmonjeton') {
			next();
		}
		else {
			res.status(403).send('Access denied');
		}
	});

	//Connection to the database
	app.listen( 3000 , function () {
		/*db.connect( function (err) {
			if (err) throw err;
			console .log( 'Connection to database successful!' );
		});*/
		console .log( 'Example app listening on port 3000!' );
	});


	// All ROUTES CONCERNING ANIMALS

	//Insertion of one animal
	app.post( '/animals/' , function (req, res) {
		var name = req.body.name;
		var breed = req.body.breed;
		var food_per_day = req.body.food_per_day;
		var birthday = req.body.birthday;
		var entry_date = req.body.entry_date;
		var id_cage = req.body.id_cage;
		var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('" + name + "' , '" + breed + "' , '" + food_per_day + "' , '" + birthday + "' , '" + entry_date + "' , '" + id_cage + "')" ;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});

	// Reading of the values of all animals
	app.get( '/animals/' , function (req, res) {
		var query = "SELECT * FROM animals";
		// Fields filter
		if ( "fields" in req.query) {
			query = query.replace( "*" , req.query[ "fields" ]);
		}
		//Condition filter
		if (req.params!=null)
		{
			var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
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
		}
		//Sorting filter
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
		//Limite and offset filter
		if ( "limit" in req.query) {
			query += " LIMIT " + req.query[ "limit" ];
			if ( "offset" in req.query) {
				query += " OFFSET " + req.query[ "offset" ];
			}
		}
		db.query( query , function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify(result));
		});
	});

	//Reading of the values of one animal
	app.get( '/animals/:id' , function (req, res) {
		var id = req.params.id;
		var query = "SELECT * FROM animals WHERE id=" + id;
		//Fields filter
		if ( "fields" in req.query) {
			query = query.replace( "*" , req.query[ "fields" ]);
		}
		// Condition filter
		if (req.params!=null)
		{
			var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
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
		}
		//Sorting filter
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
		//Limit and offset filter
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

	// Modification of one animal
	app.put( '/animals/:id' , function (req, res) {
		var id = req.params.id;
		var name = req.body.name;
		var breed = req.body.breed;
		var food_per_day = req.body.food_per_day;
		var birthday = req.body.birthday;
		var entry_date = req.body.entry_date;
		var id_cage = req.body.id_cage;
		var query = "UPDATE animals SET "
		if(name != null){
			query += "name = '" + name +"' ,"
		}
		if(breed != null){
			query += "breed = '" + breed +"' ,"
		}
		if(food_per_day != null){
			query += "food_per_day = " + food_per_day +" ,"
		}
		if(birthday != null){
			query += "birthday = '" + birthday +"' ,"
		}
		if(entry_date != null){
			query += "entry_date = '" + entry_date +"' ,"
		}
		if(id_cage != null){
			query += "id_cage = " + id_cage +" ,"
		}
		query = query.slice(0, -1);
		query += "WHERE id=" +id;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});

	//Deletion of an animal all animals
	app.delete( '/animals/' , function (req, res) {
		var query = "DELETE FROM animals" ;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});

	//Deletion of one animal
	app.delete( '/animals/:id' , function (req, res) {
		var id = req.params.id;
		var query = "DELETE FROM animals WHERE id=" + id;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});


	//ALL ROUTES CONCERNING CAGES

	//Insertion of a cage
	app.post( '/cages/' , function (req, res) {
		var name = req.body.name;
		var description = req.body.description;
		var area = req.body.area;
		var query = "INSERT INTO cages (name, description, area) VALUES ('" + name + "' , '" + description + "' , '" + area + "')" ;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});

	//Reading of the values of all cages
	app.get( '/cages/' , function (req, res) {
		var query = "SELECT * FROM cages";
		//Field filter
		if ( "fields" in req.query) {
			query = query.replace( "*" , req.query[ "fields" ]);
		}
		//Condition filter
		if (req.params!=null)
		{
			var conditions = ["name", "description","area"];
			for ( var index in conditions) {
				if (conditions[index] in req.query) {
					//console.log(conditions);
					if (query.indexOf( "WHERE" ) < 0 ) {
						query += " WHERE" ;
					} else {
						query += " AND" ;
					}
					query += " " + conditions[index] + "='" +
					req.query[conditions[index]] + "'" ;
				}
			}
		}
		//Sorting filter
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
		//Limit and offset filter
		if ( "limit" in req.query) {
			query += " LIMIT " + req.query[ "limit" ];
			if ( "offset" in req.query) {
				query += " OFFSET " + req.query[ "offset" ];
			}
		}
		db.query( query , function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify(result));
		});
	});

	//Reading of the values of one animal
	app.get( '/cages/:id' , function (req, res) {
		var id = req.params.id;
		var query = "SELECT * FROM cages WHERE id=" + id;
		//Field filter
		if ( "fields" in req.query) {
			query = query.replace( "*" , req.query[ "fields" ]);
		}
		//Condition filter
		if (req.params!=null)
		{
			var conditions = ["name", "description","area"];
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
		}
		//Sorting filter
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
		//Limit and offset filter
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

	//Modification of one cage
	app.put( '/cages/:id' , function (req, res) {
		var id = req.params.id;
		var name = req.body.name;
		var description = req.body.description;
		var area = req.body.area;
		var query = "UPDATE cages SET ";
		if(name != null){
			query += "name = '" + name +"' ,";
		}
		if(description != null){
			query += "description = '" + description +"' ,";
		}
		if(area != null){
			query += "area = " + area +" ,";
		}
		query = query.slice(0, -1);
		query += "WHERE id=" +id;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});

	//Deletion of all cages
	app.delete( '/cages/' , function (req, res) {
		var query = "DELETE FROM cages" ;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});

	//Deletion of one cage
	app.delete( '/cages/:id' , function (req, res) {
		var id = req.params.id;
		var query = "DELETE FROM cages WHERE id="+id ;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});


	//ALL ROUTES CONCERNING FOOD

	//Insertion of a food
	app.post( '/food/' , function (req, res) {
		var name = req.body.name;
		var quantity = req.body.quantity;
		var id_animal = req.body.id_animal;
		var query = "INSERT INTO food (name, quantity, id_animal) VALUES ('" + name + "' , '" + quantity + "' , '" + id_animal + "')" ;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});

	//Reading the values of all foods
	app.get( '/food/' , function (req, res) {
		var query = "SELECT * FROM food";
		if ( "fields" in req.query) {
			query = query.replace( "*" , req.query[ "fields" ]);
		}
		if (req.params!=null)
		{
			var conditions = ["name", "quantity", "id_animal"];
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
		db.query( query , function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify(result));
		});
	});

	//Reading the values of one food
	app.get( '/food/:id' , function (req, res) {
		var id = req.params.id;
		var query = "SELECT * FROM food WHERE id=" + id;
		if ( "fields" in req.query) {
			query = query.replace( "*" , req.query[ "fields" ]);
		}
		if (req.params!=null)
		{
			var conditions = ["name", "quantity", "id_animal"];
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

	//Modification of one food
	app.put( '/food/:id' , function (req, res) {
		var id = req.params.id;
		var name = req.body.name;
		var quantity = req.body.quantity;
		var id_animal = req.body.id_animal;
		var query = "UPDATE food SET ";
		if(name != null){
			query += "name = '" + name +"' ,";
		}
		if(quantity != null){
			query += "quantity = " + quantity +" ,";
		}
		if(id_animal != null){
			query += "id_animal = " + id_animal +" ,";
		}
		query = query.slice(0, -1);
		query += "WHERE id=" +id;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});

	//Deletion of all foods
	app.delete( '/food/' , function (req, res) {
		var query = "DELETE FROM food" ;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});

	//Deletion of one food
	app.delete( '/food/:id' , function (req, res) {
		var id = req.params.id;
		var query = "DELETE FROM food WHERE id=" + id;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});


	//ALL THE ROUTES CONCERNING STAFF

	//Insertion of a staff
	app.post( '/staff/' , function (req, res) {
		var firstname = req.body.firstname;
		var lastname = req.body.lastname;
		var wage = req.body.wage;
		var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('" + firstname + "' , '" + lastname + "' , '" + wage + "')" ;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});

	//Reading the values of all staff
	app.get( '/staff/' , function (req, res) {
		var query = "SELECT * FROM staff";
		if ( "fields" in req.query) {
			query = query.replace( "*" , req.query[ "fields" ]);
		}
		if (req.params!=null)
		{
			var conditions = ["firstname", "lastname", "wage"];
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

	//Reading the values of one staff
	app.get('/staff/:id' , function (req, res) {
		var id = req.params.id;
		var query = "SELECT * FROM staff WHERE id=" + id;
		if ( "fields" in req.query) {
			query = query.replace( "*" , req.query[ "fields" ]);
		}
		if (req.params!=null)
		{
			var conditions = ["firstname", "lastname", "wage"];
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

	// Modification of one staff
	app.put('/staff/:id' , function (req, res) {
		var id = req.params.id;
		var firstname = req.body.firstname;
		var lastname = req.body.lastname;
		var wage = req.body.wage;
		var query = "UPDATE staff SET ";
		if(firstname != null){
			query += "firstname = '" + firstname +"' ,";
		}
		if(lastname != null){
			query += "lastname = '" + lastname +"' ,";
		}
		if(wage != null){
			query += "wage = " + wage +" ,";
		}
		query = query.slice(0, -1);
		query += "WHERE id=" +id;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});

	//Deletion of all the staff
	app.delete( '/staff/' , function (req, res) {
		var query = "DELETE FROM staff" ;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});

	//Deletion of one staff
	app.delete( '/staff/:id' , function (req, res) {
		var id = req.params.id;
		var query = "DELETE FROM staff WHERE id=" + id;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( "Success" ));
		});
	});


	// ALL THE ROUTES CONERNING THE RELATION BETWEEN ANIMALS AND CAGES

	// Reading of the values of a cage giving the id of the animal in it
	app.get( '/animals/:id/cages' , function (req, res) {
		var id = req.params.id;
		var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM cages INNER JOIN animals ON animals.id_cage = cages.id WHERE animals.id=" + id;
		if ( "fields" in req.query) {
			query = query.replace( "cages.id, cages.name, cages.description, cages.area" , req.query[ "fields" ]);
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
		if (req.params!=null)
		{
			var conditions = ["name", " description", "area"];
			for ( var index in conditions) {
				if (conditions[index] in req.query) {
					//console.log(conditions);
					if (query.indexOf( "WHERE" ) < 0 ) {
						query += " WHERE" ;
					} else {
						query += " AND" ;
					}
					query += " " + conditions[index] + "='" +
					req.query[conditions[index]] + "'" ;
				}
			}
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

	// Reading of the values of a cage giving the id of the animal in it and the id of the cage
	app.get( '/animals/:idanimals/cages/:idcages' , function (req, res) {
		var idanimals = req.params.idanimals;
		var idcages = req.params.idcages;
		var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM cages INNER JOIN animals ON animals.id_cage = cages.id WHERE animals.id=" + idanimals+" and cages.id="+idcages;
		if ( "fields" in req.query) {
			query = query.replace( "cages.id, cages.name, cages.description, cages.area" , req.query[ "fields" ]);
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
		if (req.params!=null)
		{
			var conditions = ["name", " description", "area"];
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

	// Reading of the values of an animal giving the id of the cage
	app.get( '/cages/:id/animals' , function (req, res) {
		var id = req.params.id;
		var query = "SELECT animals.id, animals.name, animals.breed, animals.birthday, animals.entry_date, animals.food_per_day, animals.id_cage FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id=" + id;
		if ( "fields" in req.query) {
			query = query.replace( "animals.id, animals.name, animals.breed, animals.birthday, animals.entry_date, animals.food_per_day, animals.id_cage" , req.query[ "fields" ]);
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
		if (req.params!=null)
		{
			var conditions = ["name", " breed","food_per_day", "birthday", "entry_date", "id_cage"];
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


	// ALL THE ROUTES CONERNING THE RELATION BETWEEN ANIMALS AND FOOD

	// Reading of the values of an animal giving the id of the food
	app.get( '/food/:id/animals' , function (req, res) {
		var id = req.params.id;
		var query = "SELECT animals.id, animals.name, animals.breed, animals.birthday, animals.entry_date, animals.food_per_day, animals.id_cage FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE food.id=" + id;
		if ( "fields" in req.query) {
			query = query.replace( "animals.id, animals.name, animals.breed, animals.birthday, animals.entry_date, animals.food_per_day, animals.id_cage" , req.query[ "fields" ]);
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
		if (req.params!=null)
		{
			var conditions = ["name", " breed","food_per_day", "birthday", "entry_date", "id_cage"];
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

	// Reading of the values of an animal giving the id of the food and the id of the animal
	app.get( '/food/:idfood/animals/:idanimals' , function (req, res) {
		var idfood = req.params.idfood;
		var idanimals = req.params.idanimals;
		var query = "SELECT animals.id, animals.name, animals.breed, animals.birthday, animals.entry_date, animals.food_per_day, animals.id_cage FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE food.id=" + idfood+" and animals.id="+idanimals;
		if ( "fields" in req.query) {
			query = query.replace( "animals.id, animals.name, animals.breed, animals.birthday, animals.entry_date, animals.food_per_day, animals.id_cage" , req.query[ "fields" ]);
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
		if (req.params!=null)
		{
			var conditions = ["name", " breed","food_per_day", "birthday", "entry_date", "id_cage"];
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

	// Reading of the values of a food giving the id of the animal
	app.get( '/animals/:id/food' , function (req, res) {
		var id = req.params.id;
		var query = "SELECT food.id, food.name, food.quantity, food.id_animal FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE animals.id=" + id;
		if ( "fields" in req.query) {
			query = query.replace( "food.id, food.name, food.quantity, food.id_animal" , req.query[ "fields" ]);
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
		if (req.params!=null)
		{
			var conditions = ["name", " quantity" , "id_animal"];
			for ( var index in conditions) {
				if (conditions[index] in req.query) {
					console.log("conditions" + conditions);
					if (query.indexOf( "WHERE" ) < 0 ) {
						query += " WHERE" ;
					} else {
						query += " AND" ;
					}
					query += " " + conditions[index] + "='" +
					req.query[conditions[index]] + "'" ;
				}
			}
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


	// FOOD_STATS

	// Reading the values of the days lefts in term of food for each animal
	app.get('/food-stats/', function(req, res){
		var query = "SELECT a.id , COALESCE(f.quantity / NULLIF(a.food_per_day,0), 0) as days_left from food f inner join animals a on f.id_animal = a.id";
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			res.send( JSON .stringify( result));
		});
	});
