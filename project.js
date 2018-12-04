const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "zoo",
	port: "3306"
});


app.use(function(req, res, next) {
	if ("key" in req.query) { // if there is a key in the request we try to find it in the table if there is no key or the key is not in the table we send the error 403
		var key = req.query["key"]; 
		var query = "SELECT * FROM users WHERE apikey='" + key + "'";
		db.query(query, function(err, result, fields) {
			if (err) throw err;
			if (result.length > 0) {
				next();
			}
			else {
				res.status(403).send("access denied").end();
			}
		});
	} else {
		res.status(403).send("access denied").end();
	}
});




//animal
app.get('/animals', function(req, res) {
	var query = "SELECT * FROM animals";
	var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
	for (var index in conditions) { //for each conditions
		if (conditions[index] in req.query) { //if the column condition[index] exist in the req
			if (query.indexOf("WHERE") < 0) { //if there already is a where add a AND else add a WHERE 
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " " + conditions[index] + "='" + //add the condition exemple name = 'rex'
			req.query[conditions[index]] + "'";
		}
	}

	if ("sort" in req.query) { //if the app request the answer to be sorted
		var sort = req.query["sort"].split(",");  //
		query += " ORDER BY";     //add the ORDER BY to the query
		for (var index in sort) {   //for each field requested to be sorted by
			var direction = sort[index].substr(0, 1); 
			var field = sort[index].substr(1);
			query += " " + field;   
			if (direction == "-")   //add the ASC or DSC depending on the sign
				query += " DESC,";
			else
				query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	if ("fields" in req.query) { //if the app request certain fields
		query = query.replace("*", req.query["fields"]); //we replace the * in the query by the fields
	}

	if ("limit" in req.query) {  //if the app request a limit 
		query += " LIMIT " + req.query["limit"];  //we add the LIMIT to the quey
		if ("offset" in req.query) {  //if there is also an OFFSET
			query += " OFFSET " + req.query["offset"]; //add the offset
		}
	}

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.get('/animals/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id=" + id;



	var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
	for (var index in conditions) { //for each conditions
		if (conditions[index] in req.query) { //if the column condition[index] exist in the req
			if (query.indexOf("WHERE") < 0) { //if there already is a where add a AND else add a WHERE 
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " " + conditions[index] + "='" + //add the condition exemple name = 'rex'
			req.query[conditions[index]] + "'";
		}
	}

	

	if ("fields" in req.query) { //if the app request certain fields
		query = query.replace("*", req.query["fields"]); //we replace the * in the query by the fields
	}

	db.query(query, function(err, result, fields) {
		if (err) throw err+query;
		res.send(JSON.stringify(result));
	});
});


app.get('/animals/:id/cages', function(req, res) { //the app request the cage corresponding to the animal id selected
	var id = req.params.id;
	var query = "SELECT cages.id FROM animals  JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;

	var conditions = ["name", "description","area"];
	for (var index in conditions) { //for each conditions
		if (conditions[index] in req.query) { //if the column condition[index] exist in the req
			if (query.indexOf("WHERE") < 0) { //if there already is a where add a AND else add a WHERE 
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " " + conditions[index] + "='" + //add the condition exemple name = 'rex'
			req.query[conditions[index]] + "'";
		}
	}

	if ("sort" in req.query) { //if the app request the answer to be sorted
		var sort = req.query["sort"].split(",");  //
		query += " ORDER BY";     //add the ORDER BY to the query
		for (var index in sort) {   //for each field requested to be sorted by
			var direction = sort[index].substr(0, 1); 
			var field = sort[index].substr(1);
			query += " " + field;   
			if (direction == "-")   //add the ASC or DSC depending on the sign
				query += " DESC,";
			else
				query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	if ("fields" in req.query) { //if the app request certain fields
		query = query.replace("cages.id", req.query["fields"]); //we replace the * in the query by the fields
	}

		if ("limit" in req.query) {  //if the app request a limit 
		query += " LIMIT " + req.query["limit"];  //we add the LIMIT to the quey
		if ("offset" in req.query) {  //if there is also an OFFSET
			query += " OFFSET " + req.query["offset"]; //add the offset
		}
	}

	

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});



app.get('/animals/:id_animal/cages/:id_cage', function(req, res) { //the app request the cage and animal corresponding to the animal id selected and cage id selected if they are related
	var id_animal = req.params.id_animal;
	var id_cage = req.params.id_cage;
	var query = "SELECT cages.id FROM animals JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animal + " AND cages.id=" + id_cage;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});



app.get('/animals/:id/food', function(req, res) { //the app request the food corresponding to the animal id selected
	var id = req.params.id;
	var query = "SELECT food.id FROM animals  JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;

		var conditions = ["name", "id_animal","quantity"];

	for (var index in conditions) { //for each conditions
		if (conditions[index] in req.query) { //if the column condition[index] exist in the req
			if (query.indexOf("WHERE") < 0) { //if there already is a where add a AND else add a WHERE 
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " " + conditions[index] + "='" + //add the condition exemple name = 'rex'
			req.query[conditions[index]] + "'";
		}
	}

		if ("sort" in req.query) { //if the app request the answer to be sorted
		var sort = req.query["sort"].split(",");  //
		query += " ORDER BY";     //add the ORDER BY to the query
		for (var index in sort) {   //for each field requested to be sorted by
			var direction = sort[index].substr(0, 1); 
			var field = sort[index].substr(1);
			query += " " + field;   
			if (direction == "-")   //add the ASC or DSC depending on the sign
				query += " DESC,";
			else
				query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	if ("fields" in req.query) { //if the app request certain fields
		query = query.replace("cage.id", req.query["fields"]); //we replace the * in the query by the fields
	}

		if ("limit" in req.query) {  //if the app request a limit 
		query += " LIMIT " + req.query["limit"];  //we add the LIMIT to the quey
		if ("offset" in req.query) {  //if there is also an OFFSET
			query += " OFFSET " + req.query["offset"]; //add the offset
		}
	}
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


app.get('/animals/:id_animal/food/:id_food', function(req, res) {   //the app request the food and the animal corresponding to the animal id selected and food id selected if they are related
	var id_animal = req.params.id_animal;
	var id_food = req.params.id_food;
	var query = "SELECT food.id FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id_animal + " AND food.id=" +
	id_food;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});



app.post('/animals', function(req, res) { 
	var name = req.body.name; //we get all the variable necessary to create an animal
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;
	var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" +name+"','"+breed+"','"+food_per_day+"','"+birthday+"','"+entry_date+"','"+id_cage + "')";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("success"));
	});
});

app.put('/animals/:id', function(req, res) {
	var id = req.params.id;
	
	var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
	var query="UPDATE animals ";
	 for (var index in conditions) {
        if (conditions[index] in req.body) {
            if (query.indexOf("SET") < 0) {
                query += "SET ";
            } else {
                query += ", ";
            }
            query += " " + conditions[index] + " = '" + req.body[conditions[index]] + "' ";
        }

    }
    query += " WHERE id = '" + id + "'";


	//var query = "UPDATE animals SET name = '" + name + "', breed ='"+breed+"', food_per_day ='"+food_per_day+"', birthday ='"+birthday+"', entry_date ='"+entry_date+"', id_cage ='"+id_cage+"' WHERE id="
	//+ id;
	db.query(query, function(err, result, fields) {
		if (err) throw err+query;
		res.send(JSON.stringify("Success"));
	});
});	




app.delete('/animals', function(req, res) { //delete all animals
	var query = "DELETE FROM animals";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
app.delete('/animals/:id', function(req, res) { //delete the selected animal
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
///cage  work the same as animal
app.get('/cages', function(req, res) {
	var query = "SELECT * FROM cages";

	var conditions = ["name", "description","area"];
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

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
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

app.get('/cages/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;

	var conditions = ["name", "description","area"];
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

	

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	





	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.get('/cages/:id/animals', function(req, res) {
	var id = req.params.id;
	var query = "SELECT animals.id FROM cages  JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id;

	var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
	for (var index in conditions) { //for each conditions
		if (conditions[index] in req.query) { //if the column condition[index] exist in the req
			if (query.indexOf("WHERE") < 0) { //if there already is a where add a AND else add a WHERE 
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " " + conditions[index] + "='" + //add the condition exemple name = 'rex'
			req.query[conditions[index]] + "'";
		}
	}

		if ("sort" in req.query) { //if the app request the answer to be sorted
		var sort = req.query["sort"].split(",");  //
		query += " ORDER BY";     //add the ORDER BY to the query
		for (var index in sort) {   //for each field requested to be sorted by
			var direction = sort[index].substr(0, 1); 
			var field = sort[index].substr(1);
			query += " " + field;   
			if (direction == "-")   //add the ASC or DSC depending on the sign
				query += " DESC,";
			else
				query += " ASC,";
		}
		query = query.slice(0, -1);
	}

	if ("fields" in req.query) { //if the app request certain fields
		query = query.replace("animals.id", req.query["fields"]); //we replace the * in the query by the fields
	}

		if ("limit" in req.query) {  //if the app request a limit 
		query += " LIMIT " + req.query["limit"];  //we add the LIMIT to the quey
		if ("offset" in req.query) {  //if there is also an OFFSET
			query += " OFFSET " + req.query["offset"]; //add the offset
		}
	}



	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.get('/cages/:id_cages/animals/:id_animals', function(req, res) {
	var id_animal = req.params.id_animal;
	var id_cage = req.params.id_cage;
	var query = "SELECT animals.id FROM animals  JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animals + " AND cages.id=" +
	id_cages
	djkbh.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.post('/cages', function(req, res) {
	var name = req.body.name;
	var description = req.body.description;	
	var area = req.body.area;

	var query = "INSERT INTO cages (name,description,area) VALUES ('" +name+"','"+description+"','"+area+"')";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("success"));
	});
});

app.put('/cages/:id', function(req, res) {
	
	var id = req.params.id;
	var conditions = ["name", "description","area"];
	var query="UPDATE cages ";
	 for (var index in conditions) {
        if (conditions[index] in req.body) {
            if (query.indexOf("SET") < 0) {
                query += "SET ";
            } else {
                query += ", ";
            }
            query += " " + conditions[index] + " = '" + req.body[conditions[index]] + "' ";
        }

    }
    query += " WHERE id = '" + id + "'";
	db.query(query, function(err, result, fields) {
		if (err) throw err+query;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/cages', function(req, res) {
	var query = "DELETE FROM cages";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
app.delete('/cages/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//food
app.get('/food', function(req, res) {
	var query = "SELECT * FROM food";

	var conditions = ["name", "id_animal","quantity"];
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

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
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
app.get('/food/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id=" + id;

	var conditions = ["name", "id_animal","quantity"];
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

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}


	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.get('/food/:id/animals', function(req, res) {
	var id = req.params.id;
	var query = "SELECT animals.id FROM food  JOIN animals ON food.id_animal = animals.id WHERE food.id=" + id;



	var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];

	for (var index in conditions) { //for each conditions
		if (conditions[index] in req.query) { //if the column condition[index] exist in the req
			if (query.indexOf("WHERE") < 0) { //if there already is a where add a AND else add a WHERE 
				query += " WHERE";
			} else {
				query += " AND";
			}
			query += " " + conditions[index] + "='" + //add the condition exemple name = 'rex'
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

	if ("fields" in req.query) {
		query = query.replace("animals.id", req.query["fields"]);
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

app.get('/food/:id_food/animals/:id_animal', function(req, res) {
	var id_animal = req.params.id_animal;
	var id_food = req.params.id_food;
	var query = "SELECT animals.id FROM animals JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id_animal + " AND food.id=" +
	id_food;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.post('/food', function(req, res) {
	var name = req.body.name;
	var id_animal = req.body.id_animal;
	var quantity = req.body.quantity;

	var query = "INSERT INTO food (name,id_animal,quantity) VALUES ('" +name+"','"+id_animal+"','"+quantity+"')";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("success"));
	});
});

app.put('/food/:id', function(req, res) {
	
	var id = req.params.id;
	var conditions = ["name", "id_animal","quantity"];
	var query="UPDATE food ";
	 for (var index in conditions) {
        if (conditions[index] in req.body) {
            if (query.indexOf("SET") < 0) {
                query += "SET ";
            } else {
                query += ", ";
            }
            query += " " + conditions[index] + " = '" + req.body[conditions[index]] + "' ";
        }

    }
    query += " WHERE id = '" + id + "'";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/food', function(req, res) {
	var query = "DELETE FROM food";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
app.delete('/food/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//Staff

app.get('/staff', function(req, res) {
	var query = "SELECT * FROM staff";

	var conditions = ["firstname", "lastname","wage"];
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

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
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
app.get('/staff/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id=" + id;

	var conditions = ["firstname", "lastname","wage"];
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

	var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('" +firstname+"','"+lastname+"','"+wage+"')";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("success"));
	});
});

app.put('/staff/:id', function(req, res) {

	var id = req.params.id;
	var conditions = ["firstname", "lastname","wage"];
	var query="UPDATE staff ";
	 for (var index in conditions) {
        if (conditions[index] in req.body) {
            if (query.indexOf("SET") < 0) {
                query += "SET ";
            } else {
                query += ", ";
            }
            query += " " + conditions[index] + " = '" + req.body[conditions[index]] + "' ";
        }

    }
    query += " WHERE id = '" + id + "'";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/staff', function(req, res) {
	var query = "DELETE FROM staff";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
app.delete('/staff/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.get('/food-stats', function(req, res) {
	//for each animal that as a food linked to it we need the id and the number of days of food there is left for him
	// we add a case to avoid dividing by 0
	var query = "SELECT a.id as id, CASE WHEN a.food_per_day=0 THEN 0 ELSE f.quantity/a.food_per_day END as days_left FROM food f INNER JOIN animals a ON f.id_animal=a.id";
	
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

