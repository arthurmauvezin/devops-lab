const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended : true}));

//connection to the database
var db = mysql.createConnection({
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	port: process.env.MYSQL_PORT
});

//definition of arrays 
var animalConditions = ["id","name","breed","food_per_day","birthday","entry_date","id_cage"];
var cageConditions = ["id","name","description","area"];
var foodConditions = ["id","name","quantity","id_animal"];
var staffConditions = ["id","firstname","lastname","wage"];

//Update function
//in : 
//	req: the request
//	query : the beginning of the query
//	myArr : the array which contains the conditions of the query
//out :
//	query : final query
function partialUpdate(req, query, myArr,id)
{
	for(var index in myArr) {
		if (myArr[index] in req.body) {
			query += " " + myArr[index] + " = '" + req.body[myArr[index]]+ "' ,";	
		}
	}
	query = query.slice(0,-1);
	query +="WHERE id = "+id;
	return query;
}

//Select with filters function
//in :
//	req : the request
//	query : the query
//	myArr : the array which contains the conditions of the query
//	selectField : for the field filter. Contains the select part that you want to replace
//out :
//	query : final query
function filterSelect(req, query, myArr,selectField) {
	
	//condition filter
	for(var index in myArr) {
		if (myArr[index] in req.query) {
			//if there is no 'where', add one
			if (query.indexOf("WHERE") < 0) {
				query +=" WHERE";
			} else { //else just add an "AND"
				query += " AND";
			}
			//filter conditions to add in the 'where'
			query += " " + myArr[index] + "='" + req.query[myArr[index]]+"'";
		}
	}

	//sorting filter
	if("sort" in req.query) {
		//retrieve sorting information
		var sort= req.query["sort"].split(",");
		query += " ORDER BY";
		//defining if it's ascending or descending
		for (var index in sort) {
			var direction = sort[index].substr(0,1); //retrieve the direction (- or +)
			var field = sort[index].substr(1); //retrieve the field the direction is applied to

			query += " "+field; //adding the field to the query
			//adding the right sorting condition to the query
			if (direction == "-")
				query+=" DESC,";
			else
				query+=" ASC,";
		}

		query = query.slice(0,-1); //deleting the last comma 
	}
	
	//fields filter
	if("fields" in req.query) {
		query = query.replace(selectField, req.query["fields"]); //we replace in our select the defaults field by the ones of our params in the request
	}

	//pagination filter
	if("limit" in req.query) {
		query += " LIMIT " + req.query["limit"]; //defining the limit
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"]; //defining the offset
		}
	}

	return query;
}

////////////////////////// FIREWALL
app.use(function(req, res, next) {
	if ("key" in req.query) { //if there is a key in our request params
		var key = req.query["key"];//retrieve the key
		var query = "SELECT * FROM users WHERE apikey='" + key + "'"; //see if it's in our database 
		db.query(query, function(err, result, fields) {
			if (err) throw err; //if something's wrong 
			if (result.length > 0) {
				next(); //access
			}
			else {	//if the key isn't in our database
				return res.status(403).send('Access token not valid');

			}
		});
	} else { //if there is no key in the params
		return res.status(403).send('Access token not provided');

	}
});

//////////////////////////1. ANIMAL CRUD
///////////////a. insert
app.post('/animals', function(req, res) {
	//params
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;

	//insertion query
	var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('"+name+"','"+breed+"',"+food_per_day+",'"+birthday+"', '"+entry_date+"',"+id_cage+")";

	console.log(query);
	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});

///////////////b. read
////i. read all
app.get('/animals', function(req,res) {
	var query = "SELECT * FROM animals"; //query

	query = filterSelect(req,query,animalConditions,'*'); //filtering our query if needed

	console.log(query);
	db.query(query, function(err, result, fields) {
		if (err) throw err; 
		
		res.send(JSON.stringify(result));
	});
});

////ii. read by id
app.get('/animals/:id', function(req, res) {
	var id = req.params.id; //params
	var query = "SELECT * FROM animals WHERE id=" +id; //query

	query = filterSelect(req,query,animalConditions,'*'); //filtering our query if needed

	console.log(query);
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

///////////////c. update
app.put('/animals/:id', function(req, res) {
	var id = req.params.id;//params

	var query = "UPDATE animals SET"; //query

	query = partialUpdate(req,query,animalConditions,id); //adding update fields		
	
	console.log(query);

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

///////////////d. delete
////i. delete all
app.delete('/animals', function(req, res) {
	var query = "DELETE FROM animals"; //query
	console.log(query);	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

////ii. delete by id
app.delete('/animals/:id', function(req, res) {
	var id = req.params.id;//params
	var query = "DELETE FROM animals WHERE id="+id; //query
	console.log(query);	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

//////////////////////////1. CAGES CRUD
///////////////a. insert
app.post('/cages', function(req, res) {
	//vairables
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;

	//query
	var query = "INSERT INTO cages (name,description,area) VALUES ('"+name+"','"+description+"',"+area+")";
	console.log(query);
	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

///////////////b. read
////i. read all
app.get('/cages', function(req,res) {
	var query = "SELECT * FROM cages";//query
	query = filterSelect(req,query,cageConditions,'*');//filtering
	console.log(query);
	db.query(query, function(err, result, fields) {
		if (err) throw err; 
		
		res.send(JSON.stringify(result));
	});
});

////ii. read by id
app.get('/cages/:id', function(req, res) {
	var id = req.params.id;//params
	var query = "SELECT * FROM cages WHERE id=" +id;//query
	
	query = filterSelect(req,query,cageConditions,'*');//filtering

	console.log(query);
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

///////////////c. update
app.put('/cages/:id', function(req, res) {
	var id = req.params.id; //params
	var query = "UPDATE cages SET";//query

	query = partialUpdate(req,query,cageConditions,id); //filtering	
	
	console.log(query);

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

///////////////d. delete
////i. delete all
app.delete('/cages', function(req, res) {
	var query = "DELETE FROM cages"; //query
	console.log(query);	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

////ii. delete by id
app.delete('/cages/:id', function(req, res) {
	var id = req.params.id; //query
	var query = "DELETE FROM cages WHERE id="+id;  //filtering

	console.log(query);	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

//////////////////////////3. FOOD CRUD
///////////////a. insert
app.post('/food', function(req, res) {
	//params
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;

	//query
	var query = "INSERT INTO food (name,quantity,id_animal) VALUES ('"+name+"',"+quantity+","+id_animal+")";

	console.log(query);
	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

///////////////b. read
////i. read all
app.get('/food', function(req,res) {
	var query = "SELECT * FROM food";//query
	
	query = filterSelect(req,query,foodConditions,'*');//filtering

	console.log(query);
	db.query(query, function(err, result, fields) {
		if (err) throw err; 
		
		res.send(JSON.stringify(result));
	});
});

////ii. read by id
app.get('/food/:id', function(req, res) {
	var id = req.params.id;//params
	var query = "SELECT * FROM food WHERE id=" +id;//query
	
	query = filterSelect(req,query,foodConditions,'*');//filtering

	console.log(query);
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

///////////////c. update
app.put('/food/:id', function(req, res) {
	var id = req.params.id;//params
	var query = "UPDATE food SET";//query

	query = partialUpdate(req,query,foodConditions,id);//adding update fields to the query
	
	console.log(query);

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

///////////////d. delete
////i. delete all
app.delete('/food', function(req, res) {
	var query = "DELETE FROM food"; //query

	console.log(query);	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

////ii. delete by id
app.delete('/food/:id', function(req, res) {
	var id = req.params.id;//params
	var query = "DELETE FROM food WHERE id="+id; //query

	console.log(query);	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

//////////////////////////4. STAFF CRUD
///////////////a. insert
app.post('/staff', function(req, res) {
	//params
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;

	//query
	var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('"+firstname+"','"+lastname+"',"+wage+")";
	console.log(query);
	db.query(query, function(err, result, fields) {
		if(err) throw err;

		res.send(JSON.stringify("Success"));
	});
});

///////////////b. read
////i. read all
app.get('/staff', function(req,res) {
	var query = "SELECT * FROM staff";//query
	query = filterSelect(req,query,staffConditions,'*');//filtering

	console.log(query);
	db.query(query, function(err, result, fields) {
		if (err) throw err; 
		
		res.send(JSON.stringify(result));
	});
});

////ii. read by id
app.get('/staff/:id', function(req, res) {
	var id = req.params.id;//params
	var query = "SELECT * FROM staff WHERE id=" +id;//query
	
	query = filterSelect(req,query,staffConditions,'*');//filtering

	console.log(query);
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

///////////////c. update
app.put('/staff/:id', function(req, res) {
	var id = req.params.id;//params
	var query = "UPDATE staff SET";//query

	query = partialUpdate(req,query,staffConditions,id); //set up update fields	
	
	console.log(query);

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

///////////////d. delete
////i. delete all
app.delete('/staff', function(req, res) {
	var query = "DELETE FROM staff"; //query

	console.log(query);	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

////ii. delete by id
app.delete('/staff/:id', function(req, res) {
	var id = req.params.id; //params
	var query = "DELETE FROM staff WHERE id="+id; //query

	console.log(query);	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});
//FOOD STATS
app.get('/food-stats', function(req, res) {
	//calculating how many days is left untill there is no food per animals.
	//Out : animal & food keys
	//	food_left
	//If there is an animal whose foor per day quantity is 0, 0 is written as a result in "food_left".
	var query = "SELECT animals.id, food.id, case when food_per_day = 0 then 0 else (quantity/food_per_day) end as days_left FROM animals INNER JOIN food ON animals.id  = id_animal;";

	console.log(query);
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		res.send(JSON.stringify(result));
	});
});

////////////////// RELATIONSHIPS
//////////// ANIMALS & CAGES

///////Cages in animal
////i. read all
app.get('/animals/:id/cages', function(req, res) {
	var id = req.params.id;//params
	var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON cages.id = id_cage WHERE animals.id=" + id; //query

	query = filterSelect(req,query,cageConditions,'cages.id, cages.name, cages.description, cages.area');//filtering

	console.log(query);
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

////ii. read one
app.get('/animals/:id_animal/cages/:id_cage', function(req, res) {
	//params
	var id_animal = req.params.id_animal;
	var id_cage = req.params.id_cage;
	var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON cages.id = id_cage WHERE animals.id=" + id_animal + " AND cages.id=" + id_cage;//query

	query = filterSelect(req,query,cageConditions,'cages.id, cages.name, cages.description, cages.area'); //filtering

	console.log(query);

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

///////Animals in cages
//// i. read all
app.get('/cages/:id/animals', function(req, res) {
	var id = req.params.id;//params
	//query
	var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date FROM cages INNER JOIN animals ON cages.id = id_cage WHERE cages.id=" + id;

	query = filterSelect(req,query,animalConditions,'animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date');//filtering

	console.log(query);
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//////////// FOOD & ANiMALS
////// animals in food
//// i.read all
app.get('/food/:id/animals', function(req, res) {
	var id = req.params.id; //params
	//query
	var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date FROM food INNER JOIN animals ON animals.id = id_animal WHERE food.id=" + id;
	
	query = filterSelect(req,query,animalConditions,'animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date'); //filtering

	console.log(query);
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//// ii. read one
app.get('/food/:id_food/animals/:id_animal', function(req, res) {
	//params
	var id_animal = req.params.id_animal;
	var id_food = req.params.id_food;
	//query
	var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date FROM food INNER JOIN animals ON animals.id = id_animal WHERE food.id=" + id_food + " AND animals.id=" + id_animal;
	
	query = filterSelect(req,query,animalConditions,'animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date'); //filtering

	console.log(query);

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

///// food in animals
app.get('/animals/:id/food', function(req, res) {
	var id = req.params.id; //params
	var query = "SELECT food.id, food.name, food.quantity, food.id_animal FROM animals INNER JOIN food ON animals.id = id_animal WHERE animals.id=" + id; //query

	query = filterSelect(req,query,foodConditions,'food.id, food.name, food.quantity, food.id_animal'); //filtering
	console.log(query);
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//COMMUNICATION, what's happening on the port 3000? 
app.listen(3000, function() {
	//securing the database
	db.connect(function(err) {
		if (err) throw err;
		console.log('Connection to database successful!');
	});
	
	//just a little output
	console.log('Example app listening on port 3000 !');
});
