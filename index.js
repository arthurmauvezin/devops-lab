const express = require('express');
const mysql = require('mysql');
const app = express();

const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));


var db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "project",
	port: "3306"
});

//UPDATE UN-PAR-UN OU PLUSIEURS - Fait
//FAIRE LE FILTRE SUR FOOD-STATS - Fait

////////////////////////////////////////////////////////
//						CONSOLE log 				  //
////////////////////////////////////////////////////////

//AFFICHE LES REQUETES DEMANDEES

app.use(function(req,res,next){
	console.log("Requete : ",req.method,req.originalUrl,req.query);
	if(req.body.constructor === Object && Object.keys(req.body).length === 0){
	}
	else{
		console.log("	Body : ",req.body);
	}
	next();
})

/////////////////////////////////////////////////////////
//						PARE FEU					  //
////////////////////////////////////////////////////////

app.use(function(req, res, next) {
	if ("key" in req.query) {
		var key = req.query["key"];
		var query = "SELECT * FROM users WHERE apikey='" + key + "'";
		db.query(query, function(err, result, fields) {
			if (err) throw err;
			if (result.length > 0) {
				next();
			} else {
				res.status(403);
				res.send("403 Forbidden");
			}
		});
	} else {
		res.status(403);
		res.send("403 Forbidden");
	}
});

/////////////////////////////////////////////////////////
//                     PARTIE ANIMAL          	       //
////////////////////////////////////////////////////////

app.post('/animals', function(req, res) {
	var name=req.body.name
	var breed=req.body.breed
	var food_per_day=req.body.food_per_day
	var birthday=req.body.birthday
	var entry_date=req.body.entry_date
	var id_cage=req.body.id_cage
	var query="INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('"+name+"','"+breed+"','"+food_per_day+"','"+birthday+"','"+entry_date+"','"+id_cage+"')";
	db.query(query,function(err,result,fields){
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.get('/animals', function(req, res) {
	var query="SELECT * FROM animals"
	/////////////////////////////////////////////////
	var conditions = ["id", "id_cage","name","breed","food_per_day","birthday","entry_date"];
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
		} query = query.slice(0, -1);
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
	/////////////////////////////////////////////////
	db.query(query,function(err,result,fields){
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
app.get('/animals/:id', function(req, res) {
	var id=req.params.id;
	var query = "SELECT * FROM animals WHERE id=" + id;
	/////////////////////////////////////////////////
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	/////////////////////////////////////////////////
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
app.get('/animals/:id/food', function(req, res) {
	var id=req.params.id;
	var query = "SELECT * FROM animals INNER JOIN food ON animals.id=food.id_animal WHERE animals.id=" + id;
	/////////////////////////////////////////////////
	var conditions = ["id","name","id_animal","quantity"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			query += " AND food.";
			query += conditions[index] + "='" +
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
		} query = query.slice(0, -1);
	}

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	else{
		query = query.replace("*", "food.id,food.name,food.quantity");
	}


	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	/////////////////////////////////////////////////
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
// app.get('/animals/:id_animal/food/:id_food', function(req, res) {
// 	var id_animal=req.params.id_animal;
// 	var id_food=req.params.id_food;
// 	var query = "SELECT * FROM animals INNER JOIN food ON animals.id=food.id_animal WHERE food.id_animal= " + id_animal + " AND food.id=" +id_food;
// 	/////////////////////////////////////////////////
// 	if ("fields" in req.query) {
// 		query = query.replace("*", req.query["fields"]);
// 	}
// 	else{
// 		query = query.replace("*", "food.id,food.name,food.quantity");
// 	}
// 	/////////////////////////////////////////////////
// 	db.query(query, function(err, result, fields) {
// 		if (err) throw err;
// 		res.send(JSON.stringify(result));
// 	});
// });
app.get('/animals/:id/cages', function(req, res) {
	var id=req.params.id;
	var query = "SELECT * FROM cages INNER JOIN animals ON cages.id=animals.id_cage WHERE animals.id=" + id;
	/////////////////////////////////////////////////
	var conditions = ["id","name","description","area"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			query += " AND cages.";
			query += conditions[index] + "='" +
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
		} query = query.slice(0, -1);
	}

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	else{
		query = query.replace("*", "cages.id,cages.name,cages.description,cages.area");
	}

	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	/////////////////////////////////////////////////
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
app.get('/animals/:id_animal/cages/:id_cage', function(req, res) {
	var id_cage=req.params.id_cage;
	var id_animal=req.params.id_animal;
	var query = "SELECT * FROM cages INNER JOIN animals ON cages.id=animals.id_cage WHERE cages.id=" + id_cage + " AND animals.id= " + id_animal;
	/////////////////////////////////////////////////
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	else{
		query = query.replace("*", "cages.id,cages.name,cages.description,cages.area");
	}
	/////////////////////////////////////////////////
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.put('/animals/:id', function(req, res) {
	var id = req.params.id;
	var query = "UPDATE animals SET ";
	var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
	var i=0;
	for (var index in conditions) {
		if (conditions[index] in req.body) {
			if (i==0) {
				query += "";
				i+=1;
			} else {
				query += " , ";
			} 
			query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";
		}
	}
	query += " WHERE id="+ id;
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

////////////////////////////////////////////////////////
//                     PARTIE CAGES              	  //
////////////////////////////////////////////////////////

app.post('/cages', function(req, res) {
	var name=req.body.name
	var description=req.body.description
	var area=req.body.area
	var query="INSERT INTO cages (name,description,area) VALUES ('"+name+"','"+description+"','"+area+"')";
	db.query(query,function(err,result,fields){
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.get('/cages', function(req, res) {
	var query="SELECT * FROM cages"
	/////////////////////////////////////////////////
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
		} query = query.slice(0, -1);
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
	/////////////////////////////////////////////////
	db.query(query,function(err,result,fields){
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
app.get('/cages/:id', function(req, res) {
	var id=req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;
	/////////////////////////////////////////////////
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	/////////////////////////////////////////////////
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
app.get('/cages/:id/animals', function(req, res) {
	var id=req.params.id;
	var query = "SELECT * FROM cages INNER JOIN animals ON cages.id=animals.id_cage WHERE cages.id=" + id;
	/////////////////////////////////////////////////
	var conditions = ["id","id_cage","name","breed","food_per_day","birthday","entry_date"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			query += " AND animals.";
			query += conditions[index] + "='" +
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
		} query = query.slice(0, -1);
	}

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	else{
		query = query.replace("*", "animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date");
	}

	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	/////////////////////////////////////////////////
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
// app.get('/cages/:id_cage/animals/:id_animal', function(req, res) {
// 	var id_cage=req.params.id_cage;
// 	var id_animal=req.params.id_animal;
// 	var query = "SELECT * FROM cages INNER JOIN animals ON cages.id=animals.id_cage WHERE cages.id=" + id_cage + " AND animals.id= " + id_animal;
// 	/////////////////////////////////////////////////
// 	if ("fields" in req.query) {
// 		query = query.replace("*", req.query["fields"]);
// 	}
// 	else{
// 		query = query.replace("*", "animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date");
// 	}
// 	/////////////////////////////////////////////////
// 	db.query(query, function(err, result, fields) {
// 		if (err) throw err;
// 		res.send(JSON.stringify(result));
// 	});
// });

app.put('/cages/:id', function(req, res) {
	var id = req.params.id;
	var query = "UPDATE cages SET ";
	var conditions = ["name", "description","area"];
	var i=0;

	for (var index in conditions) {

		if (conditions[index] in req.body) {
			if (i==0) {
				query += "";
				i+=1;
			} else {
				query += " , ";
			} 
			query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";
		}
	}
	query += " WHERE id="+ id;
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

////////////////////////////////////////////////////////
//                     PARTIE NOURRITURE          	  //
////////////////////////////////////////////////////////

app.post('/food', function(req, res) {
	var name=req.body.name
	var id_animal=req.body.id_animal
	var quantity=req.body.quantity
	var query="INSERT INTO food (name,id_animal,quantity) VALUES ('"+name+"','"+id_animal+"','"+quantity+"')";
	db.query(query,function(err,result,fields){
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.get('/food', function(req, res) {
	var query="SELECT * FROM food"
	/////////////////////////////////////////////////
	var conditions = ["id","name","id_animal","quantity"];
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
		} query = query.slice(0, -1);
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
	/////////////////////////////////////////////////
	db.query(query,function(err,result,fields){
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
app.get('/food/:id', function(req, res) {
	var id=req.params.id;
	var query = "SELECT * FROM food WHERE id=" + id;
	/////////////////////////////////////////////////
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	/////////////////////////////////////////////////
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
app.get('/food/:id/animals', function(req, res) {
	var id=req.params.id;
	var query = "SELECT * FROM animals INNER JOIN food ON animals.id=food.id_animal WHERE food.id=" + id;
	/////////////////////////////////////////////////
	var conditions = ["id","id_cage","name","breed","food_per_day","birthday","entry_date"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			query += " AND animals.";
			query += conditions[index] + "='" +
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
		} query = query.slice(0, -1);
	}

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	else{
		query = query.replace("*", "animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date");
	}

	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	/////////////////////////////////////////////////
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
app.get('/food/:id_food/animals/:id_animal', function(req, res) {
	var id_animal=req.params.id_animal;
	var id_food=req.params.id_food;
	var query = "SELECT * FROM food INNER JOIN animals ON animals.id=food.id_animal WHERE animals.id= " + id_animal + " AND food.id=" +id_food;
	/////////////////////////////////////////////////
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	else{
		query = query.replace("*", "animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date");
		// query = "SELECT food.id,food.name,food.quantity,food.id_animal FROM animals INNER JOIN food ON animals.id=food.id_animal WHERE animals.id= " + id_animal + " AND food.id=" +id_food;
	}
	/////////////////////////////////////////////////
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.put('/food/:id', function(req, res) {
	var id = req.params.id;
	var query = "UPDATE food SET ";
	var conditions = ["name", "quantity","id_animal"];
	var i=0;
	for (var index in conditions) {

		if (conditions[index] in req.body) {
			if (i==0) {
				query += "";
				i+=1;
			} else {
				query += " , ";
			} 
			query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";
		}
	}
	query += " WHERE id="+ id;
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

////////////////////////////////////////////////////////
//                     PARTIE PERSONNEL            	  //
////////////////////////////////////////////////////////

app.post('/staff', function(req, res) {
	var firstname=req.body.firstname
	var lastname=req.body.lastname
	var wage=req.body.wage
	var query="INSERT INTO staff (firstname,lastname,wage) VALUES ('"+firstname+"','"+lastname+"','"+wage+"')";
	db.query(query,function(err,result,fields){
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.get('/staff', function(req, res) {
	var query="SELECT * FROM staff"
	/////////////////////////////////////////////////
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
		} query = query.slice(0, -1);
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
	/////////////////////////////////////////////////
	db.query(query,function(err,result,fields){
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
app.get('/staff/:id', function(req, res) {
	var id=req.params.id;
	var query = "SELECT * FROM staff WHERE id=" + id;
	/////////////////////////////////////////////////
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	/////////////////////////////////////////////////
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.put('/staff/:id', function(req, res) {
	var id = req.params.id;
	var query = "UPDATE staff SET ";
	var conditions = ["firstname", "lastname","wage"];
	var i=0;
	for (var index in conditions) {
		if (conditions[index] in req.body) {
			if (i==0) {
				query += "";
				i+=1;
			} else {
				query += " , ";
			} 
			query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";
		}
	}
	query += " WHERE id="+ id;
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

////////////////////////////////////////////
// 				FOOD STATS				  //
////////////////////////////////////////////

app.get('/food-stats', function(req, res) {
	var query="select animals.id, quantity/food_per_day as days_left from animals join food on animals.id=food.id_animal"
	
	db.query(query,function(err,result,fields){
		if (err) throw err;
		var stringified=JSON.stringify(result);
		stringified=stringified.replace(/null/g,0);

		res.send(stringified);
		// console.log(result.length);
		// console.log("lol : "+array);
		// console.log(typeof array);
		
		// console.log("id : ",result[0].id);
		// console.log("days_left : ",result[0].days_left);
		// console.log(result[0]);
		// console.log(i);
		// // tableau+="id : "+result[0].id+' ';
		// // tableau+="days_left : "+result[0].days_left;
		// // res.send(tableau);
		
	});
	// var query2="select animals.id, quantity,food_per_day from animals join food on animals.id=food.id_animal"
	// db.query(query2,function(err,result,fields){
	// 	if (err) throw err;
	// 	var array = new Array();
	// 	for(var i=0; i < result.length;i++){
	// 		array.push(result[i].id);
	// 		array.push(result[i].quantity/result[i].food_per_day);
	// 	}
	// 	console.log(array);
	// });
});


///////////////////////////////////////////////////////

app.listen(3000, function() {
	db.connect(function(err) {
		if (err) throw err;
		console.log('Connection to database successful!');
	});
	console.log('Example app listening on port 3000!');
});
