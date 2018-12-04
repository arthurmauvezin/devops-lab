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

//information about the db tables
let infoTables = 
{ "animals" :["id","name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"],
	"cages" : ["id", "name", "description", "area"],
	"food" : ["id", "name", "quantity", "id_animal"],
"staff" : ["id", "firstname", "lastname", "wage"] }; 

//relations between tables -> [A][B][0 relation of table A; 1 relation of table B]
let relations = 
{"animals" : {"cages":["id_cage","id"],
"food":["id","id_animal"]},
"food" : {"animals":["id_animal","id"]},
"cages" : {"animals":["id","id_cage"]}};

//Firewall __________________________________________
app.use(function(req, res, next) {
	if ("key" in req.query) {
		var query = "SELECT * FROM users WHERE apikey='" + req.query["key"] + "'";
		db.query(query, function(err, result, fields) {
			if (err) throw err;
			if (result.length > 0) {
				next();
			}
			else {
				res.status(403).send("Access denied");
			}
		});
		} else {
		res.status(403).send("Access denied");
	}
});

//  //Get table information
// function getInfoTable (route){
// var rName = new Array();
// var infoTable = "SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'"+route+"'";

// db.query(infoTable, function(err, result, fields) {
// if (err) throw err;	


// for(j=0; j<result.length; j++) 
// {
// rName.push(JSON.stringify(result[j]).split(/["]/)[3]);
// }
// return rName;		});	
// }

//Filter __________________________________________
function filter(req,query,route)
{	
	//Selection
	var splitRoute= route.split(";"); //look if many routes are send
	for(var splitPart in splitRoute){ //for each route
		for ( var index in infoTables[splitRoute[splitPart]]) { //look for the informations of the table matching the route
			if (infoTables[splitRoute[splitPart]][index] in req.query) {
				
				if (query.indexOf( "WHERE" ) < 0 ) {
					query += " WHERE" ;
					} else {
					query += " AND" ;
				}
				query += " " + infoTables[splitRoute[splitPart]][index] + "='" +
				req.query[infoTables[splitRoute[splitPart]][index]] + "'" ;
			}
		}}
		
		//Sort
		if ( "sort" in req.query) {
			var sort = req.query[ "sort" ].split( "," );
			query += " ORDER BY" ;
			for ( var index in sort) {
				var direction = sort[index].substr( 0 , 1 );
				var field = sort[index].substr( 1 );
				query += " " + field;
				if (direction == "-" )
				query += " DESC," ;
				else
				query += " ASC," ;
			}
			query = query.slice( 0 , -1 );
		}
		
		//Filtering
		if ( "fields" in req.query) {
			query = query.replace( "*" , req.query[ "fields" ]);
		}
		
		//Pagination
		if ( "limit" in req.query) {
			query += " LIMIT " + req.query[ "limit" ];
			if ( "offset" in req.query) {
				query += " OFFSET " + req.query[ "offset" ];
			}
		}
		
		return query;
		
}

//Routes ___________________________________________


app.get('/', function(req, res) {
	res.send(JSON.stringify({ "zoo" : "zoo"}));
});

app.get('/food-stats', function(req, res) {
	var query = "SELECT animals.id, IF(animals.food_per_day>0, food.quantity/animals.food_per_day, 0) as days_left FROM food, animals WHERE food.id_animal=animals.id";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//Create ___________________________________________
app.post('/:route', function(req, res) {
	var query = "INSERT INTO "+req.params.route+"("+ Object.keys(req.body).join(',') + ") VALUES('"+Object.values(req.body).join("','")+"')"; 
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
}); 


//Read __________________________________________

app.get('/:route', function(req, res) {
	var query = "SELECT * FROM "+req.params.route;
	query= filter(req,query,req.params.route);
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
		
	});
	
	
});

app.get('/:route/:id', function(req, res) {
	
	var query = "SELECT * FROM "+req.params.route+" WHERE id=" + req.params.id;
	query= filter(req,query,req.params.route);
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


//Update __________________________________________

app.put('/:route/:id', function(req, res) {
	
	var query = "UPDATE "+req.params.route+" SET";
	for (var i = 0; i<Object.values(req.body).length ; i++){		
		query += " "+ Object.keys(req.body)[i] +" = '"+ Object.values(req.body)[i] + "',";
	}
	query = query.slice(0, -1) + " WHERE id="+req.params.id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


//Delete __________________________________________
app.delete('/:route', function(req, res) {
	var query = "DELETE FROM "+req.params.route;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/:route/:id', function(req, res) {
	var query = "DELETE FROM "+req.params.route+" WHERE id=" + req.params.id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


//Relation __________________________________________

app.get('/:routeA/:idA/:routeB', function(req, res) {
	var routeA= req.params.routeA;
	var routeB=req.params.routeB;
	var idA=req.params.idA;
	var relA=relations[req.params.routeA ][req.params.routeB][0];
	var relB=relations[req.params.routeA ][req.params.routeB][1];
	var query = "SELECT "+ routeB +".* FROM "+ routeA +" INNER JOIN "+ routeB +" ON "+ routeA +"."+relA+" = "+ routeB +"."+relB+" WHERE "+ routeA +".id=" + idA;
	query= filter(req,query,(req.params.routeA+";"+req.params.routeB));
	console.log("relation idA:  "+query);
	console.log();
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


app.get('/:routeA/:idA/:routeB/:idB', function(req, res) {
	var routeA= req.params.routeA;
	var routeB=req.params.routeB;
	var idA=req.params.idA;
	var idB=req.params.idB;
	var relA=relations[req.params.routeA ][req.params.routeB][0];
	var relB=relations[req.params.routeA ][req.params.routeB][1];
	var query = "SELECT "+ routeB +".* FROM "+ routeA +" INNER JOIN "+ routeB +" ON "+ routeA +"."+ relA +" = "+ routeB +"."+ relB +" WHERE "+ routeA +".id=" + idA + " AND "+ routeB +".id=" + idB;
	query= filter(req,query,(req.params.routeA+";"+req.params.routeB));
	console.log("relation idAB: "+query);
	console.log();
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});




//__________________________________________
app.listen(3000, function() {
	db.connect(function(err) {
		if (err) throw err;
		console.log('Connection to database successful!');
	});
	console.log('Example app listening on port 3000!');
});
