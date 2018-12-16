const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

//Declaration of environment variables

const duckerHost = process.environment.MYSQL_HOST;
const duckerPort = process.environment.MYSQL_PORT;
const duckerDataBase = process.environment.MYSQL_DATABASE;
const duckerUser = process.environment.MYSQL_USER;
const duckerPassword = process.environment.MYSQL_PASSWORD;

app.use(bodyParser.urlencoded({ extended: true }));
var db = mysql.createConnection({
	host: duckerHost,
	user: duckerUser,
	password: duckerPassword,
	database: duckerDataBase
});


////////////////////////////////////////////////////////////
////													////
////					FIREWALL						////
////													////
////////////////////////////////////////////////////////////

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
				res.status(403).send("error HTTP 403");
			}
		});
	} else {
		res.status(403).send("error HTTP 403");
	}
});
///////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
////													////
////					FOOD-STATS					    ////
////													////
////////////////////////////////////////////////////////////


app.get('/food-stats', function(req, res) {
	var query = "SELECT animals.id as id, if(animals.food_per_day = 0,0,food.quantity/animals.food_per_day) as days_left from animals join food where animals.id = food.id_animal";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
//// 													////
////   HTTP.POST REQUESTS (ADDING TO THE DB)            ////
////													////
////////////////////////////////////////////////////////////


/****************** FULL INSERTS *****************/

////ANIMAL///
app.post('/animals', function(req, res) {
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;
	var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('" + name + "','" + breed + "'," + food_per_day + ",'" + birthday + "','" + entry_date + "'," + id_cage + ")";

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});
/////////

////CAGES////
app.post('/cages', function(req, res) {

	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;

	var query = "INSERT INTO cages (name, description, area) VALUES ('" + name + "','" + description + "'," + area +")";

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});
////////

////FOOD////
app.post('/food', function(req, res) {

	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;

	var query = "INSERT INTO food (name, quantity, id_animal) VALUES ('" + name + "'," + quantity + "," + id_animal + ")";

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});
////////

////STAFF////
app.post('/staff', function(req, res) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;

	var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('" + firstname + "','" + lastname + "'," + wage + ")";

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});
////////

////USERS////
app.post('/users', function(req, res) {

	var username = req.body.username;
	var apikey = req.body.apikey;

	var query = "INSERT INTO users (username, apikey) VALUES ('" + username + "','" + apikey + "')";

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});
////////





////////////////////////////////////////////////////////////
//// 													////
////   HTTP.GET REQUESTS (READING DATA FROM THE DB)     ////
////													////
////////////////////////////////////////////////////////////


/***** RELATIONSHIP ANIMAL/CAGES *****/
////READ ALL////
app.get('/animals/:id/cages', function(req, res){ 
	var id = req.params.id;
	var query = "SELECT animals.id, cages.id, cages.name, description, area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;
	
	if ( "fields" in req.query) {
		query = query.replace( "animals.id, cages.id, cages.name, description, area" , req.query[ "fields" ]);
	}
	
	var conditions = ["name", "description","area","id", "cages.name","animals.id"];
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
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
////////

//// READ ONE ////
app.get('/animals/:animal_id/cages/:cage_id', function(req, res){
	var animalID = req.params.animal_id;
	var cageID = req.params.cage_id;
	var query = "SELECT animals.id, cages.id, cages.name, description, area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id=" + cageID + " AND animals.id = " + animalID;
	
	if ( "fields" in req.query) {
		query = query.replace( "animals.id, cages.id, cages.name, description, area" , req.query[ "fields" ]);
	}

	var conditions = ["name", "description","area","id", "cages.name","animals.id"];
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
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
////////
/***************************/


/***** RELATIONSHIP CAGES/ANIMAL *****/
//// READ ALL ////
 app.get('/cages/:id/animals', function(req, res){ 
 	var id = req.params.id;
 	var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id=" + id;

 	
 	
 	if ( "fields" in req.query) {
 		query = query.replace( "animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage" , req.query[ "fields" ]);
 	}
 	
 	var conditions = ["name","breed","food_per_day","birthday","entry_date","id_cage", "animals.name"];
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

 	db.query(query, function(err, result, fields) {
 		if (err) throw err;
 		res.send(JSON.stringify(result));
 	});
 });
 ////////
 /************************/

 /***** RELATIONSHIP FOOD/ANIMALS *****/

 //// READ ALL ////
 app.get('/food/:id/animals', function(req, res){ 
 	var id = req.params.id;
 	var query = "SELECT animals.id, animals.name, breed, food_per_day , birthday, entry_date, id_cage FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + id;

 	if ( "fields" in req.query) {
 		query = query.replace( "animals.id, animals.name, breed, food_per_day , birthday, entry_date, id_cage" , req.query[ "fields" ]);
 	}

 	var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
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

 	db.query(query, function(err, result, fields) {
 		if (err) throw err;
 		res.send(JSON.stringify(result));
 	});
 });
//////////////

//// READ ONE ////
 app.get('/food/:food_id/animals/:animal_id', function(req, res){

 	var foodID = req.params.food_id;
 	var animalID = req.params.animal_id;
 	var query = "SELECT animals.id, animals.name, breed, food_per_day , birthday, entry_date, id_cage FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + foodID + " AND animals.id = " +animalID;

 	if ( "fields" in req.query) {
 		query = query.replace( "animals.id, animals.name, breed, food_per_day , birthday, entry_date, id_cage" , req.query[ "fields" ]);
 	}

 	var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage", "animals.name"];
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

 	db.query(query, function(err, result, fields) {
 		if (err) throw err;
 		res.send(JSON.stringify(result));
 	});
 });
 //////////////////
 /*********************/


/***** RELATIONSHIP ANIMALS/FOOD *****/
//// READ ALL ////
 app.get('/animals/:id/food', function(req, res){ 

 	var id = req.params.id;
 	var query = "SELECT food.id, food.name, quantity, id_animal FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;

 	if ( "fields" in req.query) {
 		query = query.replace( "food.id, food.name, quantity, id_animal" , req.query[ "fields" ]);
 	}

 	var conditions = ["name", "quantity","id_animal","animals.name"];
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

 	db.query(query, function(err, result, fields) {
 		if (err) throw err;
 		res.send(JSON.stringify(result));
 	});
 });
////////////////
/**********************/

/***** ANIMALS *****/
//// READ ALL ////
 app.get('/animals', function(req, res) {
 	var query = "SELECT * FROM animals";

 	if ("fields" in req.query) {
 		query = query.replace("*", req.query["fields"]);
 	}


 	var conditions = ["id", "food_per_day","id_cage","birthday","entry_date","id_cage"];
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


 	if ("sort" in req.query) {
 		var sort = req.query["sort"].split(",");
 		query += " ORDER BY";
 		for (var index in sort) {
 			var direction = sort[index].substr(0, 1);
 			var field = sort[index].substr(1);
 			query += " " + field;
 			if (direction == "-")
 				query += " DESC,";
 			else
 				query += " ASC,";
 		}
 		query = query.slice(0, -1);
 	}

 	if ("limit" in req.query) {
 		query += " LIMIT " + req.query["limit"];
 		if ("offset" in req.query) {
 			query += " OFFSET " + req.query["offset"];
 		}
 	}


 	db.query(query, function(err, result, fields) {
 		if (err) throw err;

 		res.send(JSON.stringify(result));
 	});
 });
//////////////


//// READ ONE ////
 app.get('/animals/:id', function(req, res) {
 	var id = req.params.id;
 	var query = "SELECT * FROM animals WHERE id = " + id;

 	if ("fields" in req.query) {
 		query = query.replace("*", req.query["fields"]);
 	}

 	db.query(query, function(err, result, fields) {
 		if (err) throw err;

 		res.send(JSON.stringify(result));
 	});
 });
 /////////
 /******************/



/***** CAGES *****/
//// READ ALL ////
 app.get('/cages', function(req, res) {
 	var query = "SELECT * FROM cages";

 	if ("fields" in req.query) {
 		query = query.replace("*", req.query["fields"]);
 	}


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


 	if ("sort" in req.query) {
 		var sort = req.query["sort"].split(",");
 		query += " ORDER BY";
 		for (var index in sort) {
 			var direction = sort[index].substr(0, 1);
 			var field = sort[index].substr(1);
 			query += " " + field;
 			if (direction == "-")
 				query += " DESC,";
 			else
 				query += " ASC,";
 		}
 		query = query.slice(0, -1);
 	}

 	if ("limit" in req.query) {
 		query += " LIMIT " + req.query["limit"];
 		if ("offset" in req.query) {
 			query += " OFFSET " + req.query["offset"];
 		}
 	}

 	db.query(query, function(err, result, fields) {
 		if (err) throw err;

 		res.send(JSON.stringify(result));
 	});
 });
 ///////////

//// READ ONE ////
 app.get('/cages/:id', function(req, res) {
 	var id = req.params.id;
 	var query = "SELECT * FROM cages WHERE id = " + id;

 	if ("fields" in req.query) {
 		query = query.replace("*", req.query["fields"]);
 	}

 	db.query(query, function(err, result, fields) {
 		if (err) throw err;

 		res.send(JSON.stringify(result));
 	});
 });
////////////////
/****************************/


/***** FOOD *****/
//// READ ALL ////
 app.get('/food', function(req, res) {
 	var query = "SELECT * FROM food";

 	if ("fields" in req.query) {
 		query = query.replace("*", req.query["fields"]);
 	}


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


 	if ("sort" in req.query) {
 		var sort = req.query["sort"].split(",");
 		query += " ORDER BY";
 		for (var index in sort) {
 			var direction = sort[index].substr(0, 1);
 			var field = sort[index].substr(1);
 			query += " " + field;
 			if (direction == "-")
 				query += " DESC,";
 			else
 				query += " ASC,";
 		}
 		query = query.slice(0, -1);
 	}

 	if ("limit" in req.query) {
 		query += " LIMIT " + req.query["limit"];
 		if ("offset" in req.query) {
 			query += " OFFSET " + req.query["offset"];
 		}
 	}

 	db.query(query, function(err, result, fields) {
 		if (err) throw err;

 		res.send(JSON.stringify(result));
 	});
 });
 /////////////

//// READ ONE /////
 app.get('/food/:id', function(req, res) {
 	var id = req.params.id;
 	var query = "SELECT * FROM food WHERE id = " + id;

 	if ("fields" in req.query) {
 		query = query.replace("*", req.query["fields"]);
 	}

 	db.query(query, function(err, result, fields) {
 		if (err) throw err;

 		res.send(JSON.stringify(result));
 	});
 });
 ///////////////
 /**********************/


/***** STAFF *****/
//// READ ALL ////
 app.get('/staff', function(req, res) {
 	var query = "SELECT * FROM staff";

 	if ("fields" in req.query) {
 		query = query.replace("*", req.query["fields"]);
 	}


 	var conditions = ["id", "firstname","lastname","wage"];
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


 	if ("sort" in req.query) {
 		var sort = req.query["sort"].split(",");
 		query += " ORDER BY";
 		for (var index in sort) {
 			var direction = sort[index].substr(0, 1);
 			var field = sort[index].substr(1);
 			query += " " + field;
 			if (direction == "-")
 				query += " DESC,";
 			else
 				query += " ASC,";
 		}
 		query = query.slice(0, -1);
 	}

 	if ("limit" in req.query) {
 		query += " LIMIT " + req.query["limit"];
 		if ("offset" in req.query) {
 			query += " OFFSET " + req.query["offset"];
 		}
 	}

 	db.query(query, function(err, result, fields) {
 		if (err) throw err;

 		res.send(JSON.stringify(result));
 	});
 });
 ///////////////////


 //// READ ONE /////
 app.get('/staff/:id', function(req, res) {
 	var id = req.params.id;
 	var query = "SELECT * FROM staff WHERE id = " + id;

 	if ("fields" in req.query) {
 		query = query.replace("*", req.query["fields"]);
 	}

 	db.query(query, function(err, result, fields) {
 		if (err) throw err;

 		res.send(JSON.stringify(result));
 	});
 });
 ////////////////
 /*************************************/

/***** USERS *****/
//// READ ALL ////
 app.get('/users', function(req, res) {
 	var query = "SELECT * FROM users";

 	db.query(query, function(err, result, fields) {
 		if (err) throw err;

 		res.send(JSON.stringify(result));
 	});
 });
 //////////////

//// READ ONE ////
 app.get('/users/:id', function(req, res) {
 	var id = req.params.id;
 	var query = "SELECT * FROM users WHERE id = " + id;

 	db.query(query, function(err, result, fields) {
 		if (err) throw err;

 		res.send(JSON.stringify(result));
 	});
 });
 /////////////////
 /********************************/





////////////////////////////////////////////////////////////
//// 													////
////   HTTP.PUT REQUESTS (UPDATES DATA TO THE DB)       ////
////													////
////////////////////////////////////////////////////////////

/***** ANIMALS *****/
//UPDATES ANIMAL WITH ID :id
app.put('/animals/:id', function(req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;
	var i = 0;

	var query = "UPDATE animals SET "; 

	if (name){
		query += "name = '" + name + "'";
		i = 1;
	};

	if (breed){
		if (i == 1){query += ","};
		query += "breed = '" + breed + "'";
		i = 1;
	};

	if (food_per_day){
		if (i == 1){query += ","};
		query += "food_per_day = " + food_per_day;
		i = 1;
	};

	if (birthday){
		if (i == 1){query += ","};
		query += "birthday = '" + birthday + "'";
		i = 1;
	};

	if (entry_date){
		if (i == 1){query += ","};
		query +=  "entry_date = '" + entry_date + "'"; 
		i = 1;
	};

	if (id_cage){
		if (i == 1){query += ","};
		query +=  "id_cage =" + id_cage; 
	};

	query += " WHERE id = " + id ;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});
/*****************************************/

/***** CAGES *****/
//UPDATES CAGES WITH ID :id
app.put('/cages/:id', function(req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	var i = 0;

	var query = "UPDATE cages SET "; 

	if (name){
		query += "name = '" + name + "'";
		i = 1;
	};

	if (description){
		if (i == 1){query += ","};
		query += "description = '" + description + "'";
		i = 1;
	};

	if (area){
		if (i == 1){query += ","};
		query +=  "area =" + area; 
	};

	query += " WHERE id = " + id ;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});
/**********************************************/

/***** FOOD *****/
//UPDATES FOOD WITH ID :id
app.put('/food/:id', function(req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;
	var i = 0;

	var query = "UPDATE food SET "; 

	if (name){
		query += "name = '" + name + "'";
		i = 1;
	};

	if (quantity){
		if (i == 1){query += ","};
		query += "quantity = " + quantity;
		i = 1;
	};

	if (id_animal){
		if (i == 1){query += ","};
		query +=  "id_animal = " + id_animal; 
	};

	query += " WHERE id = " + id ; 

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});
/**********************************/

/***** STAFF *****/
//UPDATES STAFF WITH ID :id
app.put('/staff/:id', function(req, res) {
	var id = req.params.id;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var i = 0;

	var query = "UPDATE staff SET "; 

	if (firstname){
		query += "firstname = '" + firstname + "'";
		i = 1;
	};

	if (lastname){
		if (i == 1){query += ","};
		query += "lastname = '" + lastname + "'";
		i = 1;
	};

	if (wage){
		if (i == 1){query += ","};
		query += "wage = " + wage;
	};

	query += " WHERE id = " + id ;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});
/**********************************************/

/***** USERS *****/
//UPDATES USERS WITH ID :id
app.put('/users/:id', function(req, res) {
	var id = req.params.id;
	var username = req.body.username;
	var apikey = req.body.apikey;
	var i = 0;

	var query = "UPDATE users SET "; 

	if (username){
		query += "username = '" + username + "'";
		i = 1;
	};

	if (apikey){
		if (i == 1){query += ","};
		query += "apikey = '" + apikey + "'";
	};

	query += " WHERE id = " + id ;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("Success"));
	});
});
/***********************************************/




////////////////////////////////////////////////////////////
//// 													////
////  HTTP.DELETE REQUESTS (DELETES DATA FROM THE DB)   ////
////													////
////////////////////////////////////////////////////////////


/***** ANIMALS *****/
//DELETE ALL ANIMALS
app.delete('/animals', function(req, res) {
	var query = "DELETE FROM animals";

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});
//

//DELETE ANIMAL WITH ID :id
app.delete('/animals/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id = " + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});
//
/****************/

/***** CAGES *****/
//DELETE ALL CAGES
app.delete('/cages', function(req, res) {
	var query = "DELETE FROM cages";

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});
//

//DELETE CAGE WITH ID :id
app.delete('/cages/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id = " + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});
//
/****************/


/***** FOODS *****/
//DELETE ALL FOODS
app.delete('/food', function(req, res) {
	var query = "DELETE FROM food";

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});
//

//DELETE FOODS WITH ID :id
app.delete('/food/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id = " + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});
//
/*******************/

/***** STAFF *****/
//DELETE ALL STAFF
app.delete('/staff', function(req, res) {
	var query = "DELETE FROM staff";

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});
//

//DELETE STAFF WITH ID :id
app.delete('/staff/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id = " + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});
/**************************/

/***** USERS *****/
//DELETE ALL USERS
app.delete('/users', function(req, res) {
	var query = "DELETE FROM users";

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});
//

//DELETE USER WITH ID :id
app.delete('/users/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM users WHERE id = " + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});
//
/*****************************/

/*****STARTING SERVICE AND CONNECTION TO DB*****/
app.listen(duckerPort, function() {
	db.connect(function(err) {
		if (err) throw err;
		console.log('Connection to database successful!');
	});

	console.log('Example app listening on port 3000!');
});
/***********************************************/
