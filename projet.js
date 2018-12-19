const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

//CREATION DE LA CONNEXION
var db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "PROJET",
	port:"8889"


});

//TP4 - BONUS Pare-feu

//////////////////////////////////////////////////////
/////////////////////////PARE-FEU////////////////////
////////////////////////////////////////////////////

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
				res.status(403).send("ERROR HTTP 403");
			}
		});
	} else {
		res.status(403).send("ERROR HTTP 403");
	}
});


//////////////////////////////////////////////////////
//////////////////////////GET////////////////////////
////////////////////////////////////////////////////


////////////////////ANIMAL/////////////////////////


app.get('/animals/:id' , function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id=" + id;
	///FILTRE
	if ( "fields" in req.query) {
	query = query.replace( "*" , req.query[ "fields" ]);
	}
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
		
	});

});


///FILTRE

//CONDITION
app.get( '/animals' , function (req, res) {
	var query = "SELECT * FROM animals" ;
	var conditions = [ "name" , "breed","food_per_day","birthday","entry_date","id_cage" ];
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
//ORDRE
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
//CHAMPS
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
//PAGINATION
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

app.post('/animals' , function(req, res) {
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date=req.body.entry_date;
	var id_cage = req.body.id_cage;
	var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" + name + "','" + breed + "','" + food_per_day + "','" + birthday + "','" + entry_date + "','" + id_cage + "')";
	console.log(query);
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		
		res.send(JSON.stringify("Success"));

	});
}); 





////////////////////CAGE/////////////////////////

app.get('/cages/:id' , function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;
	///FILTRE
	if ( "fields" in req.query) {
	query = query.replace( "*" , req.query[ "fields" ]);
	}
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
		
	});

});

///FILTRE

//CONDITION
app.get( '/cages' , function (req, res) {
	var query = "SELECT * FROM cages" ;
	var conditions = [ "name" , "description","area" ];
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
//ORDRE
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
//CHAMPS
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
//PAGINATION
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


////////////////////FOOD/////////////////////////

app.get('/food/:id' , function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id=" + id;
	///FILTRE
	if ( "fields" in req.query) {
	query = query.replace( "*" , req.query[ "fields" ]);
	}
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
		
	});

});

///FILTRE

//CONDITION
app.get( '/food' , function (req, res) {
	var query = "SELECT * FROM food" ;
	var conditions = [ "name" , "quantity","animal" ];
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
//ORDRE
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
//CHAMPS
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
//PAGINATION
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

////////////////////STAFF/////////////////////////

app.get('/staff/:id' , function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id=" + id;
	///FILTRE
	if ( "fields" in req.query) {
	query = query.replace( "*" , req.query[ "fields" ]);
	}
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
		
	});

});

///FILTRE

//CONDITION
app.get( '/staff' , function (req, res) {
	var query = "SELECT * FROM staff" ;
	var conditions = [ "firstname" , "lastname","wage" ];
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
//ORDRE
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
//CHAMPS
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
//PAGINATION
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

////////////////////FOOD-STAT/////////////////////////

///READ ET FILTRES
 
app.get( '/food-stats' , function (req, res) {
	var query ="SELECT animals.id as id,(food.quantity/animals.food_per_day) as days_left FROM animals INNER JOIN food ON animals.id =food.id_animal" ;
//ORDRE
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
//CHAMPS
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
//PAGINATION
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

//////////////////////////////////////////////////////
//////////////////////////CREATE/////////////////////
////////////////////////////////////////////////////

////////////////////ANIMAL/////////////////////////
app.post('/animals' , function(req, res) {
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date=req.body.entry_date;
	var id_cage = req.body.id_cage;
	var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" + name + "','" + breed + "','" + food_per_day + "','" + birthday + "','" + entry_date + "','" + id_cage + "')";
	console.log(query);
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		
		res.send(JSON.stringify("Success"));

	});
}); 

////////////////////CAGE/////////////////////////
app.post('/cages' , function(req, res) {
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	var query = "INSERT INTO cages (name, description, area) VALUES ('" + name + "','" + description + "','" + area + "')";
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		
		res.send(JSON.stringify("Success"));

	});
});

////////////////////FOOD/////////////////////////
app.post('/food' , function(req, res) {
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;
	var query = "INSERT INTO food (name,quantity,id_animal) VALUES ('" + name + "','" + quantity + "','" + id_animal + "')";
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		
		res.send(JSON.stringify("Success"));

	});
});

////////////////////STAFF/////////////////////////
app.post('/staff' , function(req, res) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('" + firstname + "','" + lastname + "','" + wage + "')";
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		
		res.send(JSON.stringify("Success"));

	});
}); 

//////////////////////////////////////////////////////
/////////////////////////UPDATE//////////////////////
////////////////////////////////////////////////////

////////////////////ANIMAL/////////////////////////
app.put( '/animals/:id' , function (req, res) {
	var id = req.params.id;
	var query = "" ;
	var fields = [ "name" , "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];
	for ( var index in fields) {
		if (fields[index] in req.body) {
			if (query.indexOf( "UPDATE" ) >= 0 ) {
				query += ", " + fields[index] + "='" +
				req.body[fields[index]] + "' ";
			} else {
				query += "UPDATE animals SET " + fields[index] + "='" +
				req.body[fields[index]] + "' " ;
			}
		}
	}
	query += "WHERE animals.id=" + id;

	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});

////////////////////CAGE/////////////////////////
app.put( '/cages/:id' , function (req, res) {
	var id = req.params.id;
	var query = "" ;
	var fields = [ "name", "description", "area"];
	for ( var index in fields) {
		if (fields[index] in req.body) {
			if (query.indexOf( "UPDATE" ) >= 0 ) {
				query += ", " + fields[index] + "='" +
				req.body[fields[index]] + "' ";
			} else {
				query += "UPDATE cages SET " + fields[index] + "='" +
				req.body[fields[index]] + "' " ;
			}
		}
	}
	query += "WHERE cages.id=" + id;

	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});

////////////////////FOOD/////////////////////////
app.put( '/food/:id' , function (req, res) {
	var id = req.params.id;
	var query = "" ;
	var fields = [ "name", "quantity", "id_animal"];
	for ( var index in fields) {
		if (fields[index] in req.body) {
			if (query.indexOf( "UPDATE" ) >= 0 ) {
				query += ", " + fields[index] + "='" +
				req.body[fields[index]] + "' ";
			} else {
				query += "UPDATE food SET " + fields[index] + "='" +
				req.body[fields[index]] + "' " ;
			}
		}
	}
	query += "WHERE food.id=" + id;

	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});

////////////////////STAFF/////////////////////////
app.put( '/staff/:id' , function (req, res) {
	var id = req.params.id;
	var query = "" ;
	var fields = [ "firstname", "lastname", "wage"];
	for ( var index in fields) {
		if (fields[index] in req.body) {
			if (query.indexOf( "UPDATE" ) >= 0 ) {
				query += ", " + fields[index] + "='" +
				req.body[fields[index]] + "' ";
			} else {
				query += "UPDATE staff SET " + fields[index] + "='" +
				req.body[fields[index]] + "' " ;
			}
		}
	}
	query += "WHERE staff.id=" + id;

	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});


//////////////////////////////////////////////////////
//////////////////////////DELETE/////////////////////
////////////////////////////////////////////////////

////////////////////ANIMAL/////////////////////////
app.delete('/animals',function(req,res) {
	var query = "DELETE FROM animals " ;
	db.query(query,function(err,result,fields) {
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/animals/:id',function(req,res) {
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id=" +id ;
	db.query(query,function(err,result,fields) {
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

////////////////////CAGE/////////////////////////
app.delete('/cages',function(req,res) {
	var query = "DELETE FROM cages " ;
	db.query(query,function(err,result,fields) {
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/cages/:id',function(req,res) {
	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id=" +id ;
	db.query(query,function(err,result,fields) {
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

////////////////////FOOD/////////////////////////
app.delete('/food',function(req,res) {
	var query = "DELETE FROM food " ;
	db.query(query,function(err,result,fields) {
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/food/:id',function(req,res) {
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id=" +id ;
	db.query(query,function(err,result,fields) {
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

////////////////////STAFF/////////////////////////
app.delete('/staff',function(req,res) {
	var query = "DELETE FROM staff " ;
	db.query(query,function(err,result,fields) {
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/staff/:id',function(req,res) {
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id=" +id ;
	db.query(query,function(err,result,fields) {
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//////////////////////////////////////////////////////
///////////////////////RELATIONS/////////////////////
////////////////////////////////////////////////////

//ANIMAL ET CAGE
app.get( '/animals/:id/cages' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;	

///FILTRE
	//CONDITION
	var conditions = [ "id","name","description","area"];
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
	//CHAMPS
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	//PAGINATION
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

app.get( '/animals/:id_animal/cages/:id_cage' , function (req, res) {
var id_animal = req.params.id_animal;
var id_cage = req.params.id_cage;
var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animal + " AND cages.id=" +id_cage;

///FILTRE
	//CONDITION
	var conditions = [ "id","name","description","area"];
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
	//CHAMPS
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	//PAGINATION
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

//CAGE ET ANIMAL
app.get( '/cages/:id/animals' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id=animals.id_cage WHERE cages.id=" + id; 

///FILTRE
	//CONDITION
	var conditions = [ "id","name" ,"breed","food_per_day","birthday","entry_date","id_cage" ];
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
	//CHAMPS
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	//PAGINATION
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

//FOOD ET ANIMAL
app.get( '/food/:id/animals' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal=animals.id WHERE food.id=" + id;

///FILTRE
	//CONDITION
	var conditions = [ "id","name" ,"breed","food_per_day","birthday","entry_date","id_cage" ];
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
	//CHAMPS
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	//PAGINATION
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


app.get( '/food/:id_food/animals/:id_animal' , function (req, res) {
var id_food = req.params.id_food;
var id_animal = req.params.id_animal;
var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal=animals.id WHERE food.id=" + id_food + " AND animals.id=" +id_animal;

///FILTRE
	//CONDITION
	var conditions = [ "id","name" ,"breed","food_per_day","birthday","entry_date","id_cage" ];
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
	//CHAMPS
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	//PAGINATION
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

//ANIMAL ET FOOD
app.get( '/animals/:id/food' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id =food.id_animal WHERE animals.id=" + id;

///FILTRE
	//CONDITION
	var conditions = [ "id","name" , "quantity","id_animal"];
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
	//CHAMPS
	if ( "fields" in req.query) {
		query = query.replace( "*" , req.query[ "fields" ]);
	}
	//PAGINATION
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



app.listen(3000,function() {
	db.connect(function(err) {
		if (err) throw err;
		console.log('Connection to database successful!');
	});
});



