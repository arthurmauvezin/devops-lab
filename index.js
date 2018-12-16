
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();



// Connect to the Database "project"
var db = mysql.createConnection(
{
	host: "localhost",
	user: "root",
	password: "root",
	database: "project",
	port: "8889"
});


// Setting up the firewall
app.use(function(req, res, next) 
{
	if ("key" in req.query) 
	{
		var key = req.query["key"];
		var query = "SELECT * FROM users WHERE apikey='" +key+ "'";
		db.query(query, function(err, result, fields) 
		{
			if (err) throw err;
			if (result.length > 0) 
			{
				next();
			}
			else 
			{ 
				// return 403 HTTP Error if there is an error with the query
				res.status(403).send('403 HTTP error');
			}
		});
	} 
	else 
	{
		// return 403 HTTP Error if "key" is not in the query
		res.status(403).send('403 HTTP error');
	}
});


app.use(bodyParser.urlencoded({ extended: true }));




// GET / READ Home
app.get('/', function(req, res) 
{
	res.send('Welcome !');
});






// GET / READ animals table with optional filters
app.get('/animals', function(req, res) 
{
	var query = "SELECT * FROM animals";
	var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

	// Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	// Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	//Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("*", req.query["fields"]);
	}


	//Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}


	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});



// GET / READ one animal by its id with optional filters
app.get('/animals/:id', function(req, res) 
{
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id=" + id;
	var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

	//Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	//Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	//Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("*", req.query["fields"]);
	}

	//Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}

	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

// GET / READ the food of one animal by the id of the animal 
// (Foreign Key Relationship) with optional filters
app.get('/animals/:id/food', function(req, res) 
{
	var id = req.params.id;
	var query = "SELECT food.id, food.name FROM animals JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;
	var conditions = ["name", "quantity", "id_animal"];

	//Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	//Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	//Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("food.id, food.name", req.query["fields"]);
	}

	//Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}


	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

// GET / READ one food of one animal with the id of the animal and the id of the food if he eats this food 
// (Foreign Key Relationship) with optional filters
app.get('/animals/:id_animal/food/:id_food', function(req, res) 
{
	var id_animal = req.params.id_animal;
	var id_food = req.params.id_food;
	var query = "SELECT food.id, food.name FROM animals JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id_animal + " AND food.id=" +id_food;
	var conditions = ["name", "quantity", "id_animal"];

	//Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	//Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	//Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("food.id, food.name", req.query["fields"]);
	}

	//Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}


	db.query(query, function(err, result, fields) 
	{
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});

// GET / READ the cage of one animal by the id of the animal 
// (Foreign Key Relationship) with optional filters
app.get('/animals/:id/cages', function(req, res) 
{
	var id = req.params.id;
	var query = "SELECT cages.id, cages.name FROM animals JOIN cages ON cages.id = animals.id_cage WHERE animals.id=" + id;
	var conditions = ["name", "description", "area"];

	//Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	//Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	//Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("cages.id, cages.name", req.query["fields"]);
	}

	//Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}

	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

// GET /READ one cage of one animal by the id of the animal and the id of the cage if it is inside this cage 
// (Foreign Key Relationship) with optional filters
app.get('/animals/:id_animal/cages/:id_cage', function(req, res) 
{
	var id_cage = req.params.id_cage;
	var id_animal = req.params.id_animal;
	var query = "SELECT cages.id, cages.name FROM animals INNER JOIN cages ON cages.id = animals.id_cage WHERE animals.id=" + id_animal + " AND cages.id=" +id_cage;
	var conditions = ["name", "description", "area"];

	//Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	//Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	//Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("cages.id, cages.name", req.query["fields"]);
	}

	//Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}

	db.query(query, function(err, result, fields) 
	{
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});


// POST / CREATE data in the animals table
app.post('/animals', function(req, res) 
{
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;
	var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('"+name+"', '"+breed+"', '"+food_per_day+"', '"+birthday+"', '"+entry_date+"', '"+id_cage+"')";
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});



// PUT / UPDATE animals table by the id of the animal
app.put('/animals/:id', function(req, res) 
{
	var count = 0;
	var id = req.params.id;
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;
	var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

	var query = "UPDATE animals SET ";

	for (var index in conditions) 
	{
		if (conditions[index] in req.body)
		{
			if(count>0){query+= " , ";}
			query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";
			count++;
		}
	}

	
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});



// DELETE the animals table
app.delete('/animals', function(req, res) 
{
	var query = "DELETE FROM animals";
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});



// DELETE one animal by its id
app.delete('/animals/:id', function(req, res) 
{
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id=" + id;
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});














// GET / READ the cages table with optional filters
app.get('/cages', function(req, res) 
{

	var query = "SELECT * FROM cages";
	var conditions = ["name", "description", "area"];

	//Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	//Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	//Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("*", req.query["fields"]);
	}

	//Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}


	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


// GET / READ one cage by its id with optional filters
app.get('/cages/:id', function(req, res) 
{
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;
	var conditions = ["name", "description", "area"];

	//Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	//Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	//Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("*", req.query["fields"]);
	}

	//Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


// GET / READ the animal(s) in a cage by the id of the cage 
// (Foreign Key Relationship) with optional filters
app.get('/cages/:id/animals', function(req, res) 
{
	var id = req.params.id;
	var query = "SELECT animals.id, animals.name FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id;
	var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

	//Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	//Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	// Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("animals.id, animals.name", req.query["fields"]);
	}

	//Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}

	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});



// GET / READ one animal in a cage by the id of the cage and the id of the animal if he is in it 
// (Foreign Key Relationship) with optional filters
app.get('/cages/:id_cage/animals/:id_animal', function(req, res) 
{
	var id_cage = req.params.id_cage;
	var id_animal = req.params.id_animal;
	var query = "SELECT animals.id, animals.name FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id_cage + " AND animals.id=" +id_animal;
	var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

	//Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	//Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	//Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("animals.id, animals.name", req.query["fields"]);
	}

	//Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}


	db.query(query, function(err, result, fields) 
	{
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});



// POST / CREATE data in the cages table
app.post('/cages', function(req, res) 
{
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	var query = "INSERT INTO cages (name, description, area) VALUES ('"+name+"', '"+description+"', '"+area+"')";
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});




// UPDATE / PUT the cages table by the id of the cage
app.put('/cages/:id', function(req, res) 
{
	var count = 0;
	var id = req.params.id;
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	var conditions = ["name", "description", "area"];

	var query = "UPDATE cages SET ";

	for (var index in conditions) 
	{
		if (conditions[index] in req.body)
		{
			if(count>0){query+= " , ";}	
			query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";
			count++;
		}
	}

	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});



// DELETE the cages table
app.delete('/cages', function(req, res) 
{
	var query = "DELETE FROM cages";
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});



// DELETE one cage by its id
app.delete('/cages/:id', function(req, res) 
{
	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id=" + id;
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});













// GET / READ the food table with with optional filters
app.get('/food', function(req, res) 
{
	var query = "SELECT * FROM food";
	var conditions = ["name", "quantity", "id_animal"];

	// Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	// Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	// Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("*", req.query["fields"]);
	}

	// Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}


	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


// GET one food by its id with optional filters
app.get('/food/:id', function(req, res) 
{
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id=" + id;
	var conditions = ["name", "quantity", "id_animal"];

	// Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	// Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	// Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("*", req.query["fields"]);
	}

	// Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

// GET / READ the animal(s) eating one food by the id of the food 
// (Foreign Key Relationship) with optional filters
app.get('/food/:id/animals', function(req, res) 
{
	var id = req.params.id;
	var query = "SELECT animals.id, animals.name FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id=" + id;
	var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

	//Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	// Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	// Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("animals.id, animals.name", req.query["fields"]);
	}

	// Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}



	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

// GET / READ one animal eating one food by the id of the animal and of the food, if he eats it 
// (Foreign Key Relationship) with optional filters
app.get('/food/:id_food/animals/:id_animal', function(req, res) 
{
	var id_animal = req.params.id_animal;
	var id_food = req.params.id_food;
	var query = "SELECT animals.id, animals.name FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id=" + id_food + " AND animals.id=" +id_animal;
	var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

	// Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	// Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	// Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("animals.id, animals.name", req.query["fields"]);
	}

	// Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}

	db.query(query, function(err, result, fields) 
	{
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});



// POST / CREATE data in the food table
app.post('/food', function(req, res) 
{
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;
	var query = "INSERT INTO food (name, quantity, id_animal) VALUES ('"+name+"', '"+quantity+"', '"+id_animal+"')";
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});



// UPDATE / PUT food table by the id of the food
app.put('/food/:id', function(req, res) 
{
	var count = 0;
	var id = req.params.id;
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;
	var conditions = ["name", "quantity", "id_animal"];

	var query = "UPDATE food SET ";


	for (var index in conditions) 
	{
		if (conditions[index] in req.body)
		{
			if(count>0){query+= " , ";}
			query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";
			count++;
		}
	}
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});



// DELETE the food table
app.delete('/food', function(req, res) 
{
	var query = "DELETE FROM food";
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


// DELETE one food by its id
app.delete('/food/:id', function(req, res) 
{
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id=" + id;
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});









// GET food statistics
app.get('/food-stats', function(req, res) 
{

	var query = "SELECT id_animal AS id, IFNULL(food.quantity / animals.food_per_day,0) AS days_left FROM animals JOIN food ON animals.id = food.id_animal ";

	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
















// GET staff table with optional filters
app.get('/staff', function(req, res) 
{
	var query = "SELECT * FROM staff";
	var conditions = ["firstname", "lastname", "wage"];

	// Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	// Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	// Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("*", req.query["fields"]);
	}

	// Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}


	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


// GET one member of the staff by its id with optional filters
app.get('/staff/:id', function(req, res) 
{
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id=" + id;
	var conditions = ["firstname", "lastname", "wage"];

	// Selection
	for (var index in conditions) 
	{
		if (conditions[index] in req.query) 
		{
			if (query.indexOf("WHERE") < 0) 
			{
				query += " WHERE";
			} 
			else 
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	// Sorting
	if ("sort" in req.query) 
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) 
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	// Filtering
	if ("fields" in req.query) 
	{
		query = query.replace("*", req.query["fields"]);
	}

	// Pagination
	if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
	}

	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});



// POST / CREATE data in the staff table
app.post('/staff', function(req, res) 
{
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('"+firstname+"', '"+lastname+"', '"+wage+"')";
	

	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});



// UPDATE / PUT the staff table by the id of the member
app.put('/staff/:id', function(req, res) 
{
	var count = 0;
	var id = req.params.id;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var conditions = ["firstname", "lastname", "wage"];


	var query = "UPDATE staff SET ";

	for (var index in conditions) 
	{
		if (conditions[index] in req.body)
		{
			if(count>0){query+= " , ";}
			query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";
			count++;
		}
	}
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});





// DELETE the staff table
app.delete('/staff', function(req, res) 
{
	var query = "DELETE FROM staff";
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


// DELETE one member of the staff by its id
app.delete('/staff/:id', function(req, res) 
{
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id=" + id;
	db.query(query, function(err, result, fields) 
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});





// Listen to JSON response
app.listen(3000, function() 
{
	db.connect(function(err) 
	{
		if (err) throw err;
		console.log('Connection to database successful!');
	});
	console.log('Example app listening on port 3000!');
});
