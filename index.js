const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));


app.use(function(req,res,next){
	if("key" in req.query) {
		var key= req.query["key"];
		var query = "SELECT * FROM users WHERE apikey='" + key + "'";

		db.query(query, function(err, result, fields){
			if(err) throw err;

			if (result.length>0){
				next();
			}
			else {
				res.send("error",403);
			}
		});
	} else {
		res.send("error",403);
	}
});

var db = mysql.createConnection({     
	host: "localhost",    
	user: "root",     
	password: "",     
	database: "project",    
	port: "3306" }); 



//ANIMALS//
app.get('/animals', function(req, res) {
	var query = "SELECT * FROM animals";

	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 


	//FILTER : SELECTION
	var conditions = ["id","name","breed","food_per_day","birthday","entry_date","id_cage"]; 
    for (var index in conditions) {         
     	if (conditions[index] in req.query) {             
     		if (query.indexOf("WHERE") < 0) {                 
     			query += " WHERE";             
     		} 
     		else {                 
     			query += " AND";        
     		     } 
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";        
            }    
    }

    //FILTER : SORTING
	if("sort" in req.query){
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";

		for(var index in sort){
			var direction = sort[index].substr(0,1);
			var field = sort[index].substr(1);

			query+= " " + field;

			if(direction=="-")
				query+=" DESC,";
			else
				query+= " ASC,";
		}

		query = query.slice(0,-1);
	}

	//FILTER : FILTERING
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//FILTER : PAGINATION
	if ("limit" in req.query){
		query +=" LIMIT " + req.query["limit"];

		if("offset" in req.query){
			query+= " OFFSET " + req.query["offset"];
		}
	}

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));

 
	});
});


app.post('/animals', function(req, res){
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;
	var query = "INSERT INTO animals(name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('"+ name + "','" + breed + "'," + food_per_day + ",'" + birthday + "','" + entry_date + "'," + id_cage + ")";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


app.get('/animals/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id=" + id;

	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}


	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


app.put('/animals/:id', function(req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;
	var query = "UPDATE animals SET id="+id;
	
	if("name" in req.body){
		query += ",name = '"+name +"' ";	
	}

	if("breed" in req.body){
		query += ",breed = '"+breed +"' ";
	}

	if("food_per_day" in req.body){
		query += ",food_per_day = "+food_per_day;	
	}

	if("birthday" in req.body){
		query += ",birthday = '"+birthday+ "' ";	
	}

	if("entry_date" in req.body){
		query += ",entry_date = '"+entry_date+"' ";	
	}

	if("id_cage" in req.body){
		query += ",id_cage = "+id_cage;		
	}

	query += " WHERE id="+id;


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





//CAGES//
app.get('/cages', function(req, res) {
	var query = "SELECT * FROM cages";

	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 


	//FILTER : SELECTION
	var conditions = ["id","name","description","area"]; 
    for (var index in conditions) {         
     	if (conditions[index] in req.query) {             
     		if (query.indexOf("WHERE") < 0) {                 
     			query += " WHERE";             
     		} 
     		else {                 
     			query += " AND";        
     		     } 
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";        
            }    
    }

    //FILTER : SORTING
	if("sort" in req.query){
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";

		for(var index in sort){
			var direction = sort[index].substr(0,1);
			var field = sort[index].substr(1);

			query+= " " + field;

			if(direction=="-")
				query+=" DESC,";
			else
				query+= " ASC,";
		}

		query = query.slice(0,-1);
	}

	//FILTER : FILTERING
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//FILTER : PAGINATION
	if ("limit" in req.query){
		query +=" LIMIT " + req.query["limit"];

		if("offset" in req.query){
			query+= " OFFSET " + req.query["offset"];
		}
	}


	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


app.post('/cages', function(req, res) {
	var id = req.body.id;
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;

	var query = "INSERT INTO cages (name,description,area) VALUES ('" + name + "','" + description + "'," + area + ")";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


app.get('/cages/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;

	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.put('/cages/:id', function(req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	var query = "UPDATE cages SET id="+id;

	if("name" in req.body){
		query += ",name = '"+name +"' ";	
	}

	if("description" in req.body){
		query += ",description = '"+description +"' ";
	}

	if("area" in req.body){
		query += ",area = "+area;	
	}

	query += " WHERE id="+id;

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



//FOOD//
app.get('/food', function(req, res) {
	var query = "SELECT * FROM food";

	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 


	//FILTER : SELECTION
	var conditions = ["id","name","id_animal","quantity"]; 
    for (var index in conditions) {         
     	if (conditions[index] in req.query) {             
     		if (query.indexOf("WHERE") < 0) {                 
     			query += " WHERE";             
     		} 
     		else {                 
     			query += " AND";        
     		     } 
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";        
            }    
    }

    //FILTER : SORTING
	if("sort" in req.query){
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";

		for(var index in sort){
			var direction = sort[index].substr(0,1);
			var field = sort[index].substr(1);

			query+= " " + field;

			if(direction=="-")
				query+=" DESC,";
			else
				query+= " ASC,";
		}

		query = query.slice(0,-1);
	}

	//FILTER : FILTERING
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//FILTER : PAGINATION
	if ("limit" in req.query){
		query +=" LIMIT " + req.query["limit"];

		if("offset" in req.query){
			query+= " OFFSET " + req.query["offset"];
		}
	}


	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


app.post('/food', function(req, res) {
	var id = req.body.id;
	var name = req.body.name;
	var id_animal = req.body.id_animal;
	var quantity = req.body.quantity;
	var query = "INSERT INTO food (name,id_animal,quantity) VALUES ('"+ name + "'," + id_animal + "," + quantity + ")";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

	
app.get('/food/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id=" + id;

	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});



app.put('/food/:id', function(req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var id_animal = req.body.id_animal;
	var quantity = req.body.quantity;
	var query = "UPDATE food SET id="+id;

	if("name" in req.body){
		query += ",name = '"+name +"' ";	
	}

	if("id_animal" in req.body){
		query += ",id_animal = "+id_animal;
	}

	if("quantity" in req.body){
		query += ",quantity = "+quantity;	
	}

	query += " WHERE id="+id;

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




//STAFF//
app.get('/staff', function(req, res) {
	var query = "SELECT * FROM staff";

	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 


	//FILTER : SELECTION
	var conditions = ["id","firstname","lastname","wage"]; 
    for (var index in conditions) {         
     	if (conditions[index] in req.query) {             
     		if (query.indexOf("WHERE") < 0) {                 
     			query += " WHERE";             
     		} 
     		else {                 
     			query += " AND";        
     		     } 
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";        
            }    
    }

    //FILTER : SORTING
	if("sort" in req.query){
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";

		for(var index in sort){
			var direction = sort[index].substr(0,1);
			var field = sort[index].substr(1);

			query+= " " + field;

			if(direction=="-")
				query+=" DESC,";
			else
				query+= " ASC,";
		}

		query = query.slice(0,-1);
	}

	//FILTER : FILTERING
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//FILTER : PAGINATION
	if ("limit" in req.query){
		query +=" LIMIT " + req.query["limit"];

		if("offset" in req.query){
			query+= " OFFSET " + req.query["offset"];
		}
	}

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


app.post('/staff', function(req, res) {
	var id = req.body.id;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('" + firstname + "','" + lastname + "'," + wage + ")";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


app.get('/staff/:id', function(req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id=" + id;

	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.put('/staff/:id', function(req, res) {
	var id = req.params.id;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var query = "UPDATE staff SET id="+id;

	if("firstname" in req.body){
		query += ",firstname = '"+firstname +"' ";
	}

	if("lastname" in req.body){
		query += ",lastname = '"+lastname+"' ";	
	}

	if("wage" in req.body){
		query += ",wage = "+wage;	
	}

	query += " WHERE id="+id;

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


//FOOD-STAtS
app.get('/food-stats', function(req, res) {
	var query ="SELECT animals.id, CASE WHEN animals.food_per_day =0 THEN 0 ELSE food.quantity/animals.food_per_day END as days_left FROM food INNER JOIN animals ON food.id_animal=animals.id";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});



app.listen(3000, function(){     
	db.connect(function(err){        
	 if(err) throw err;        
	  console.log('Connection to database successful!');     
	}); 
	console.log('Example app listening on port 3000!'); 
});


//RELATION ANIMALS/CAGES

app.get('/cages/:id/animals',function(req,res) {     
	var id=req.params.id;

	var query= "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id="+id;
	

	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 


	//FILTER : SELECTION
	var conditions = ["id","name","breed","food_per_day","birthday","entry_date"]; 
    for (var index in conditions) {         
     	if (conditions[index] in req.query) {             
     		if (query.indexOf("WHERE") < 0) {                 
     			query += " WHERE";             
     		} 
     		else {                 
     			query += " AND";        
     		     } 
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";        
            }    
    }

    //FILTER : SORTING
	if("sort" in req.query){
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";

		for(var index in sort){
			var direction = sort[index].substr(0,1);
			var field = sort[index].substr(1);

			query+= " " + field;

			if(direction=="-")
				query+=" DESC,";
			else
				query+= " ASC,";
		}

		query = query.slice(0,-1);
	}

	//FILTER : FILTERING
	if ("fields" in req.query) {
		query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date", req.query["fields"]);
	}

	//FILTER : PAGINATION
	if ("limit" in req.query){
		query +=" LIMIT " + req.query["limit"];

		if("offset" in req.query){
			query+= " OFFSET " + req.query["offset"];
		}
	}



	db.query(query,function(err,result,fields){
		if(err) throw err; 
       	res.send(JSON.stringify(result));     
       	}); 
	});


app.get('/cages/:id/animals/:id_animal',function(req, res) {
	var id =req.params.id;
	var id_animal = req.params.id_animal;
	var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id+ " AND animals.id=" + id_animal;     
	
	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}	

	db.query(query, function(err, result, fields) {       
		if (err) throw err; 
       	res.send(JSON.stringify(result));     
       }); 
	}); 

app.get('/animals/:id/cages',function(req,res) {     
	var id=req.params.id;

	var query= "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id="+id;
	
	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 


	//FILTER : SELECTION
	var conditions = ["id","name","breed","description","area"]; 
    for (var index in conditions) {         
     	if (conditions[index] in req.query) {             
     		if (query.indexOf("WHERE") < 0) {                 
     			query += " WHERE";             
     		} 
     		else {                 
     			query += " AND";        
     		     } 
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";        
            }    
    }

    //FILTER : SORTING
	if("sort" in req.query){
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";

		for(var index in sort){
			var direction = sort[index].substr(0,1);
			var field = sort[index].substr(1);

			query+= " " + field;

			if(direction=="-")
				query+=" DESC,";
			else
				query+= " ASC,";
		}

		query = query.slice(0,-1);
	}

	//FILTER : FILTERING
	if ("fields" in req.query) {
		query = query.replace("cages.id, cages.name, cages.description, cages.area", req.query["fields"]);
	}

	//FILTER : PAGINATION
	if ("limit" in req.query){
		query +=" LIMIT " + req.query["limit"];

		if("offset" in req.query){
			query+= " OFFSET " + req.query["offset"];
		}
	}




	db.query(query,function(err,result,fields){
		if(err) throw err; 
       	res.send(JSON.stringify(result));     
       	}); 
	});

app.get('/animals/:id/cages/:id_cage',function(req, res) {
	var id =req.params.id;
	var id_cage = req.params.id_cage;
	var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id="+id+ " AND cages.id=" + id_cage; 

	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 

	if ("fields" in req.query) {
		query = query.replace("cages.id, cages.name, cages.description, cages.area", req.query["fields"]);
	}

	db.query(query, function(err, result, fields) {       
		if (err) throw err; 
       	res.send(JSON.stringify(result));     
       }); 
	}); 





//RELATION ANIMALS/FOOD

app.get('/animals/:id/food',function(req,res) {     
	var id=req.params.id;

	var query= "SELECT food.id, food.name, food.quantity FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id="+id;

	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 


	//FILTER : SELECTION
	var conditions = ["id","name","quantity"]; 
    for (var index in conditions) {         
     	if (conditions[index] in req.query) {             
     		if (query.indexOf("WHERE") < 0) {                 
     			query += " WHERE";             
     		} 
     		else {                 
     			query += " AND";        
     		     } 
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";        
            }    
    }

    //FILTER : SORTING
	if("sort" in req.query){
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";

		for(var index in sort){
			var direction = sort[index].substr(0,1);
			var field = sort[index].substr(1);

			query+= " " + field;

			if(direction=="-")
				query+=" DESC,";
			else
				query+= " ASC,";
		}

		query = query.slice(0,-1);
	}

	//FILTER : FILTERING
	if ("fields" in req.query) {
		query = query.replace("food.id, food.name, food.quantity", req.query["fields"]);
	}

	//FILTER : PAGINATION
	if ("limit" in req.query){
		query +=" LIMIT " + req.query["limit"];

		if("offset" in req.query){
			query+= " OFFSET " + req.query["offset"];
		}
	}


	db.query(query,function(err,result,fields){
		if(err) throw err; 
       	res.send(JSON.stringify(result));     
       	}); 
	});


app.get('/animals/:id/food/:id_food',function(req,res) {     
	var id=req.params.id;
	var id_food = req.params.id_food;
	var query= "SELECT food.id, food.name, food.quantity FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id="+id+ " AND food.id=" + id_food;
	
	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 

	if ("fields" in req.query) {
		query = query.replace("food.id, food.name, food.quantity", req.query["fields"]);
	}

	db.query(query,function(err,result,fields){
		if(err) throw err; 
       	res.send(JSON.stringify(result));     
       	}); 
	});



app.get('/food/:id/animals',function(req,res) {     
	var id=req.params.id;

	var query= "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id="+id;

	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 


	//FILTER : SELECTION
	var conditions = ["id","name","breed","food_per_day","birthday","entry_date"]; 
    for (var index in conditions) {         
     	if (conditions[index] in req.query) {             
     		if (query.indexOf("WHERE") < 0) {                 
     			query += " WHERE";             
     		} 
     		else {                 
     			query += " AND";        
     		     } 
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";        
            }    
    }

    //FILTER : SORTING
	if("sort" in req.query){
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";

		for(var index in sort){
			var direction = sort[index].substr(0,1);
			var field = sort[index].substr(1);

			query+= " " + field;

			if(direction=="-")
				query+=" DESC,";
			else
				query+= " ASC,";
		}

		query = query.slice(0,-1);
	}

	//FILTER : FILTERING
	if ("fields" in req.query) {
		query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date", req.query["fields"]);
	}

	//FILTER : PAGINATION
	if ("limit" in req.query){
		query +=" LIMIT " + req.query["limit"];

		if("offset" in req.query){
			query+= " OFFSET " + req.query["offset"];
		}
	}


	db.query(query,function(err,result,fields){
		if(err) throw err; 
       	res.send(JSON.stringify(result));     
       	}); 
	});

app.get('/food/:id/animals/:id_animal',function(req,res) {     
	var id=req.params.id;
	var id_animal=req.params.id_animal;
	var query= "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id="+id+ " AND animals.id="+id_animal;
	
	app.get('/query', function(req, res) {    
		res.send(JSON.stringify(req.query)); 
	}); 

	if ("fields" in req.query) {
		query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date", req.query["fields"]);
	}

	db.query(query,function(err,result,fields){
		if(err) throw err; 
       	res.send(JSON.stringify(result));     
       	}); 
	});




