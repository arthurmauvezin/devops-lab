const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//Creating a mysql connection to the database
var db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "zoo",
	port: "3306"
});

//I will comment only the animal routes as the same principles apply to all routes

//Token verification
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
				res.status(403).end();
			}
		});
	} else {
		res.status(403).end();
	}
});

//Get all animals in the table
app.get('/animals', function(req, res) {
	var query = "SELECT * FROM animals" //We get all the animals
	var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"]; //We define the different possible conditions the developper might want in the request
	
	//For every condition found in the query we add to the SQL query the necessary keywords
	for (var index in  conditions) {
		if(conditions[index] in req.query) {
			if(query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {	
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}
	
	//If there is a limit in the query, we add to the SQL query the necessary keywords
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}

	//If there is a sort in the query, we add to the SQL query the necessary keywords
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
	
	//If the query specifies the fields wanted, we replace the * for the specified fields
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	//We query the database with the constructed query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//Get a specific animal in the table by ID, same plrinciple as get all animals but with a specified ID
app.get('/animals/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id=" + id;
	var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
	
	for (var index in  conditions) {
		if(conditions[index] in req.query) {
			if(query.indexOf("WHERE") < 0) {
				query += "WHERE";
			} else {	
				query += "AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
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
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//Create a new animal in the table
app.post('/animals', function(req, res) {
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;
	
	//Construct the insert query with all the necessary specified fields
	var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('" + name + "', '" + breed + "', " + food_per_day + ", '" + birthday + "', '" + entry_date + "', " + id_cage + ")"; 
	
	db.query(query ,function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

//Update a specific animal in the table
app.put('/animals/:id', function(req, res) {
	
	var id = req.params.id;
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var cage = req.body.id_cage;
	
	//Construct the update query by adding each field if they are specified 
	var query = "UPDATE animals SET ";
	if(name !== undefined) query+=" name = '"+name+"',";
	if(breed !== undefined) query+=" breed = '"+breed+"',";
	if(food_per_day !== undefined) query+=" food_per_day = '"+food_per_day+"',";
	if(birthday !== undefined) query+=" birthday = '"+birthday+"',";
	if(entry_date !== undefined) query+=" entry_date = '"+entry_date+"',";
	if(cage !== undefined) query+=" id_cage = '"+cage+"',";
	
	query=query.slice(0,-1);
	query+= " WHERE id="+id;
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify("Success"));
	});

});

//Delete all animals
app.delete('/animals', function(req, res) {
	var query = "DELETE FROM animals";
	db.query(query,function(err, result, fields) {
		if(err) throw err;
		
		res.send(JSON.stringify("Success"));
	});
});

//Delete a specific animal
app.delete('/animals/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id=" + id;
	db.query(query,function(err, result, fields) {
		if(err) throw err;
		
		res.send(JSON.stringify("Success"));
	});
});

//Get cages associated with a specific animal
app.get('/animals/:id/cages', function(req, res) {
	var id = req.params.id;
	
	//To get the cages associated, we need to INNER JOIN the tables cages and animals on ids
	var query= "SELECT cages.id,cages.name,cages.description,cages.area FROM animals INNER JOIN cages ON cages.id=animals.id_cage WHERE animals.id="+id;
	
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
		//Replace the already defined cage fields by the specified fields 
		query = query.replace("cages.id,cages.name,cages.description,cages.area","cages."+ req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//Get a specific cage associated with a specific animal, same principle as before but we specify the id of the cage in the constructed query
app.get('/animals/:id_animal/cages/:id_cage', function(req, res) {
	var id_animal = req.params.id_animal;
	var id_cage = req.params.id_cage;
	
	var query= "SELECT cages.id,cages.name,cages.description,cages.area FROM animals INNER JOIN cages ON animals.id_cage=cages.id WHERE animals.id=" + id_animal + " AND cages.id="+ id_cage;
	
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
		query = query.replace("cages.id,cages.name,cages.description,cages.area","cages."+ req.query["fields"]);
	}
	
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//Get the food of a specific animal, same principle as before but with the tables animals and food
app.get('/animals/:id/food', function(req, res) {
	var id = req.params.id;
	
	var query= "SELECT food.id,food.name,food.quantity,food.id_animal FROM animals INNER JOIN food ON food.id_animal=animals.id WHERE animals.id="+id;
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
		query = query.replace("food.id,food.name,food.quantity,food.id_animal","food."+ req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

/////////////////////////////////

app.get('/cages', function(req, res) {
	var query = "SELECT * FROM cages"
	var conditions = ["id", "name","description","area"];
	
	for (var index in  conditions) {
		if(conditions[index] in req.query) {
			if(query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {	
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
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
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.get('/cages/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;
	var conditions = ["id", "name","description","area"];
	
	for (var index in  conditions) {
		if(conditions[index] in req.query) {
			if(query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {	
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
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
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.post('/cages', function(req, res) {
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	
	var query = "INSERT INTO cages (name, description, area) VALUES ('" + name + "', '" + description + "', " + area +")";
	
	db.query(query ,function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

app.put('/cages/:id', function(req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	
	var query = "UPDATE cages SET ";
	if(name !== undefined) query+=" name = '"+name+"',";
	if(description !== undefined) query+=" description = '"+description+"',";
	if(area !== undefined) query+=" area = '"+area+"',";
	
	query=query.slice(0,-1);
	query+= " WHERE id="+id;
	
	db.query(query ,function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

app.delete('/cages', function(req, res) {
	var query = "DELETE FROM cages";
	db.query(query,function(err, result, fields) {
		if(err) throw err;
		
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/cages/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id=" + id;
	db.query(query,function(err, result, fields) {
		if(err) throw err;
		
		res.send(JSON.stringify("Success"));
	});
});

app.get('/cages/:id/animals', function(req, res) {
	var id = req.params.id;
	var query= "SELECT animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date,animals.id_cage FROM cages INNER JOIN animals ON cages.id=animals.id_cage WHERE cages.id="+id;
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
		query = query.replace("animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date,animals.id_cage", "animals."+req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

/////////////////////////////////


app.get('/food', function(req, res) {
	var query = "SELECT * FROM food"
	var conditions = ["id", "name","quantity","id_animal"];
	
	for (var index in  conditions) {
		if(conditions[index] in req.query) {
			if(query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {	
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
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
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.get('/food/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id=" + id;
	var conditions = ["id", "name","quantity","id_animal"];
	
	for (var index in  conditions) {
		if(conditions[index] in req.query) {
			if(query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {	
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
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
		query = query.replace("*", req.query["fields"]);
	}
	
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.post('/food', function(req, res) {
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;
	
	var query = "INSERT INTO food (name, quantity, id_animal) VALUES ('" + name + "', " + quantity + ", " + id_animal + ")";
	
	db.query(query ,function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

app.put('/food/:id', function(req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;
	
	var query = "UPDATE food SET ";
	if(name !== undefined) query+=" name = '"+name+"',";
	if(quantity !== undefined) query+=" quantity = '"+quantity+"',";
	if(id_animal !== undefined) query+=" id_animal = '"+id_animal+"',";
	
	query=query.slice(0,-1);
	query+= " WHERE id="+id;
	
	db.query(query ,function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

app.delete('/food', function(req, res) {
	var query = "DELETE FROM food";
	db.query(query,function(err, result, fields) {
		if(err) throw err;
		
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/food/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id=" + id;
	db.query(query,function(err, result, fields) {
		if(err) throw err;
		
		res.send(JSON.stringify("Success"));
	});
});

app.get('/food/:id/animals', function(req, res) {
	var id = req.params.id;
	var query= "SELECT animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date,animals.id_cage FROM food INNER JOIN animals ON food.id_animal=animals.id WHERE food.ID="+id;
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
		query = query.replace("animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date,animals.id_cage", "animals."+req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.get('/food/:id_food/animals/:id_animal', function(req, res) {
	var id_food = req.params.id_food;
	var id_animal = req.params.id_animal;
	
	var query= "SELECT animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date,animals.id_cage FROM food INNER JOIN animals ON food.id_animal=animals.ID WHERE food.ID="+id_food+" AND animals.ID="+id_animal;
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
		query = query.replace("animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date,animals.id_cage", "animals."+req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


/////////////////////////////////


app.get('/staff', function(req, res) {
	var query = "SELECT * FROM staff"
	var conditions = ["id", "firstname","lastname","wage"];
	
	for (var index in  conditions) {
		if(conditions[index] in req.query) {
			if(query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {	
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
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
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.get('/staff/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id=" + id;
	var conditions = ["id", "firstname","lastname","wage"];
	
	for (var index in  conditions) {
		if(conditions[index] in req.query) {
			if(query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {	
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
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
		query = query.replace("*", req.query["fields"]);
	}
	
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.post('/staff', function(req, res) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	
	var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('" + firstname + "', '" + lastname + "', " + wage +")";
	
	db.query(query ,function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

app.put('/staff/:id', function(req, res) {
	var id = req.params.id;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	
	var query = "UPDATE staff SET ";
	if(firstname !== undefined) query+=" firstname = '"+firstname+"',";
	if(lastname !== undefined) query+=" lastname = '"+lastname+"',";
	if(wage !== undefined) query+=" wage = '"+wage+"',";
	
	query=query.slice(0,-1);
	query+= " WHERE id="+id;	
	
	db.query(query ,function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

app.delete('/staff', function(req, res) {
	var query = "DELETE FROM staff";
	db.query(query,function(err, result, fields) {
		if(err) throw err;
		
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/staff/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id=" + id;
	db.query(query,function(err, result, fields) {
		if(err) throw err;
		
		res.send(JSON.stringify("Success"));
	});
});


/////////////////////////////////

//Getting the days of food left for all animals, we use COALESCE to make sure the null case is equal to 0
app.get('/food-stats', function(req, res) {
	var query = "SELECT animals.id, COALESCE(food.quantity/animals.food_per_day, 0) as days_left FROM food INNER JOIN animals ON food.id_animal=animals.id";
	
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});


/////////////////////////////////

//Connecting to database, listening on port 3000
app.listen(3000, function() {
	
	db.connect(function(err) {
		if (err) throw err;
		console.log('Connection to database successful!');
	});
	
	console.log('Listening on port 3000!');
});
