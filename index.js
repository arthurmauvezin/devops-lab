/*

BRAUN Pierre-Louis
MOLINER Victor
ING4 SI TD03

Project Web - 2018/2019



*/

///****************connect to database**************
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
var db = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database: "zoo"
});


///FIREWALL
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
			res.status(403).send("Access denied").end();
		}
		});
	} else {
		res.status(403).send("Access denied").end();
	}
});

///HOME
app.get( '/' , function (req, res) {
	var response = { "page" : "home" };
	res.send( JSON .stringify(response));
});


///********************ANIMALS********************************************
//*********************INSERT
app.post('/animals/', function(req, res) {
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;

	var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" + name + "','" + breed + "','" + food_per_day + "','" + birthday + "','" + entry_date + "','" + id_cage + "')";
	db.query(query, function(err, result, fields) {	
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//**********************FILTERS
app.get('/query', function(req, res) {
	res.send(JSON.stringify(req.query));
});

//*************read data relation ANIMAL/FOOD 
app.get('/animals/:id/food', function(req, res) {
	var id = req.params.id;
	var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;

	//filter conditions
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

	//filter sort
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

	//filter fields
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//filter limit
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

//***************read data relation ANIMAL/CAGES
app.get('/animals/:id_animal/cages', function(req, res) {
	var id_animal = req.params.id_animal;
	var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animal;

	//filter conditions
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

	//filter sort
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

	//filter field
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//filter limit
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


//******************** read one data relation ANIMAL/CAGES
app.get('/animals/:id_animal/cages/:id_cage', function(req, res) {
	var id_animal = req.params.id_animal;
	var id_cage = req.params.id_cage;
	var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animal + " AND cages.id=" + id_cage;
	//champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//*********** read data with filters
app.get('/animals', function(req, res) {
	var query = "SELECT * FROM animals"
	//conditions
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

	//sort
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

	//champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//pagination
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

//*********** read one data with filters
app.get('/animals/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM animals ";

	//champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	 
	 query = query + " WHERE id=" + id;
	 
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//***************** DELETE
//delete all
app.delete('/animals', function(req, res) {
	var query = "DELETE FROM animals";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
//delete one
app.delete('/animals/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//********************UPDATE
app.put('/animals/:id', function(req, res) {
	var id = req.params.id;
		var name = req.body.name;
		var breed= req.body.breed;
		var food_per_day= req.body.food_per_day;
		var birthday= req.body.birthday;
		var entry_date= req.body.entry_date;
		var id_cage= req.body.id_cage;
	var params = 0;

	var query = "UPDATE animals SET ";

	if(name)
	{
		if(params!=0)
		{
			 query = query + ",";
		}
	 query = query + " name = '" + name + "'";
	 params=params+1;
	}
		
	if(breed)
	{
		if(params!=0)
		{
			 query = query + ",";
		}
	 query = query + " breed = '" + breed + "' ";
	 params=params+1;
	}

	if(food_per_day)
	{
		if(params!=0)
		{
			 query = query + ",";
		}
	 query = query + " food_per_day = '" + food_per_day + "' ";
	 params=params+1;
	}
	if(birthday)
	{
		if(params!=0)
		{
			 query = query + ",";
		}
	 query = query + " birthday = '" + birthday + "' ";
	 params=params+1;
	}
	if(entry_date)
	{
		if(params!=0)
		{
			 query = query + ",";
		}
	 query = query + " entry_date = '" + entry_date + "' ";
	 params=params+1;
	}
	if(id_cage)
	{
		if(params!=0)
		{
			 query = query + ",";
		}
	 query = query + " id_cage = '" + id_cage + "' ";
	 params=params+1;
	}

	query = query + " WHERE id=" + id;
	 

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});







///********************************** CAGES******************************************************
//**********INSERT
app.post('/cages', function(req, res) {
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	var query = "INSERT INTO cages (name, description,area) VALUES ('" + name + "','" + description + "'," + area + ")";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//************ read data relation ANIMAL/CAGES
app.get('/cages/:id/animals', function(req, res) {
	var id = req.params.id;
	var query = "SELECT animals.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id=" + id;

	//filter conditions
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

	//filter sort
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

	//filter fields
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//filter limit
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

//************ read data filters
app.get('/cages', function(req, res) {
	var query = "SELECT * FROM cages"
	
	//conditions
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

	//sort
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

	//champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//pagination
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

//************ read one data
app.get('/cages/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages ";

	//champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	 
	 query = query + " WHERE id=" + id;
	 
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//************ UPDATE 
app.put('/cages/:id', function(req, res) {
	var id = req.params.id;
		var name = req.body.name;
		var description= req.body.description;
		var area= req.body.area;
	var params = 0;

	var query = "UPDATE cages SET ";

	if(name)
	{
		if(params!=0)
		{
			 query = query + ",";
		}
	 query = query + " name = '" + name + "'";
	 params=params+1;
	}
		
	if(description)
	{
		if(params!=0)
		{
			 query = query + ",";
		}
	 query = query + " description = '" + description + "' ";
	 params=params+1;
	}

	if(area)
	{
		if(params!=0)
		{
			 query = query + ",";
		}
	 query = query + " area = '" + area + "' ";
	 params=params+1;
	}
	 query = query + " WHERE id=" + id;
	 

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//************ DELETE
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






///**********************************FOOD ************************************************************************
//***************INSERT
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

//************ read one data relation ANIMAL/FOOD
app.get('/food/:id_food/animals/:id_animal', function(req, res) {
	var id_animal = req.params.id_animal;
	var id_food = req.params.id_food;
	var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id_animal + " AND food.id=" + id_food;
	//filter fields
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


//************ read data relation ANIMAL/FOOD
app.get('/food/:id_food/animals', function(req, res) {
	var id_food = req.params.id_food;
	var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + id_food;

	//conditions
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

	//sort
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

	//champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//pagination
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



//************ read data
app.get('/food', function(req, res) {
	var query = "SELECT * FROM food"
	//conditions
	var conditions = ["id", "name_food", "quantity", "id_animal"];
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

	//sort
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

	//champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//pagination
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


//************ read one data relation
app.get('/food/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM food ";

	//champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	 
	 query = query + " WHERE id=" + id;
	 
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//************ UPDATE
app.put('/food/:id', function(req, res) {
	var id = req.params.id;
		var name = req.body.name;
		var id_animal= req.body.id_animal;
		var quantity= req.body.quantity;
	var params = 0;

	var query = "UPDATE food SET ";

	if(name)
	{
		if(params!=0)
		{
			 query = query + ",";
		}
	 query = query + " name = '" + name + "'";
	 params=params+1;
	}
		
	if(id_animal)
	{
		if(params!=0)
		{
			 query = query + ",";
		}
	 query = query + " id_animal = '" + id_animal + "' ";
	 params=params+1;
	}

	if(quantity)
	{
		if(params!=0)
		{
			 query = query + ",";
		}
	 query = query + " quantity = '" + quantity + "' ";
	 params=params+1;
	}
	 query = query + " WHERE id=" + id;
	 

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//************ DELETE
//delete all
app.delete('/food', function(req, res) {
	var query = "DELETE FROM food";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//delete one
app.delete('/food/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});







///********************************STAFF******************************
//************ INSERT
app.post('/staff', function(req, res) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var query = "INSERT INTO staff (firstname, lastname,wage) VALUES ('" + firstname + "','" + lastname + "'," + wage + ")";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//************ read data relation
app.get('/staff', function(req, res) {
	var query = "SELECT * FROM staff";

	//conditions
	var conditions = ["id", "firstname", "lastname", "wage"];
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

	//sort
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-"){
				query += " DESC,";
			}
			else {
				query += " ASC,";
			}
		}
		query = query.slice(0, -1);
	}

	//champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//pagination
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



//************ read one data
app.get('/staff/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM staff ";

	//champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	 
	query = query + " WHERE id=" + id;
	 
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


//************ UPDATE
app.put('/staff/:id', function(req, res) {
	var id = req.params.id;
		var firstname = req.body.firstname;
		var lastname= req.body.lastname;
		var wage= req.body.wage;
	var params = 0;

	var query = "UPDATE staff SET ";

	if(firstname)
	{
		if(params!=0)
		{
			 query = query + ",";
		}
	 query = query + " firstname = '" + firstname + "'";
	 params=params+1;
	}
		
	if(lastname)
	{
		if(params!=0)
		{
			 query = query + ",";
		}
	 query = query + " lastname = '" + lastname + "' ";
	 params=params+1;
	}

	if(wage)
	{
		if(params!=0)
		{
			 query = query + ",";
		}
	 query = query + " wage = '" + wage + "' ";
	 params=params+1;
	}
	 query = query + " WHERE id=" + id;
	 

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//************ DELETE
//delete all
app.delete('/staff', function(req, res) {
	var query = "DELETE FROM staff";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//delete one
app.delete('/staff/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//************ UPDATE ONE
app.put('/staff/:id', function(req, res) {
	var id = req.params.id;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var params = 0;

	var query = "UPDATE staff SET ";

	if(firstname!=null)
	{
		if(params!=0)
		{
			 query = query + ","
		}
	 query = query + " firstname = '" + firstname + "' ";
	 params=params+1;
	}

	if(lastname!=null)
	{
		if(params!=0)
		{
			 query = query + ","
		}
	 query = query + " lastname = '" + lastname + "' ";
	 params=params+1;
	}

	if(wage!=null)
	{
		if(params!=0)
		{
			 query = query + ","
		}
	 query = query + " wage = '" + wage + "' ";
	 params=params+1;
	}

	 query = query + " WHERE id=" + id;
	 

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});







/////************ FOOD STATS *******************
app.get('/food-stats', function(req, res) {
	var id = req.params.id;
	var query = "SELECT animals.id, if(food_per_day=0,0,quantity/food_per_day) AS 'days_left' FROM animals INNER JOIN food on animals.id = food.id_animal"
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
