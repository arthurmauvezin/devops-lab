const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
app.get('/', function(req, res) {
	res.send('Welcome to the zoo!');
});
app.listen(3000, function() {
	console.log('App listening on port 3000!');
});

app.use(bodyParser.urlencoded({ extended: true }));
var db = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database: "zoo"
});

//---------------------------------------------------FireWall---------------------------------------

app.use(function(req, res, next) {
	if ("key" in req.query) {
		var key = req.query["key"];
		var query = "SELECT * FROM users WHERE apikey='" + key + "'";
		//console.log(query);
		db.query(query, function(err, result, fields) {
			if (err) throw err;
			if (result.length > 0)
				next();
			else 
				res.status(403).send("Access denied, bad key");
		});
	}
	else
		res.status(403).send("Access denied, no key");
});

//---------------------------------------------------Animal----------------------------------------
//CREATE 1 ANIMAL
app.post('/animals', function(req, res) {
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage= req.body.id_cage;
	var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES  ('"+ name +"', '"+ breed +"', '"+ food_per_day +"', '"+ birthday +"', '"+ entry_date +"', '"+ id_cage +"')";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(name +" added in the zoo"));
	});
});
//READ ALL ANIMALS
app.get('/animals', function(req, res){
	var query = "SELECT * FROM animals"

//FILTER CONDITIONS
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

//FILTER ORDRE
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

//FILTER PAGINATION
	if ("limit" in req.query) {
	query += " LIMIT " + req.query["limit"];
	if ("offset" in req.query) {
	query += " OFFSET " + req.query["offset"];
	}
	}

//FILTER CHAMPS
	if ("fields" in req.query) {
	query = query.replace("*", req.query["fields"]);
	}


		db.query(query, function(err, result, fields) {
			if (err) throw err;
			res.send(JSON.stringify(result));
		});
	});


//READ 1 ANIMAL WITH AN ID
app.get('/animals/:id(\\d+)', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id="+ id;

//FILTER CONDITIONS
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

//FILTER ORDRE
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

//FILTER PAGINATION
	if ("limit" in req.query) {
	query += " LIMIT " + req.query["limit"];
	if ("offset" in req.query) {
	query += " OFFSET " + req.query["offset"];
	}
	}

//FILTER CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}


	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//UPDATE 1 ANIMAL WITH AN ID
app.put('/animals/:id(\\d+)', function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var cond = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    var query = "UPDATE animals SET";
    for (var index in cond)  
    	if (cond[index] in req.body)
            query += " " + cond[index] + " = '" + req.body[cond[index]] + "',";
    //delete "," at the end of the query
    query = query.slice(0,-1);
    query += " WHERE id=" + id;
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("Animal '"+ id +"' informations succesfully updated"));
    });
});
//DELETE 1 ANIMAL
app.delete('/animals/:id(\\d+)', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Animal '"+ id +"' succesfully removed from the zoo"));
	});
});

//DELETE ALL ANIMALS
app.delete('/animals', function(req, res) {
	var query = "DELETE FROM animals";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("All animals succesfully removed from the zoo"));
	});
});


//---------------------------------------------------Cages----------------------------------------
//CREATE A CAGE
app.post('/cages', function(req, res) {
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	var query = "INSERT INTO cages (name, description, area) VALUES ('"+ name +"', '"+ description +"','"+ area +"')";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Cage '"+ name +"' has been added to the zoo!"));
	});
});
//GET ALL DATA OF ALL CAGES
app.get('/cages', function(req, res) {
	var query = "SELECT * FROM cages";

//FILTER CONDITION
	var conditions = ["id", "name", "description", "area"];
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

//FILTER ORDER
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

//FILTER CHAMPS
	if ("fields" in req.query) {
	query = query.replace("*", req.query["fields"]);
	}

//FILTER PAGINATION
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
//GET 1 DATA OF 1 CAGE
app.get('/cages/:id(\\d+)', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id="+ id;

//FILTER CONDITION
	var conditions = ["id", "name", "description", "area"];
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

//FILTER ORDER
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

//FILTER CHAMPS
	if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}

//FILTER PAGINATION
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
//UPDATE 1 CAGE WITH AN ID
app.put('/cages/:id(\\d+)', function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var cond = ["id", "name", "description", "area"];
    var query = "UPDATE cages SET";
    for (var index in cond)  
    	if (cond[index] in req.body)
            query += " " + cond[index] + " = '" + req.body[cond[index]] + "',";
    //delete "," at the end of the query
    query = query.slice(0,-1);
    query += " WHERE id=" + id;
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("Cage '"+ id +"' informations succesfully updated"));
    });
});
//DELETE ALL CAGES
app.delete('/cages', function(req, res) {
	var query = "DELETE FROM cages";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("All cages were succesfully removed from the zoo"));
	});
});
//DELETE 1 CAGE
app.delete('/cages/:id(\\d+)', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Cage successfully deleted"));
	});
});

//---------------------------------------------------Food----------------------------------------
//CREATE A FOOD
app.post('/food', function(req, res) {
	var name = req.body.name;
	var id_animal = req.body.id_animal;
	var quantity = req.body.quantity;
	var query = "INSERT INTO food (name, id_animal, quantity) VALUES ('"+ name +"', '"+ id_animal +"','"+ quantity +"')";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(name +"'has been added!"));
	});
});
//READ ALL FOOD
app.get('/food', function(req, res) {
	var query = "SELECT * FROM food";

//FILTER CONDITION
	var conditions = ["id", "name", "quantity", "id_animal"];
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

//FILTER ORDER

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

//FILTER CHAMPS

	if ("fields" in req.query) {
	query = query.replace("*", req.query["fields"]);
	}

//FILTER PAGINATION
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
//READ 1 FOOD WITH AN ID
app.get('/food/:id(\\d+)', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id="+ id;

//FILTER CONDITION
	var conditions = ["id", "name", "quantity", "id_animal"];
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

//FILTER ORDER
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

//FILTER CHAMPS
	if ("fields" in req.query) {
	query = query.replace("*", req.query["fields"]);
	}

	//FILTER PAGINATION
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
//UPDATE ALL DATA OF 1 FOOD WITH AN ID
app.put('/food/:id(\\d+)', function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var cond = ["id", "name", "id_animal", "quantity"];
    var query = "UPDATE food SET";
    for (var index in cond)  
    	if (cond[index] in req.body)
            query += " " + cond[index] + " = '" + req.body[cond[index]] + "',";
    //delete "," at the end of the query
    query = query.slice(0,-1);
    query += " WHERE id=" + id;
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("Cage '"+ name +"' succesfully updated"));
    });
});
//DELETE ALL FOOD
app.delete('/food', function(req, res) {
	var query = "DELETE FROM food";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("All food succesfully removed from the zoo."));
	});
});

//DELETE 1 FOOD WITH AN ID
app.delete('/food/:id(\\d+)', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("food '"+ id +"' succesfully removed from the zoo."));
	});
});


//---------------------------------------------------Staff----------------------------------------
//CREATE STAFF
app.post('/staff', function(req, res) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('" + firstname + "', '"+ lastname +"','"+ wage +"')";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(firstname +" successfully added to the zoo!"));
	});
});

//READ ALL STAFF
app.get('/staff', function(req, res) {
	var query = "SELECT * FROM staff"


//FILTER CONDITION
	var conditions = ["id", "firstname", "lastname", "wage"];
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

//FILTER ORDRE
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

//FILTER CHAMPS
	if ("fields" in req.query) {
	query = query.replace("*", req.query["fields"]);
	}

	//FILTER PAGINATION
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

//READ 1 STAFF WITH AN ID
app.get('/staff/:id(\\d+)', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id="+ id;

//FILTER CONDITION
	var conditions = ["id", "firstname", "lastname", "wage"];
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

//FILTER ORDRE
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

//FILTER CHAMPS
	if ("fields" in req.query) {
	query = query.replace("*", req.query["fields"]);
	}

//FILTER PAGINATION
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
// UPDATE STAFF WITH AN ID
app.put('/staff/:id(\\d+)', function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var cond = ["id", "firstname", "lastname", "wage"];
    var query = "UPDATE staff SET";
    for (var index in cond)  
    	if (cond[index] in req.body)
            query += " " + cond[index] + " = '" + req.body[cond[index]] + "',";
    //delete "," at the end of the query
    query = query.slice(0,-1);
    query += " WHERE id=" + id;
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("Cage '"+ id +"' succesfully updated"));
    });
});
//DELETE ALL STAFF
app.delete('/staff', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM staff";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("All staff succesfully deleted"));
	});
});
//DELETE 1 STAFF WITH AN ID
app.delete('/staff/:id(\\d+)', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


//---------------------------------------------------Foodstat----------------------------------------
function idDays(id, days_left){
    this.id = id;
	this.days_left = days_left;
}
//READ FOOD STATS
app.get('/food-stats', function (req, res) {
	var query = "SELECT animals.id as id, food_per_day, quantity FROM animals INNER JOIN food ON animals.id = food.id_animal";
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		var idDaysArray = new Array();
		for(var match in result) {
			var dailyFood = result[match].food_per_day;
			if( dailyFood == 0 ) {
				idDaysArray.push(new idDays(result[match].id, 0));
			}
			else {
				idDaysArray.push(new idDays(result[match].id, result[match].quantity/dailyFood));
			}
		}	
		res.send(JSON.stringify(idDaysArray));
	});
});

//---------------------------------------------------RELATIONS----------------------------------------
//Relation Animals/Cages

//Relation "cages" in "animals"
app.get('/animals/:id(\\d+)/cages', function(req, res) {
	var id = req.params.id;
	var query = "SELECT cages.id, cages.name, cages.area, cages.description FROM cages INNER JOIN animals ON animals.id_cage = cages.id WHERE animals.id=" + id;

//FILTER CONDITION
	var conditions = ["id", "name", "description", "area"];
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

//FILTER CHAMPS
	if ("fields" in req.query) {
	query = query.replace("cages.id, cages.name, cages.area, cages.description", req.query["fields"]);
	}

//FILTER PAGINATION
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

app.get('/animals/:id_animal(\\d+)/cages/:id_cage(\\d+)', function(req, res) {
	var id_animal = req.params.id_animal;
	var id_cage = req.params.id_cage;
	var query = "SELECT cages.id, cages.name, cages.area, cages.description FROM cages INNER JOIN animals ON animals.id_cage = cages.id WHERE animals.id=" + id_animal + " AND cages.id=" +id_cage;

//FILTER CONDITION
	var conditions = ["id", "name", "description", "area"];
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

//FILTER CHAMPS
	if ("fields" in req.query) {
	query = query.replace("cages.id, cages.name, cages.area, cages.description", req.query["fields"]);
	}

//FILTER PAGINATION
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

//Relation "animals" in "cages"

app.get('/cages/:id(\\d+)/animals', function(req, res) {
	var id = req.params.id;
	var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id=" + id;

//FILTER CONDITIONS
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

//FILTER CHAMPS
	if ("fields" in req.query) {
	query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", req.query["fields"]);
	}

//FILTER PAGINATION
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


//Relation Food/Animals
//Relation "animals" in "food"

app.get('/food/:id(\\d+)/animals', function(req, res) {
	var id = req.params.id;
	var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE food.id=" + id;

//FILTER CONDITIONS
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

//FILTER CHAMPS
if ("fields" in req.query) {
query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", req.query["fields"]);
}

//FILTER PAGINATION
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

app.get('/food/:id_food(\\d+)/animals/:id_animal(\\d+)', function(req, res) {
	var id_animal = req.params.id_animal;
	var id_food = req.params.id_food;
	var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE food.id=" + id_food + " AND animals.id=" +id_animal;



//FILTER CHAMPS
if ("fields" in req.query) {
query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", req.query["fields"]);
}

//FILTER PAGINATION
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


//Relation "food" in "animals"

app.get('/animals/:id(\\d+)/food', function(req, res) {
	var id = req.params.id;
	var query = "SELECT food.id, food.name, food.quantity, food.id_animal FROM food INNER JOIN animals ON animals.id = food.id_animal WHERE animals.id=" + id;

//FILTER CONDITION
	var conditions = ["id", "name", "quantity", "id_animal"];
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

//FILTER CHAMPS
	if ("fields" in req.query) {
	query = query.replace("food.id, food.name, food.quantity, food.id_animal", req.query["fields"]);
	}

//FILTER PAGINATION
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

app.get('/animals/:id_animal(\\d+)/food/:id_food(\\d+)', function(req, res) {
	var id_animal = req.params.id_animal;
	var id_food = req.params.id_food;
	var query = "SELECT food.id, food.name, food.quantity, food.id_animal FROM food INNER JOIN animals ON animals.id = food.id_animal WHERE animals.id=" + id_animal + " AND food.id=" +id_food;

//FILTER CONDITION
	var conditions = ["id", "name", "quantity", "id_animal"];
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

//FILTER CHAMPS
	if ("fields" in req.query) {
	query = query.replace("food.id, food.name, food.quantity, food.id_animal", req.query["fields"]);
	}

//FILTER PAGINATION
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


