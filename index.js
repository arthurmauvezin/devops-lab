const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database: "project",
port: "3306"
});

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


app.get('/animals', function(req, res) {
	var query = "SELECT * FROM animals";
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
		query = query.replace("*", req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
	if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
app.get('/animals/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id="+id;
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
		query = query.replace("*", req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});
app.get('/animals/:id_cage/cages',function(req,res){
	var id = req.params.id_cage;
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
		query = query.replace("cages.id,cages.name,cages.description,cages.area","cages."+ req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});
app.get('/animals/:id_cage/cages/:cage_animals',function(req,res){
	var id_cage = req.params.id_cage;
	var cage_animals = req.params.cage_animals;
	var query= "SELECT cages.id,cages.name,cages.description,cages.area FROM animals INNER JOIN cages ON animals.id_cage=cages.id WHERE animals.id="+id_cage+" AND cages.id="+cage_animals;
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
app.get('/animals/:id_food/food',function(req,res){
	var id = req.params.id_food;
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
app.get('/animals/:id_food/food/:id_animals',function(req,res){
	var id_food = req.params.id_food;
	var id_animals = req.params.id_animals;
	var query= "SELECT food.id,food.name,food.quantity,food.id_animal FROM animals INNER JOIN food ON food.id_animal=animals.id WHERE food.id="+id_food+" AND animals.id="+id_animals;
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

app.post('/animals', function(req, res) {
	var Name = req.body.name;
	var Breed = req.body.breed;
	var Daily_food = req.body.food_per_day;
	var Birthday = req.body.birthday;
	var Entry = req.body.entry_date;
	var id_cage = req.body.id_cage;
	var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" + Name + "','"+Breed+"','"+Daily_food+"','"+Birthday+"','"+Entry+"','"+id_cage+"')";
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify("Success"));
	});
});
app.put('/animals/:id', function(req, res) {
	var id = req.params.id;
	var Name = req.body.name;
	var Breed = req.body.breed;
	var Daily_food = req.body.food_per_day;
	var Birthday = req.body.birthday;
	var Entry = req.body.entry_date;
	var Cage = req.body.id_cage;
	var query = "UPDATE animals SET ";
	if(Name !== undefined) query+=" name = '"+Name+"',";
	if(Breed !== undefined) query+=" breed = '"+Breed+"',";
	if(Daily_food !== undefined) query+=" food_per_day = '"+Daily_food+"',";
	if(Birthday !== undefined) query+=" birthday = '"+Birthday+"',";
	if(Entry !== undefined) query+=" entry_date = '"+Entry+"',";
	if(Cage !== undefined) query+=" id_cage = '"+Cage+"',";

	query=query.slice(0,-1);
	query+= " WHERE id="+id;
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify("Success"));
	});
});
app.delete('/animals', function(req, res) {
	var query = "DELETE FROM animals";
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify("Success"));
	});
});
app.delete('/animals/:id', function(req, res) {
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id=" + id;
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify("Success"));
	});
});

///////////////////////////////////////////////////

app.get('/cages', function(req, res) {
	var query = "SELECT * FROM cages";
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
		query = query.replace("*", req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});
app.get('/cages/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id="+id;
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
		query = query.replace("*", req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});
app.get('/cages/:id_cage/animals',function(req,res){
	var id = req.params.id_cage;
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
app.get('/cages/:id_cage/animals/:id_animals',function(req,res){
	var id_cage = req.params.id_cage;
	var id_animals = req.params.id_animals;
	var query= "SELECT animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date,animals.id_cage FROM cages INNER JOIN animals ON cages.id=animals.id_cage WHERE cages.id="+id_cage+" AND animals.id="+id_animals;
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


app.post('/cages', function(req, res) {
	var Name = req.body.name;
	var Description = req.body.description;
	var Area = req.body.area;
	var query = "INSERT INTO cages (name,description,area) VALUES ('" + Name + "','"+Description+"','"+Area+"')";
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify("Success"));
	});
});
app.put('/cages/:id', function(req, res) {
	var id = req.params.id;
	var Name = req.body.name;
	var Description = req.body.description;
	var Area = req.body.area;
	var query = "UPDATE cages SET ";
	if(Name !== undefined) query+=" name = '"+Name+"',";
	if(Description !== undefined) query+=" description = '"+Description+"',";
	if(Area !== undefined) query+=" area = '"+Area+"',";

	query=query.slice(0,-1);
	query+= " WHERE id="+id;
	db.query(query, function(err, result, fields) {
	if (err) throw err;
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


///////////////////////////////////////////////////

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
app.get('/food/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id="+id;
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
app.get('/food/:id_food/animals',function(req,res){
	var id = req.params.id_food;
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
app.get('/food/:id_food/animals/:id_animals',function(req,res){
	var id_food = req.params.id_food;
	var id_animals = req.params.id_animals;
	var query= "SELECT animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date,animals.id_cage FROM food INNER JOIN animals ON food.id_animal=animals.ID WHERE food.ID="+id_food+" AND animals.ID="+id_animals;
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


///////////////////////////////////////////////////

app.get('/staff', function(req, res) {
	var query = "SELECT * FROM staff";
	var conditions = ["id","firstname","lastname","wage"];
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
		query = query.replace("*", req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});

app.get('/staff/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id="+id;
	var conditions = ["id","firstname","lastname","wage"];
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
		query = query.replace("*", req.query["fields"]);
	}
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	res.send(JSON.stringify(result));
	});
});
app.post('/staff', function(req, res) {
	var Firstname = req.body.firstname;
	var Lastname = req.body.lastname;
	var Wage = req.body.wage;
	var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('" + Firstname + "','"+Lastname+"','"+Wage+"')";
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
	if(Firstname !== undefined) query+=" firstname = '"+Firstname+"',";
	if(Lastname !== undefined) query+=" lastname = '"+Lastname+"',";
	if(Wage !== undefined) query+=" wage = '"+Wage+"',";
	query=query.slice(0,-1);
	query+= " WHERE id="+id;
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

///////////////////////////////////////////////////

app.get('/food-stats', function(req, res) {
	var query = "SELECT animals.id, CASE WHEN animals.food_per_day=0 THEN 0 ELSE food.quantity/animals.food_per_day END as days_left"+
	" FROM animals INNER JOIN food ON animals.id=food.id_animal";
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
