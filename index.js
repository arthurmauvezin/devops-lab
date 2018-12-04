const express = require('express');
const mysql = require('mysql');
const app = express();

const bodyParser = require ( 'body-parser' );
app.use(bodyParser.urlencoded({ extended : true}));

// Creation of the connection
var db = mysql.createConnection({
	host : "localhost",
	user : "root",
	password : "",
	database : "project",
	port : "3306"
});
// firewall
app.use(function(req, res, next) {
	if ("key" in req.query) {
		var key = req.query["key"];
		var query = "SELECT * FROM users WHERE apikey='" + key + "'";
		db.query(query, function(err, result, fields) {
			if (err) throw err;
			if (result.length > 0) {
				next();
			}
			else {
				res.send("Access denied");
			}
		});
	} else {
	res.send("Access denied");
	}
});


// read all functions
app.get('/animals', function(req, res){
	var query = "SELECT  * FROM animals";
	var conditions = ["birthday", "breed", "entry_date", "food_per_day", "id","id_cage", "name"];
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
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }

	db.query(query, function(err, result, fields){
		if(err) throw err;
	res.send(JSON.stringify(result));
	});
});

app.get('/cages', function(req, res){
	var query = "SELECT  * FROM cages";
	var conditions = ["area","description", "id", "name"];
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

	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}

    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }

	db.query(query, function(err, result, fields){
		if(err) throw err;

	res.send(JSON.stringify(result));
	});
});

app.get('/food', function(req, res) {
	var query = "SELECT * FROM food";

	var conditions = ["id", "name","quantity","id_animal"];

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
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-")
				query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}
	if ("fields" in req.query) {
		query = query.replace("*",req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});

app.get('/staff', function(req, res){
	var query = "SELECT  * FROM staff";
	var conditions = ["firstname", "lastname", "id", "wage"];
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

	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }


	db.query(query, function(err, result, fields){
		if(err) throw err;

	res.send(JSON.stringify(result));
	});
});


// Read one functions
app.get('/animals/:id', function(req, res){
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id =" + id;

	var conditions = ["birthday", "breed", "entry_date", "food_per_day", "id","id_cage", "name"];
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

	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }

	db.query(query, function(err, result, fields){
		if(err) throw err;
	res.send(JSON.stringify(result));
	});
});

app.get('/cages/:id', function(req, res){
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id =" + id;

	var conditions = ["area","description", "id", "name"];
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

	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }

	db.query(query, function(err, result, fields){
		if(err) throw err;
	res.send(JSON.stringify(result));
	});
});

app.get('/food/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id=" + id;
	var conditions = ["id", "name","quantity","id_animal"];
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
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-")
				query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}
	if ("fields" in req.query) {
		query = query.replace("*",req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});

app.get('/staff/:id', function(req, res){
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id =" + id;
	var conditions = ["firstname", "lastname", "id", "wage"];
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

	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}

	if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }


	db.query(query, function(err, result, fields){
		if(err) throw err;
	res.send(JSON.stringify(result));
	});
});


// Create functions
app.post( '/animals' , function (req, res) {
	var birthday = req.body.birthday;
	var breed = req.body.breed;
	var entry_date = req.body.entry_date;
	var food_per_day = req.body.food_per_day;
	var id_cage = req.body.id_cage;
	var name = req.body.name;
	var query = "INSERT INTO animals(birthday, breed, entry_date, food_per_day, id_cage, name) VALUES('" + birthday+ "','" + breed
	+ "','" + entry_date+ "','"  + food_per_day+ "','"  + id_cage+ "','"  + name+ "')";
	db.query(query, function (err, result, fields){
		if(err) throw err;
	res.send(JSON.stringify("Success"));
	});
});

app.post( '/cages' , function (req, res) {
	var area = req.body.area;
	var description = req.body.description;
	var name = req.body.name;
	var query = "INSERT INTO cages(area, description, name) VALUES('" + area + "','" + description + "','" + name + "')";
	db.query(query, function (err, result, fields){
		if(err) throw err;
	res.send(JSON.stringify("Success"));
	});
});

app.post('/food', function(req, res) {
	var Name = req.body.name;
	var Quantity = req.body.quantity;
	var Animals = req.body.id_animal;
	var query = "INSERT INTO food (name,quantity,id_animal) VALUES ('" + Name + "','"+Quantity+"','"+Animals+"')";
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify("Success"));
	});
});

app.post( '/staff' , function (req, res) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var query = "INSERT INTO staff(firstname, lastname, wage) VALUES('" + firstname + "','" +lastname + "','" + wage +"')";
	db.query(query, function (err, result, fields){
		if(err) throw err;
	res.send(JSON.stringify("Success"));
	});
});


// Update functions
app.put('/animals/:id', function(req, res) {
	var id = req.params.id;
    var Birthday = req.body.birthday;
	var Breed = req.body.breed;
	var Entry_date = req.body.entry_date;
	var Food_per_day = req.body.food_per_day;
	var Id_Cage = req.body.id_cage;
	var Name = req.body.name;

	var query = "UPDATE animals SET ";
	if(Birthday !== undefined) query = query + " birthday = '"+ Birthday + "',";
	if(Breed !== undefined) query = query + " breed = '" + Breed + "',";
	if(Entry_date !== undefined) query = query + " entry_date = '" + Entry_date + "',";
    if(Food_per_day !== undefined) query = query + " food_per_day = '"+ Food_per_day + "',";
	if(Id_Cage !== undefined) query = query + " id_cage = '" + Id_Cage+ "',";
    if(Name !== undefined) query = query + " name = '" + Name + "',";

	query = query.slice(0,-1);
	query = query + " WHERE id=" + id;
	db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
	});
});

app.put('/cages/:id', function(req, res) {
	var id = req.params.id;
	var Area = req.body.area;
	var Description = req.body.description;
	var Name = req.body.name;
	var query = "UPDATE cages SET ";

	if(Area !== undefined) query = query + " area = '" + Area + "',";
	if(Description !== undefined) query = query + " description = '" + Description + "',";
    if(Name !== undefined) query = query + " name = '" + Name + "',";
	query = query.slice(0,-1);
	query = query + " WHERE id=" + id;
	db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
	});
});

app.put('/food/:id', function(req, res) {
	var id = req.params.id;
	var Name = req.body.name;
	var Id_animal = req.body.id_animal;
    var Quantity = req.body.quantity;

	var query = "UPDATE food SET ";
	if(Name !== undefined) query = query + " name = '" + Name + "',";
	if(Id_animal !== undefined) query = query + " id_animal = '" + Id_animal + "',";
	if(Quantity !== undefined) query = query + " quantity = '" + Quantity + "',";

	query = query.slice(0,-1);
	query = query + " WHERE id=" + id;
	db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
	});
});

app.put('/staff/:id', function(req, res) {
	var id = req.params.id;
	var Firstname = req.body.firstname;
	var Lastname = req.body.lastname;
	var Wage = req.body.wage;

	var query = "UPDATE staff SET ";
	if(Firstname !== undefined) query = query + " firstname = '"+Firstname+"',";
	if(Lastname !== undefined) query = query + " lastname = '"+Lastname+"',";
	if(Wage !== undefined) query = query + " wage = '"+Wage+"',";
	query = query.slice(0,-1);
	query = query + " WHERE id="+id;
	db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
	});
});


// Delete all functions
app.delete( '/animals' , function (req, res) {
	var query = "DELETE FROM animals" ;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.delete( '/cages' , function (req, res) {
	var query = "DELETE FROM cages" ;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.delete( '/food' , function (req, res) {
	var query = "DELETE FROM food" ;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.delete( '/staff' , function (req, res) {
	var query = "DELETE FROM staff" ;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});


// Delete one function
app.delete('/animals/:id', function(req, res){
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id = " +id;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
	res.send(JSON.stringify("Success"));
	});
});

app.delete('/cages/:id', function(req, res){
	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id = " +id;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
	res.send(JSON.stringify("Success"));
	});
});

app.delete('/food/:id', function(req, res){
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id = " +id;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
	res.send(JSON.stringify("Success"));
	});
});

app.delete('/staff/:id', function(req, res){
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id = " +id;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
	res.send(JSON.stringify("Success"));
	});
});


// Relation animals/cages function
app.get('/animals/:id_cage/cages',function(req,res){
	var id_cage = req.params.id_cage;
	var query= "SELECT cages.id,cages.area,cages.description, cages.name FROM animals INNER JOIN cages ON cages.id=animals.id_cage WHERE animals.id="+id_cage;
	var conditions = ["id", "area","description","name"];
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
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-")
				query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}
	if ("fields" in req.query) {
		query = query.replace("cages.id,cages.area,cages.description, cages.name","cages."+ req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
	});
});

app.get('/animals/:id_cage/cages/:id_animals',function(req,res){
	var id_cage = req.params.id_cage;
	var id_animals = req.params.id_animals;
	var query= "SELECT cages.id,cages.area,cages.description, cages.name FROM animals INNER JOIN cages ON animals.id_cage=cages.id WHERE animals.id="+id_cage+" AND cages.id="+id_animals;
	var conditions = ["id", "name","description","area"];
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
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-")
				query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}
	if ("fields" in req.query) {
		query = query.replace("cages.id,cages.area,cages.description, cages.name","cages."+ req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
	});
});

app.get('/cages/:id_animals/animals',function(req,res){
	var id_animals = req.params.id_animals;
	var query= "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM cages INNER JOIN animals ON cages.id=animals.id_cage WHERE cages.id=" + id_animals;
	var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
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
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-")
				query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}
	if ("fields" in req.query) {
		query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", "animals." + req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});

app.get('/cages/:id_animals/animals/:id_cages',function(req,res){
	var id_cages = req.params.id_cages;
	var id_animals = req.params.id_animals;
	var query= "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM cages INNER JOIN animals ON cages.id=animals.id_cage WHERE cages.id=" + id_cages + " AND animals.id=" + id_animals;
	var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
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
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-")
				query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}
	if ("fields" in req.query) {
		query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", "animals."+req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});


// Relations Food/animals functions
app.get('/animals/:id_food/food',function(req,res){
	var id_food = req.params.id_food;
	var query= "SELECT food.id, food.id_animal, food.name, food.quantity FROM animals INNER JOIN food ON food.id_animal=animals.id WHERE animals.id=" + id_food;
	var conditions = ["id", "id_animal","name","quantity"];
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
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-")
				query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}
	if ("fields" in req.query) {
		query = query.replace("food.id, food.id_animal, food.name, food.quantity","food." + req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
	});
});

app.get('/animals/:id_food/food/:id_animals',function(req,res){
	var id_food = req.params.id_food;
	var id_animals = req.params.id_animals;
	var query= "SELECT food.id,food.id_animal, food.name, food.quantity FROM animals INNER JOIN food ON food.id_animal=animals.id WHERE food.id=" + id_animals + " AND animals.id=" + id_food;
	var conditions = ["id", "name","quantity","id_animal"];
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
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-")
				query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}
	if ("fields" in req.query) {
		query = query.replace("food.id,food.id_animal, food.name, food.quantity","food."+ req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
	});
});

app.get('/food/:id_animals/animals',function(req,res){
	var id_animals = req.params.id_animals;
	var query= "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM food INNER JOIN animals ON food.id_animal=animals.id WHERE food.ID=" + id_animals;
	var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
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
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-")
				query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}
	if ("fields" in req.query) {
		query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", "animals."+req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});

app.get('/food/:id_animals/animals/:id_food',function(req,res){
	var id_food = req.params.id_food;
	var id_animals = req.params.id_animals;
	var query= "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM food INNER JOIN animals ON food.id_animal=animals.ID WHERE food.ID="+id_animals+" AND animals.ID="+id_food;
	var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
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
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-")
				query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}
	if ("fields" in req.query) {
		query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", "animals."+req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
	});
});


// Food-stats function
app.get('/food-stats', function(req, res) {
	var query = "SELECT animals.id, CASE WHEN animals.food_per_day = 0 THEN 0" +
	" ELSE food.quantity/animals.food_per_day END as days_left" +
	" FROM animals INNER JOIN food ON animals.id=food.id_animal";
	db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
	});
});


// Connection to the database
app.listen(3000, function(){
	db.connect(function(err){
		if(err)
		{
			throw err;
			console.log('Connection to database unsuccessful!');
		}
		console.log('Connection to database successful!');
	});
	console.log('Example app listening on port 3000!');
});

