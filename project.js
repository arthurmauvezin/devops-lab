// TP1 WEB 

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const host = process.environment.MYSQL_HOST;
const login = process.environment.MYSQL_LOGIN;
const password = process.environment.MYSQL_PASSWORD;
const database = process.environment.MYSQL_DATABASE;
const port = process.environment.MYSQL_PORT;


app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({
host: host,
user: login,
password: password,
database: database,
port: port
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
				
					res.status(403).send("You do not have rights to visit this page")
			}
		});
} 
else {
		res.status(403).send("You do not have rights to visit this page")
}
});



//------------------------------------------------------------------------------------------------------------------------------------------------//
//																																				  //
//															TP zoo																				  //
//																																				  //
//------------------------------------------------------------------------------------------------------------------------------------------------//

// GET / POST / PUT / DELETE FOR ANIMALS

//SELECT ALL ANIMALS

app.get('/animals/:id/cages', function(req, res) { 

	var id = req.params.id; 

var query="SELECT cages.* from animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id="+id; 

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


var conditions = ["id","name","description","area"];
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

	 console.log(query);


	db.query(query, function(err, result, fields) {
		if (err) throw err;



	
		res.send(JSON.stringify(result));
}); });

app.get('/food/:id/animals', function(req, res) { 

	var id = req.params.id; 

var query="SELECT animals.* from food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id="+id; 

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


var conditions = ["id","name","breed","food_per_day","birthday","entry_date","id_cage"];
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

	 console.log(query);


	db.query(query, function(err, result, fields) {
		if (err) throw err;



	
		res.send(JSON.stringify(result));
}); });

app.get('/animals/:id/food', function(req, res) { 

	var id = req.params.id; 

var query="SELECT food.* from animals INNER JOIN food ON  animals.id = food.id_animal WHERE animals.id="+id; 


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
var conditions = ["name","quantity","id_animal"];


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

	 console.log(query);


	db.query(query, function(err, result, fields) {
		if (err) throw err;



	
		res.send(JSON.stringify(result));
}); });


app.get('/cages/:id/animals', function(req, res) { 

	var id = req.params.id; 

var query="SELECT animals.* from cages INNER JOIN animals ON  cages.id = animals.id_cage WHERE cages.id="+id; 


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


var conditions = ["id","name","breed","food_per_day","birthday","entry_date","id_cage"];
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

	 console.log(query);


	db.query(query, function(err, result, fields) {
		if (err) throw err;



	
		res.send(JSON.stringify(result));
}); });


app.get('/animals/:id1/cages/:id2', function(req, res) { 

	var id1 = req.params.id1; 
var id2 = req.params.id2; 
var query="SELECT cages.* from animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id="+id1 +" AND cages.id="+id2; 

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


var conditions = ["id","name","description","area"];
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

	 console.log(query);


	db.query(query, function(err, result, fields) {
		if (err) throw err;



	
		res.send(JSON.stringify(result));
}); });




app.get('/food/:id1/animals/:id2', function(req, res) { 

	var id1 = req.params.id1; 
var id2 = req.params.id2; 
var query="SELECT animals.* from food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id="+id1 +" AND animals.id="+id2; 

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

var conditions = ["id","name","breed","food_per_day","birthday","entry_date","id_cage"];

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

	 console.log(query);


	db.query(query, function(err, result, fields) {
		if (err) throw err;



	
		res.send(JSON.stringify(result));
}); });















app.get('/animals', function(req, res) {

var query="SELECT * from animals"; 



// SELECT BY conditions 

var conditions = ["name","breed","food_per_day","birthday","entry_date","id_cage"]; 

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
}); });


// SELECT ANIMAL WITH ID 

app.get('/animals/:id', function(req, res) { 

	var id = req.params.id; 

	var query= "SELECT * FROM animals "; 




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


	 query+=" WHERE id="+id;

	 console.log(query); 

	db.query(query, function(err, result, fields) {
		if (err) throw err;



	
		res.send(JSON.stringify(result));
}); });

// ADD ANIMAL  

app.post('/animals',function(req,res){

var name = req.body.name;
var  breed = req.body.breed; 
var food_per_day = req.body.food_per_day;
var id_cage = req.body.id_cage;
var birthday = req.body.birthday; 
var entry_date = req.body.entry_date; 


var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" + name + "','"+breed+"','"+food_per_day+"','"+birthday+"','"+entry_date+"',"+id_cage+")";
db.query(query, function(err, result, fields) {

if (err) throw err;
res.send(JSON.stringify("Success"));
}); });


// UPDATE ANimal
app.put('/animals/:id', function(req, res) {


var id = req.params.id; 
var name = req.body.name;
var breed = req.body.breed; 
var food_per_day = req.body.food_per_day;
var birthday = req.body.birthday;
var entry_date= req.body.entry_date;
var id_cage = req.body.id_cage;

var query = "UPDATE animals SET id="+id; 

if ("name" in req.body)
{

query+=", name = '"+name+"'"; 

} 
if ("breed" in req.body)
{

query+=", breed = '"+breed+"'"; 

} 
if ("food_per_day" in req.body)
{

query+=", food_per_day = '"+food_per_day+"'"; 

} 
if ("birthday" in req.body)
{

query+=", birthday = '"+birthday+"'"; 

} 
if ("entry_date" in req.body)
{

query+=", entry_date = '"+entry_date+"'"; 

} 
if ("id_cage" in req.body)
{

query+=", id_cage = '"+id_cage+"'"; 

} 
query+=" WHERE id="+id;

console.log(query);

	
db.query(query, function(err,result,fields) {
if (err) throw err; 
res.send(JSON.stringify("Success")); 

});
});


// DELETE ALL animal
app.delete('/animals', function(req, res) {

var query = "DELETE FROM animals";

db.query(query, function(err, result, fields) {

if (err) throw err;
res.send(JSON.stringify("Success"));

});});


// DELETE animal BY ID 
app.delete('/animals/:id', function(req, res) {

var ID = req.params.id;
var query = "DELETE FROM animals WHERE id=" + ID;
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});});


// GET / POST / PUT / DELETE FOR Cage -------------------------------------------------------------------------------------------------------------------------------


//SELECT ALL Cage

app.get('/cages', function(req, res) {


var query="SELECT * from cages"; 

// SELECT BY conditions 

var conditions = ["name","description","area"]; 

for(var index in conditions){

	if(conditions[index] in req.query)
	{
		if(query.indexOf("WHERE")<0)
		{
		 query +=" WHERE"; 
		}
		else{

		query +=" AND"; 
		}
		query+=" " + conditions[index] + "='"+req.query[conditions[index]]+"'"; 
	}
}
console.log(query); 
//BY ORDER BY 

if ("sort" in req.query) {

		var sort = req.query["sort"].split(",");

		query += " ORDER BY";
		console.log(query); 
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

console.log(query); 


//FILTRE BY FIelds

if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}

console.log(query); 

//FILTRE BY Pagination


if ("limit" in req.query) {

query += " LIMIT " + req.query["limit"];

	if ("offset" in req.query) {
		query += " OFFSET " + req.query["offset"];
	}
}

console.log(query); 




	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
}); });


// SELECT CAGE WITH ID 

app.get('/cages/:id', function(req, res) { 

	var id = req.params.id; 

	var query= "SELECT * FROM cages "; 




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


	 query+=" WHERE id="+id;

	 console.log(query); 

	db.query(query, function(err, result, fields) {
		if (err) throw err;



	
		res.send(JSON.stringify(result));
}); });



app.get('/cages/:id/animals', function(req, res) {

	var id = req.params.id; 
	var query= "SELECT name,breed,id_cage FROM animals WHERE id_cage="+id; 

	db.query(query, function(err, result, fields) {
		if (err) throw err;

	
		res.send(JSON.stringify(result));
}); });



// ADD cage  

app.post('/cages',function(req,res){

var name = req.body.name;
var  description= req.body.description; 
var area = req.body.area;



var query = "INSERT INTO cages (name,description,area) VALUES ('" + name + "','"+description+"',"+area+")";
db.query(query, function(err, result, fields) {

if (err) throw err;
res.send(JSON.stringify("Success"));
}); });


// UPDATE Cage
app.put('/cages/:id', function(req, res) {


var ID = req.params.id; 
var name = req.body.name; 
var description = req.body.description; 
var area = req.body.area; 

var query = "UPDATE cages SET id="+ID; 

if ("name" in req.body)
{

query+=", name = '"+name+"'"; 

} 
if ("description" in req.body)
{

query+=", description = '"+description+"'"; 

} 
if ("area" in req.body)
{

query+=", area = '"+area+"'"; 

}  


query+=" WHERE id="+ID;

console.log(query);

	console.log(query);
db.query(query, function(err,result,fields) {
if (err) throw err; 
res.send(JSON.stringify("Success")); 

});
});

// DELETE ALL cage
app.delete('/cages', function(req, res) {

var query = "DELETE FROM cages";

db.query(query, function(err, result, fields) {

if (err) throw err;
res.send(JSON.stringify("Success"));

});});


// DELETE cage BY ID 
app.delete('/cages/:id', function(req, res) {

var ID = req.params.id;
var query = "DELETE FROM cages WHERE id=" + ID;
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});});


// GET / POST / PUT / DELETE FOR Foood -------------------------------------------------------------------------------------------------------------------------------


//SELECT ALL Food
app.get('/food', function(req, res) {


var query="SELECT * from food"; 

// SELECT BY conditions 

var conditions = ["name","quantity","id_animal"]; 

for(var index in conditions){

	if(conditions[index] in req.query)
	{
		if(query.indexOf("WHERE")<0)
		{
		 query +=" WHERE"; 
		}
		else{

		query +=" AND"; 
		}
		query+=" " + conditions[index] + "='"+req.query[conditions[index]]+"'"; 
	}
}
console.log(query); 
//BY ORDER BY 

if ("sort" in req.query) {

		var sort = req.query["sort"].split(",");

		query += " ORDER BY";
		console.log(query); 
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

console.log(query); 


//FILTRE BY FIelds

if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}

console.log(query); 

//FILTRE BY Pagination


if ("limit" in req.query) {

query += " LIMIT " + req.query["limit"];

	if ("offset" in req.query) {
		query += " OFFSET " + req.query["offset"];
	}
}

console.log(query); 




	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
}); });


// SELECT FOOD WITH ID 

app.get('/food/:id', function(req, res) { 

	var id = req.params.id; 

	var query= "SELECT * FROM food "; 




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


	 query+=" WHERE id="+id;

	 console.log(query); 

	db.query(query, function(err, result, fields) {
		if (err) throw err;



	
		res.send(JSON.stringify(result));
}); });



// ADD food  

app.post('/food',function(req,res){

var name = req.body.name;
var  id_animal= req.body.id_animal; 
var quantity = req.body.quantity;



var query = "INSERT INTO food (name,quantity,id_animal) VALUES ('" + name + "','"+quantity+"',"+id_animal+")";
db.query(query, function(err, result, fields) {

if (err) throw err;
res.send(JSON.stringify("Success"));
}); });


// UPDATE food
app.put('/food/:id', function(req, res) {

var ID = req.params.id; 
var name = req.body.name; 
var quantity = req.body.quantity; 
var id_animal = req.body.id_animal; 

var query = "UPDATE food SET id="+ID; 

if ("name" in req.body)
{

query+=", name = '"+name+"'"; 

} 
if ("quantity" in req.body)
{

query+=", quantity = '"+quantity+"'"; 

} 
if ("id_animal" in req.body)
{

query+=",id_animal = '"+id_animal+"'"; 

}  
query+=" WHERE id="+ID;



	console.log(query);
db.query(query, function(err,result,fields) {
if (err) throw err; 
res.send(JSON.stringify("Success")); 

});
});

// DELETE ALL food
app.delete('/food', function(req, res) {

var query = "DELETE FROM food";

db.query(query, function(err, result, fields) {

if (err) throw err;
res.send(JSON.stringify("Success"));

});});


// DELETE food BY ID 
app.delete('/food/:id', function(req, res) {

var ID = req.params.id;
var query = "DELETE FROM food WHERE id=" + ID;
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});});


// GET / POST / PUT / DELETE FOR STAFF -------------------------------------------------------------------------------------------------------------------------------


//SELECT ALL STAFF

app.get('/staff', function(req, res) {

var query="SELECT * from staff"; 

// SELECT BY conditions 

var conditions = ["firstname","lastname","wage"]; 

for(var index in conditions){

	if(conditions[index] in req.query)
	{
		if(query.indexOf("WHERE")<0)
		{
		 query +=" WHERE"; 
		}
		else{

		query +=" AND"; 
		}
		query+=" " + conditions[index] + "='"+req.query[conditions[index]]+"'"; 
	}
}
console.log(query); 
//BY ORDER BY 

if ("sort" in req.query) {

		var sort = req.query["sort"].split(",");

		query += " ORDER BY";
		console.log(query); 
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

console.log(query); 


//FILTRE BY FIelds

if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}

console.log(query); 

//FILTRE BY Pagination


if ("limit" in req.query) {

query += " LIMIT " + req.query["limit"];

	if ("offset" in req.query) {
		query += " OFFSET " + req.query["offset"];
	}
}

console.log(query); 




	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
}); });


// SELECT STAFF WITH ID 


app.get('/staff/:id', function(req, res) { 

	var id = req.params.id; 

	var query= "SELECT * FROM staff "; 




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


	 query+=" WHERE id="+id;

	 console.log(query); 

	db.query(query, function(err, result, fields) {
		if (err) throw err;



	
		res.send(JSON.stringify(result));
}); });



// ADD staff

app.post('/staff',function(req,res){

var firstName = req.body.firstname;
var  lastName= req.body.lastname; 
var wage = req.body.wage;



var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('" +firstName + "','"+lastName+"',"+wage+")";
db.query(query, function(err, result, fields) {

if (err) throw err;
res.send(JSON.stringify("Success"));
}); });


// UPDATE staff
app.put('/staff/:id', function(req, res) {

 
var ID = req.params.id; 
var firstname = req.body.firstname; 
var lastname = req.body.lastname; 
var wage = req.body.wage; 

var query = "UPDATE staff SET id="+ID; 

if ("firstname" in req.body)
{

query+=", firstname = '"+firstname+"'"; 

} 
if ("lastname" in req.body)
{

query+=", lastname = '"+lastname+"'"; 

} 
if ("wage" in req.body)
{

query+=", wage = '"+wage+"'"; 

}  
query+=" WHERE id="+ID;

console.log(query);

	console.log(query);
db.query(query, function(err,result,fields) {
if (err) throw err; 
res.send(JSON.stringify("Success")); 

});
});





// DELETE ALL staff
app.delete('/staff', function(req, res) {

var query = "DELETE FROM staff";

db.query(query, function(err, result, fields) {

if (err) throw err;
res.send(JSON.stringify("Success"));

});});


// DELETE staff BY ID 
app.delete('/staff/:id', function(req, res) {

var ID = req.params.id;
var query = "DELETE FROM staff WHERE id=" + ID;
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});});

// GET / POST / PUT / RELATION ANIMAL CAGES---------------------------------------------------------------------------------

















// GET / POST / PUT / FOOD-STAT-------------------------------------------------------------------------------------------------------------------------------


app.get('/food-stats', function(req, res) {

	db.query("SELECT animals.id,CASE WHEN animals.food_per_day =0 THEN 0 ELSE food.quantity/animals.food_per_day END as days_left FROM food INNER JOIN animals ON food.id_animal=animals.id", function(err, result, fields) {
		if (err) throw err;


		res.send(JSON.stringify(result));
}); });



app.listen(3000, function() {

	db.connect(function(err) {
	if (err) throw err;
	console.log('Connection to database successful!');
	});
	console.log('Example app listening on port 3000!');
});


