// Variables
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
var data = []; // 2 dimensions array that contains the database schema
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to database
var db = mysql.createConnection({
	host: "localhost" ,
	user: "root" ,
	password: "" ,
	database: "zoo" ,
	port: "3306"
});

/*************************************************** FIREWALL ***************************************************/
app.use(function (req, res, next) {
	if ("key" in req.query) {
		var key = req.query["key"];
		var query = "SELECT * FROM users WHERE apikey = '" + key + "'" ;
		db.query(query, function (err, result, fields) {
			if (err) throw err;
			if (result.length > 0 ) {
				next();
			}
			else {
				res.status(403).send("Access Denied");
			}
		});
		} else {
		res.status(403).send("Access denied");
	}
});

/*************************************************** POST ***************************************************/
app.post('/:route', function (req, res) {
	var query = "INSERT INTO " + data[getTable(req.params.route)][0] + " (" + Object.keys(req.body) + ") VALUES ('" + Object.values(req.body).join("','") + "')";
	executeQuery(query, res);
});

/*************************************************** STATISTIQUES ***************************************************/
app.get('/food-stats', function (req, res) {
	var query = "SELECT animals.id, IF(animals.food_per_day=0,0,food.quantity/animals.food_per_day) AS days_left FROM animals JOIN food ON animals.id = food.id_animal";
	executeQuery(query, res);
});

/*************************************************** GET ***************************************************/
app.get('/:route', function (req, res) {
	var query = "SELECT * FROM " + data[getTable(req.params.route)][0];
	filters(query, req, res, data[getTable(req.params.route)]);
});

app.get('/:route/:id', function (req, res) {
	var query = "SELECT * FROM " + data[getTable(req.params.route)][0] + " WHERE " + data[getTable(req.params.route)][1] + " = " + req.params.id;
	filters(query, req, res, data[getTable(req.params.route)]);
});

/* The following request used an array (rel) returned by the getRelations function. The latter holds:
	- rel['route1']: name of the table corresponded to route 1
	- rel['id1']: ID field of route 1
	- rel['route2']: name of the table corresponded to route 2
	- rel['id2']: ID field of route 2
The array is used in order to make the reading of the queries more bearable. */
app.get('/:route1/:id1/:route2', function (req, res) {
	var rel = getRelations(req.params.route1, req.params.route2);
	var condition = getCondition(rel['route1'], rel['route2']);
	if(condition == null) condition = getCondition(rel['route2'], rel['route1']);
	var query = "SELECT " + rel['route2'] + ".* FROM " + rel['route1'] + " INNER JOIN " + rel['route2'] + " ON " + condition + " WHERE " + rel['id1'] + " = " + req.params.id1;
	filters(query, req, res, data[getTable(rel['route1'])].concat(data[getTable(rel['route2'])]));
});

app.get('/:route1/:id1/:route2/:id2', function (req, res) {
	var rel = getRelations(req.params.route1, req.params.route2);
	var condition = getCondition(rel['route1'], rel['route2']);
	if(condition == null) condition = getCondition(rel['route2'], rel['route1']);
	var query = "SELECT " + rel['route2'] + ".* FROM " + rel['route1'] + " INNER JOIN " + rel['route2'] + " ON " + condition + " WHERE " + rel['id1'] + " = " + req.params.id1 + " AND " + rel['id2'] + " = " + req.params.id2;
	filters(query, req, res, data[getTable(rel['route1'])].concat(data[getTable(rel['route2'])]));
});

/*************************************************** DELETE ***************************************************/
app.delete('/:route', function (req, res) {
	var query = "DELETE FROM " + data[getTable(req.params.route)][0];
	executeQuery(query, res);
});

app.delete('/:route/:id' , function (req, res) {
	var query = "DELETE FROM " + data[getTable(req.params.route)][0] + " WHERE " + data[getTable(req.params.route)][1] + " = " + req.params.id;
	executeQuery(query, res);
});


/*************************************************** PUT ***************************************************/
app.put('/:route/:id', function (req, res) {
	var query = "UPDATE " + data[getTable(req.params.route)][0] + " SET ";
	for(let i = 0; i < Object.keys(req.body).length; i++){
		query += Object.entries(req.body)[i][0] + " = '" + Object.entries(req.body)[i][1] + "'";
		if(i != (Object.keys(req.body).length - 1)) query += ", ";
	}
	query += " WHERE " + data[getTable(req.params.route)][1] + " = " + req.params.id;
	executeQuery(query, res);
});


/*************************************************** OTHERS FUNCTIONS ***************************************************/
// Function that executes the query in parameter + success message depending of the action 
function executeQuery(query, res){
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
}

// Get the array that corresponds to the routes
function getTable(route){
	var index; // Index of table to return
	for(let i = 0; i < data.length; i++){
		if(route == data[i][0]) index = i;
	}
	return index;
}

// Return an array that holds the name and ID of both route 1 and route 2 in case of relationship calls (more readable)
function getRelations(route1, route2){
	var rel = {'route1' : data[getTable(route1)][0], 'id1': data[getTable(route1)][0] + "." + data[getTable(route1)][1],
	'route2' : data[getTable(route2)][0], 'id2': data[getTable(route2)][0] + "." + data[getTable(route2)][1]};
	return rel;
}

// Get the correct column's name for IDs inside the tables
function getCondition(route1, route2){
	var id = "id_" + data[getTable(route2)][0].slice(0 ,-1);
	var condition = null;
	
	for (var index in data[getTable(route1)]) {
		if (data[getTable(route1)][index] == id) {
			condition = route2 + "." + data[getTable(route2)][1]+ " = " + route1 + "." + id;
		}
	}
	
	return condition;
}

// Function which adds filters to the query
function filters(query, req, res, conditions){
	
	// 1. Conditions
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf("WHERE") < 0 ) {
				query += " WHERE" ;
				} else {
				query += " AND" ;
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'" ;
			}
	}
	
	// 2. Sort
	if ("sort" in req.query) {
		var sort = req.query[ "sort" ].split(",");
		query += " ORDER BY" ;
		for ( var index in sort) {
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;
			if (direction == "-" )
			query += " DESC," ;
			else
			query += " ASC," ;
		}
		query = query.slice(0 ,-1);
	}
	
	// 3. Fields
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	// 4. Pagination
	if ("limit" in req.query) {
		query += " LIMIT " + req.query[ "limit" ];
		if ( "offset" in req.query) {
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
	
	// Executing the query at last
	executeQuery(query, res);
}

// Initialize the data array to match the database schema
function initializeData(){
	// Retrieving database schema to insert into data array
	db.query("show tables", function (err, result, fields) { // Retrieve the name of the tables in the database
		if (err) throw err;
		result.forEach(function(element) {
			var tables = []; // 1 array corresponds to 1 table inside the database
			db.query("describe " + element.Tables_in_zoo,  function (err, result, fields) { // Retrieve the name of the columns in said table
				if (err) throw err;
				tables.push(element.Tables_in_zoo); // Pushing the name of the table 
				result.forEach(function(element) {
					tables.push(element.Field);	// Pushing the name of the columns
				});
				data.push(tables); // Pushing the table into data array
			});	
			
		});
		console.log('Retrieving database schema: success !');
	});
}

/*************************************************** LISTENING ***************************************************/
app.listen(3000, function () {
	// Connection to database
	/*db.connect( function (err) {
		if (err) throw err;
		console.log('Connection to database successful!');
	});*/
	
	initializeData(); // Initializing the data array with database schema
	
	console.log('App listening on port 3000!');
});	
