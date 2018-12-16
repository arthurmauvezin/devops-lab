/* Copyright (C) 2018 Romain Brisse - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of my made up license, which fortunately allows 
 * you to anything you want with that code as long as you
 * have my blessing and Mr. Cabanes'.
 *
 * This code is based on the code of Mr. Quentin Cabanes,
 * which is to be used in the scope of the "Introduction
 * to web API" class he teaches at ECE Paris. 
 * Any distribution of the following code should be 
 * agreed upon by Mr. Quentin Cabanes & Mr. Romain Brisse
 */

//VARIABLE DECLARATIONS

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

//Object used to build SQL queries
//It is a representation of the database schema
let query_constructor = { "animals" :["animals", ["id","name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"]], "cages" : ["cages",["id", "name", "description", "area"]], "food" : [ "food", ["id", "name", "quantity", "id_animal"]], "staff" : [ "staff",["id", "firstname", "lastname", "wage"]] }; 
//Object representing the relations between table.
let relationsArray = {"animals" : {"cages":["id_cage","id"],"food":["id","id_animal"]},"food" : {"animals":["id_animal","id"]}, "cages" : {"animals":["id","id_cage"]}};
let path = "";

//connecting to the database
var db = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	port: process.env.MYSQL_PORT
});

///////////////////////////////////////////////////////////////////////////////////////////////
//APIKEY

app.use(function(req, res, next){
	console.log(req.url);
	if("key" in req.query){
		var key = req.query["key"];
		var query = "SELECT * FROM users WHERE apikey='" + key + "'";
		db.query(query, function(err, result, fields){
			if(err) throw err;
			if(result.length > 0){
				next();
			}else{
				res.status(403).send("Access Denied");
			}
		});
	}else{
		res.status(403).send("Access denied");
	}
});

////////////////////////////////////////////////////////////////////////////////////////////////
// /CRUD

//GET
//So here a few updates on what is what:
/* req.params.route1 --> the first and main table we are working on
 * req.params.route2 --> the second and to be joined table
 * relations --> Object containing the relationships between table --> use it like this: id to use is relations[route1][route2][*]
 * req.params.id1 --> id associated with the main table
 * req.params.id2 --> id associated with the secondary table
 * query_constructor[req.params.route1][1].concat(query_constructor[req.params.route2][1]) --> concatenation of the 2 arrays of fields from the two used tables in get with multiple redirections cases.
 */

app.get('/food-stats',function(req,res){
	var query = "SELECT animals.id, IF(animals.food_per_day=0,0,food.quantity/animals.food_per_day) AS days_left FROM animals JOIN food ON animals.id = food.id_animal";
	send(query,res);
});

app.get('/:route',function(req,res){
        var query = "SELECT * FROM " + req.params.route;
        query = filter(req,res,query,query_constructor[req.params.route][1]);
	send(query,res);
});

app.get('/:route/:id',function(req,res){
        var query = "SELECT * FROM " + req.params.route + " WHERE id=" + req.params.id;
        query = filter(req,res,query,query_constructor[req.params.route][1]);
        send(query,res);
});

app.get('/:route1/:id/:route2', function(req,res){
        var query = "SELECT " + req.params.route2 + ".* FROM " + req.params.route1 + " JOIN " + req.params.route2 + " ON " + req.params.route2 + "." + relationsArray[req.params.route1][req.params.route2][1] + " = " + req.params.route1 + "." + relationsArray[req.params.route1][req.params.route2][0] + " WHERE " + req.params.route1 + ".id = " + req.params.id;
	query = filter(req,res,query,query_constructor[req.params.route1][1].concat(query_constructor[req.params.route2][1]));
	console.log(query);
	send(query,res);
});


app.get('/:route1/:id1/:route2/:id2', function(req,res){
        var query = "SELECT " + req.params.route2 + ".* FROM " + req.params.route1 + " JOIN " + req.params.route2 + " ON " + req.params.route2 + "." + relationsArray[req.params.route1][req.params.route2][1] + " = " + req.params.route1 + "." + relationsArray[req.params.route1][req.params.route2][0] + " WHERE " + req.params.route1 + ".id = " + req.params.id1 + " AND " + req.params.route2 + ".id=" + req.params.id2;
	query = filter(req,res,query,query_constructor[req.params.route1][1].concat(query_constructor[req.params.route2][1]));
	send(query,res);
});


//all these operation are done using a generic request creator, it's the function generic_requests defined later in this code
app.put('/:route/:id', generic_requests);
app.post('/:route', generic_requests);
app.delete('/:route', generic_requests);
app.delete('/:route/:id', generic_requests);

////////////////////////////////////////////////////////////////////////////////////////////////
//FUNCTIONS

//filter
function filter(req,res,query,conditions){
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE") < 0){
				query += " WHERE";
			}else{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}
	if("sort" in req.query){
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for(var index in sort){
			query += " " + sort[index].substr(1);
			if(sort[index].substr(0,1) == "-"){
				query += " DESC,";
			}else{
				query += " ASC,";
			}
		}
		query = query.slice(0,-1);
	}
	if("fields" in req.query){
		query = query.replace("*", req.query["fields"]);
	}
	if("limit" in req.query){
		query += " LIMIT " + req.query["limit"];
		if("offset" in req.query){
			query += " OFFSET " + req.query["offset"];
		}
	}
return query;
}

//send query
function send(query, res){
	db.query(query,function(err,result,fields){
		if(err) throw err
		res.send(JSON.stringify(result));
	});
}

function generic_requests(req,res){
	if(req.method == "POST") var query = "INSERT INTO " + query_constructor[req.params.route][0] + " (" + Object.keys(req.body).join(",") + ") VALUES ('" + Object.values(req.body).join("','") + "')";
	if(req.method == "PUT"){
		var query = "UPDATE " + query_constructor[req.params.route][0] + " SET";
        	//browse all the keys given by the body and for each add name and value to the query
        	for(var i=0; i<Object.keys(req.body).length;i++)
                	query += " " + Object.keys(req.body)[i] + "='" + Object.values(req.body)[i] + "',";
        	query = query.slice(0,-1) + " WHERE id=" + req.params.id;
	}
	if(req.method == "DELETE"){
		var query = "DELETE FROM " + query_constructor[req.params.route][0];
		if(req.params.length==2)
			query += " WHERE id = " + req.params.id; 
	}
	send(query,res);
}

///////////////////////////////////////////////////////////////////////////////////////////////
//LISTENING

app.listen(3000,function(){
	console.log('example app listening on port 3000!');
});
