const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended:true }));

//DB connection
var db = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	port : process.env.MYSQL_PORT,
});

// Listening
app.listen(3000, function() {
/*	db.connect(function(err) {
		if(err) {
			console.log(err);
			throw err;
		}
		console.log('Connection to database successful');
	});
*/
	console.log('Zoo app listening on port 3000!');
});

//Check the validity of the apikey
app.use(function(req, res, next) {
	if("key" in req.query){
		var apikey = req.query["key"]; 
		var query = "SELECT * from users WHERE apikey='" + apikey + "'";
		db.query(query, function(err, result, fields){
			if(err) throw err;
			if(result.length > 0){
				next();
			}
			else {
				res.status(403).send("HTTP 403 : Access Denied, wrong token");
			}
		});
	}
	else {
		res.status(403).send("HTTP 403 : Access denied, no token");
	}
});




/***********************************************************
	FUNCTIONS
***********************************************************/

//Filters the query if specific fields are specified
function filtering(query, request, string){
	if("fields" in request){
		query = query.replace(string, request["fields"]);
	}
	return query;
}

//Selects the key & value requested
function selecting(query, request, fields){
	for(var index in fields) {
		if(fields[index] in request) {
			if(query.indexOf("WHERE") < 0) {
				query += " WHERE ";
			}
			else {
				query += " AND ";
			}
			query += " " + fields[index] + "='" + request[fields[index]] + "'";
		}
	}
	return query;
}

//Sort by the wanted parameters
function sorting(query, request){
	if("sort" in request) {
		var sort = request["sort"].split(",");
		query += " ORDER BY";
		for(var index in sort) {
			var direction = sort[index].substr(0,1); //+ - for direction at the beginning
			var field = sort[index].substr(1);// the rest of the string expect direction
			query += " " + field;
			if(direction == "-") query += " DESC,";
			else query += " ASC,";
		}
		query = query.slice(0, -1);//remove the last ,
	}
	return query;
}

//Paginates the results depending on the request
function pagination(query, request) {
	if("limit" in request) {
		query += " LIMIT " + request["limit"];
		if ("offset" in request) {
			query += " OFFSET " + request["offset"];
		}
	}
    return query
} 




/********************************************************
	Route : /animals
********************************************************/

//animals fields in database
var animals_fields = ["id", "name", "breed", "food_per_day", "birthday", "entry_date","id_cage"]; //fields testable in the table

//CREATE
app.post('/animals',  function (req, res) {
	var name = req.body.name;
	var breed = req.body.breed;
	var daily = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry = req.body.entry_date;
	var cid = req.body.id_cage;

	var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('" + name + "', '" + breed + "', " + daily + ", '" + birthday + "', '" + entry + "', " + cid + ")";

	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Create for " + name + " successfull"));
	});
});
//READ
app.get('/animals', function (req, res) {
	var query = "SELECT * FROM animals";
		
	query = filtering(query, req.query, "*");
	query = selecting(query, req.query, animals_fields);
	query = sorting(query, req.query);
	query = pagination(query, req.query);	

	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});
app.get('/animals/:id', function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id=" + id;

	query = filtering(query, req.query, "*");
	query = selecting(query, req.query, animals_fields);
	query = sorting(query, req.query);
	query = pagination(query, req.query);

	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});
//UPDATE
app.put('/animals/:id', function (req, res) {
	var id = req.params.id;
	
	var query = "UPDATE animals SET";
		for(var index in animals_fields) {
		if(animals_fields[index] in req.body) {
			query += " " + animals_fields[index] + "='" + req.body[animals_fields[index]] + "',";
		}
	}
	query = query.slice(0,-1);
	query += " WHERE id = " + id;

	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Successful update"));
	});
});
//DELETE
app.delete('/animals', function (req, res) {
	var query = "DELETE FROM animals";
	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Successful all delete"));
	});
});
app.delete('/animals/:id', function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Successful one delete"));
	});
});
//Relationships
app.get('/animals/:id/cages', function (req, res) {
	var id = req.params.id;
	var query = "SELECT cages.* FROM animals INNER JOIN cages ON cages.id = animals.id_cage WHERE animals.id =" + id;

	query = filtering(query, req.query, "cages.*");
	query = selecting(query, req.query, animals_fields);
	query = selecting(query, req.query, cages_fields);
	query = sorting(query, req.query);
	query = pagination(query, req.query);

	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});
//Precise Relationship
app.get('/animals/:id/cages/:id_cage', function (req, res) {
	var id = req.params.id;
	var id_cage = req.params.id_cage;
	var query = "SELECT cages.* FROM animals INNER JOIN cages ON cages.id = animals.id_cage WHERE animals.id =" + id + " AND cages.id = id_cage";

	query = filtering(query, req.query, "cages.*");
	query = selecting(query, req.query, animals_fields);
	query = selecting(query, req.query, cages_fields);
	query = sorting(query, req.query);
	query = pagination(query, req.query);

	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});
app.get('/animals/:id/food', function (req, res) {
	var id = req.params.id;
	var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id =" + id;

	query = filtering(query, req.query, "food.*");
	query = selecting(query, req.query, animals_fields);
	query = selecting(query, req.query, food_fields);
	query = sorting(query, req.query);
	query = pagination(query, req.query);

	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});




/********************************************************
	Route : /cages
********************************************************/

//cages fileds in database
var cages_fields = ["id", "name", "description", "area"]; //fields testable in the table
//CREATE
app.post('/cages',  function (req, res) {
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	
	var query = "INSERT INTO cages (name, description, area) VALUES ('" + name + "', '" + description + "', " + area + ")";
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Create for " + name + " successfull"));
	});
});
//READ
app.get('/cages', function (req, res) {
	var query = "SELECT * FROM cages";

	query = filtering(query, req.query, "*");
	query = selecting(query, req.query, cages_fields);
	query = sorting(query, req.query);
	query = pagination(query, req.query);

	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});
app.get('/cages/:id', function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;

	query = filtering(query, req.query, "*");
	query = selecting(query, req.query, cages_fields);
	query = sorting(query, req.query);
	query = pagination(query, req.query);

	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});
//UPDATE
app.put('/cages/:id', function (req, res) {
	var id = req.params.id;
	
	var query = "UPDATE cages SET";
	for(var index in cages_fields) {
		if(cages_fields[index] in req.body) {
			query += " " + cages_fields[index] + "='" + req.body[cages_fields[index]] + "',";
		}
	}
	query = query.slice(0,-1);
	query += " WHERE id = " + id;

	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Successful update"));
	});
});
//DELETE
app.delete('/cages', function (req, res) {
	var query = "DELETE FROM cages";
	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Successful all delete"));
	});
});
app.delete('/cages/:id', function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Successful one delete"));
	});
});
//Relationships
app.get('/cages/:id/animals', function (req, res) {
	var id = req.params.id;
	var query = "SELECT animals.* FROM animals INNER JOIN cages ON cages.id = animals.id_cage WHERE cages.id =" + id;

	query = filtering(query, req.query, "animals.*");
	query = selecting(query, req.query, animals_fields);
	query = selecting(query, req.query, cages_fields);
	query = sorting(query, req.query);
	query = pagination(query, req.query);

	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});




/********************************************************
	Route : /food
********************************************************/

//food fields in database
var food_fields = ["id", "name", "quantity", "id_animal"]; //fields testable in the table
//CREATE
app.post('/food',  function (req, res) {
	var name = req.body.name;
	var id_animal = req.body.id_animal;
	var quantity = req.body.quantity;

	var query = "INSERT INTO food (name, quantity, id_animal) VALUES ('" + name + "', " + quantity + ", " + id_animal + ")";

	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Create for " + name + " successfull"));
	});
});
//READ
app.get('/food', function (req, res) {
	var query = "SELECT * FROM food";

	query = filtering(query, req.query, "*");
	query = selecting(query, req.query, food_fields);
	query = sorting(query, req.query);
	query = pagination(query, req.query);

	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});
app.get('/food/:id', function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id=" + id;

	query = filtering(query, req.query, "*");
	query = selecting(query, req.query, food_fields);
	query = sorting(query, req.query);
	query = pagination(query, req.query);

	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});
//UPDATE
app.put('/food/:id', function (req, res) {
	var id = req.params.id;
	
	var query = "UPDATE food SET";
	for(let key in req.query) {
			for(var index in food_fields) {
		if(food_fields[index] in req.body) {
			query += " " + food_fields[index] + "='" + req.body[food_fields[index]] + "',";
		}
	}
	}
	query = query.slice(0,-1);
	query += " WHERE id = " + id;

	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Successful update"));
	});
});
//DELETE
app.delete('/food', function (req, res) {
	var query = "DELETE FROM food";
	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Successful all delete"));
	});
});
app.delete('/food/:id', function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Successful one delete"));
	});
});
//Relationships
app.get('/food/:id/animals', function (req, res) {
	var id = req.params.id;
	var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id =" + id;

	query = filtering(query, req.query, "animals.*");
	query = selecting(query, req.query, animals_fields);
	query = selecting(query, req.query, food_fields);
	query = sorting(query, req.query);
	query = pagination(query, req.query);

	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});
//Precise Relationship
app.get('/food/:id/animals/:id_animal', function (req, res) {
	var id = req.params.id;
	var id_animal = req.params.id_animal
	var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id =" + id + " AND animals.id = " + id_animal;

	query = filtering(query, req.query, "animals.*");
	query = selecting(query, req.query, animals_fields);
	query = selecting(query, req.query, food_fields);
	query = sorting(query, req.query);
	query = pagination(query, req.query);

	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});




/********************************************************
	Route : /staff
********************************************************/

//staff fields in database
var staff_fields = ["id", "firstname", "lastname", "wage"]; //fields testable in the table
//CREATE
app.post('/staff',  function (req, res) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;

	var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('" + firstname + "', '" + lastname + "', " + wage + ")";

	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Create for " + firstname + " successfull"));
	});
});
//GET
app.get('/staff', function (req, res) {
	var query = "SELECT * FROM staff";

	query = filtering(query, req.query, "*");
	query = selecting(query, req.query, staff_fields);
	query = sorting(query, req.query);
	query = pagination(query, req.query);

	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});
app.get('/staff/:id', function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id=" + id;

	query = filtering(query, req.query, "*");
	query = selecting(query, req.query, staff_fields);
	query = sorting(query, req.query);
	query = pagination(query, req.query);

	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});
//UPDATE
app.put('/staff/:id', function (req, res) {
	var id = req.params.id;
	
	var query = "UPDATE staff SET";
		for(var index in staff_fields) {
		if(staff_fields[index] in req.body) {
			query += " " + staff_fields[index] + "='" + req.body[staff_fields[index]] + "',";
		}
	}
	query = query.slice(0,-1);
	query += " WHERE id = " + id;

	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Successful update"));
	});
});
//DELETE
app.delete('/staff', function (req, res) {
	var query = "DELETE FROM staff";
	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Successful all delete"));
	});
});
app.delete('/staff/:id', function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Successful one delete"));
	});
});




/********************************************************
	Route : /food-stats
********************************************************/

function Stat(id, days_left){
    this.id = id;
	this.days_left = days_left;
}

app.get('/food-stats', function (req, res) {
	var query = "SELECT animals.id as id, food_per_day, quantity FROM animals INNER JOIN food on animals.id = food.id_animal";
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		var days_left = new Array();
		for(var line in result) {
			var dailyConsumption = result[line].food_per_day;
			var quantity = result[line].quantity;
			
			if( dailyConsumption == 0 ) {
				days_left.push(new Stat(result[line].id, 0));
			}
			else {
				days_left.push(new Stat(result[line].id, quantity/dailyConsumption));
			}
		}	

		res.send(JSON.stringify(days_left));
	});
});
