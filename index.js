const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({
host: process.env.MYSQL_HOST,
user: process.env.MYSQL_LOGIN,
password: process.env.MYSQL_PASSWORD,
database: process.env.MYSQL_DATABASE,
port: process.env.MYSQL_PORT
});

//FIREWALL
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
				res.send("ERROR",403);
			}
		});
	} else {
		res.send("ERROR",403);
	}
});



//animal
app.post('/animals', function(req, res) {
	var name = req.body.name;
	var breed = req.body.breed;
	var food = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry = req.body.entry_date;
	var id_cage = req.body.id_cage;

	var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('"+name+"','"+breed+"',"+food+",'"+birthday+"','"+entry+"',"+id_cage+")";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("success"));
	});
});

app.get('/animals', function(req, res) {

	var query = "SELECT * FROM animals";

	  //SELECTION
	var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

    //SORTING
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

	//FILTERS
	if ("fields" in req.query) {

		query = query.replace("*", req.query["fields"]);
	}

	//PAGINATION
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

app.get('/animals/:id', function(req, res) {

	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id="+ id;

	//SORTING
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

	//FILTERS
	if ("fields" in req.query) {

		query = query.replace("*", req.query["fields"]);
	}

	//PAGINATION
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

app.put('/animals/:id', function(req, res) {

	var id = req.params.id;
	var name = req.body.name;
	var breed = req.body.breed;
	var food = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry = req.body.entry_date;
	var id_cage = req.body.id_cage;

	var query = "UPDATE animals SET ";

	if(name != undefined) query += " name = '"+name+"',";
	if(breed != undefined) query += " breed = '"+breed+"',";
	if(food != undefined) query += " food_per_day = '"+food+"',";
	if(birthday != undefined) query += " birthday = '"+birthday+"',";
	if(entry != undefined) query += " entry_date = '"+entry+"',";
	if(id_cage != undefined) query += " id_cage = '"+id_cage+"',";

	query = query.slice(0,-1);

	query += " WHERE id = "+id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});

app.delete('/animals', function(req, res) {
	var query = "DELETE FROM animals"
	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});

app.delete('/animals/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id = " + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});





//cages
app.post('/cages', function(req, res) {
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	
	var query = "INSERT INTO cages (name,description,area) VALUES ('"+name+"','"+description+"',"+area+")";
	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("success"));
	});
});

app.get('/cages', function(req, res) {

	var query = "SELECT * FROM cages";

    //SELECTION
	var conditions = ["name", "description","area"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

    //SORTING
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

	//FILTERS
	if ("fields" in req.query) {

		query = query.replace("*", req.query["fields"]);
	}

	//PAGINATION
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

app.get('/cages/:id', function(req, res) {

	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;

	//SORTING
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

	//FILTERS
	if ("fields" in req.query) {

		query = query.replace("*", req.query["fields"]);
	}

	//PAGINATION
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

app.put('/cages/:id', function(req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;

	var query = "UPDATE cages SET ";

	if(name != undefined) query += " name = '"+name+"',";
	if(description != undefined) query += " description = '"+description+"',";
	if(area != undefined) query += " area = '"+area+"',";

	query = query.slice(0,-1);

	query += " WHERE id = "+id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});

app.delete('/cages', function(req, res) {
	var query = "DELETE FROM cages"
	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});

app.delete('/cages/:id', function(req, res) {

	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id = " + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});






//food
app.post('/food', function(req, res) {
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;
	
	var query = "INSERT INTO food (name,quantity,id_animal) VALUES ('"+name+"',"+quantity+","+id_animal+")";
	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("success"));
	});
});

app.get('/food', function(req, res) {


	var query = "SELECT * FROM food";

	  //SELECTION
	var conditions = ["name", "quantity","id_animal"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

    //SORTING
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

	//FILTERS
	if ("fields" in req.query) {

		query = query.replace("*", req.query["fields"]);
	}

	//PAGINATION
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

app.get('/food/:id', function(req, res) {

	var id = req.params.id;

	var query = "SELECT * FROM food WHERE id=" + id;

	//SORTING
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

	//FILTERS
	if ("fields" in req.query) {

		query = query.replace("*", req.query["fields"]);
	}

	//PAGINATION
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

app.put('/food/:id', function(req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;

	var query = "UPDATE food SET ";

	if(name != undefined) query += " name = '"+name+"',";
	if(quantity != undefined) query += " quantity = '"+quantity+"',";
	if(id_animal != undefined) query += " id_animal = '"+id_animal+"',";

	query = query.slice(0,-1);

	query += " WHERE id = "+id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});

app.delete('/food', function(req, res) {
	var query = "DELETE FROM food"
	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});

app.delete('/food/:id', function(req, res) {

	var id = req.params.id;
	var query = "DELETE FROM food WHERE id = " + id;

	db.query(query, function(err, result, fields) {

		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});




//staff
app.post('/staff', function(req, res) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	
	var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('"+firstname+"','"+lastname+"',"+wage+")";
	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify("success"));
	});
});

app.get('/staff', function(req, res) {

	var query = "SELECT * FROM staff";

	  //SELECTION
	var conditions = ["firstname", "lastname","wage"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

    //SORTING
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

	//FILTERS
	if ("fields" in req.query) {

		query = query.replace("*", req.query["fields"]);
	}

	//PAGINATION
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

app.get('/staff/:id', function(req, res) {

	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id=" + id;

	//SORTING
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

	//FILTERS
	if ("fields" in req.query) {

		query = query.replace("*", req.query["fields"]);
	}

	//PAGINATION
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

app.put('/staff/:id', function(req, res) {
	var id = req.params.id;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;

	var query = "UPDATE staff SET ";

	if(firstname != undefined) query += " firstname = '"+firstname+"',";
	if(lastname != undefined) query += " lastname = '"+lastname+"',";
	if(wage != undefined) query += " wage = '"+wage+"',";

	query = query.slice(0,-1);

	query += " WHERE id = "+id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});

app.delete('/staff', function(req, res) {
	var query = "DELETE FROM staff"
	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});

app.delete('/staff/:id', function(req, res) {

	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id = " + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

//read food-stat

app.get('/food-stats', function(req, res) {

	var query ="SELECT animals.id, CASE WHEN animals.food_per_day = 0 THEN 0 ELSE food.quantity/animals.food_per_day END as days_left FROM food INNER JOIN animals ON food.id_animal = animals.id";
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});




//relationships

//cages in animal

app.get('/animals/:id/cages', function(req, res) {
	var id = req.params.id;

	var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id =" + id;

	//SELECTION
	var conditions = ["id","name", "description","area"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " cages." + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}


	//FILTERS
	if ("fields" in req.query) {

		query = query.replace("*", req.query["fields"]);
	}

	//PAGINATION
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

app.get('/animals/:id_animals/cages/:id_cage', function(req, res) {

	var id_animals = req.params.id_animals;
	var id_cage = req.params.id_cage;

	var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animals + " AND cages.id=" + id_cage;

	//SELECTION
	var conditions = ["id","name", "description","area"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " cages." + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}


	//FILTERS
	if ("fields" in req.query) {

		query = query.replace("*", req.query["fields"]);
	}

	//PAGINATION
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

//animal in cages

app.get('/cages/:id/animals', function(req, res) {
	var id = req.params.id;

	var query = "SELECT animals.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id =" + id;

	//SELECTION
	var conditions = ["id","name", "breed","food_per_day","birthday","entry_date","id_cage"];

	for (var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " animals." + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}


	//FILTERS
	if ("fields" in req.query) {

		query = query.replace("*", req.query["fields"]);
	}

	//PAGINATION
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


//food in animal

app.get('/animals/:id/food', function(req, res) {
	var id = req.params.id;

	var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;

	//SELECTION
	var conditions = ["id","name", "quantity","id_animal"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}


	//FILTERS
	if ("fields" in req.query) {

		query = query.replace("*", req.query["fields"]);
	}

	//PAGINATION
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

//animal in food

app.get('/food/:id/animals', function(req, res) {
	var id = req.params.id;

	var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id=" + id;

	//SELECTION
	var conditions = ["id","name", "breed","food_per_day","birthday","entry_date","id_cage"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}


	//FILTERS
	if ("fields" in req.query) {

		query = query.replace("*", req.query["fields"]);
	}

	//PAGINATION
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

app.get('/food/:id_food/animals/:id_animals', function(req, res) {

	var id_animals = req.params.id_animals;
	var id_food = req.params.id_food;

	var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id=" + id_food + " AND animals.id=" + id_animals;

	//SELECTION
	var conditions = ["id","name", "breed","food_per_day","birthday","entry_date","id_cage"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf("WHERE") < 0) {
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}


	//FILTERS
	if ("fields" in req.query) {

		query = query.replace("*", req.query["fields"]);
	}

	//PAGINATION
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



app.listen(3000, function() {
	db.connect(function(err) {
		if (err) throw err;
		console.log('Connection to database successful!');
	});
	console.log('Example app listening on port 3000!');
});

