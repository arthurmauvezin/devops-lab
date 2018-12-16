
const express = require ( 'express' );
const mysql = require ('mysql');
const bodyParser = require ( 'body-parser' );
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password : process.env.MYSQL_PASSWORD,
	database : process.env.MYSQL_DATABASE,
	port : process.env.MYSQL_PORT

});

//FIREWALL
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
            	res.status(403).send("Access denied");             
            }         
        });     
    } else {         
    	res.status(403).send("Access denied");     
    }
 
});


//ROADS FOR INSERT
//In animals table :
app.post('/animals', function(req,res) {
	var name = req.body.name;
	var breed = req.body.breed;
	var food = req.body.food_per_day;
	var birthday = req.body.birthday;
	var date = req.body.entry_date;
	var cage = req.body.id_cage;
	var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('" + name + "','" + breed + "'," + food +",'" +birthday+"','" +date+"'," +cage+ ")"; 
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//In cages table :
app.post('/cages', function(req,res) {
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	var query = "INSERT INTO cages (name, description, area) VALUES ('" + name + "','" + description + "'," + area +")"; 
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//In food table :
app.post('/food', function(req,res) {
	var name = req.body.name;
	var quantity = req.body.quantity;
	var animal = req.body.id_animal;
	var query = "INSERT INTO food (name, quantity, id_animal) VALUES ('" + name + "'," + quantity + "," + animal +")"; 
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//In staff table :
app.post('/staff', function(req,res) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('" + firstname + "','" + lastname + "'," + wage +")"; 
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});



//GET METHODS :
//FILTERS :
app.get('/query', function(req, res) {     res.send(JSON.stringify(req.query)); });


//ROADS FOR READ 
//For animals : ALL DATA
app.get('/animals', function(req, res) {     
	var query = "SELECT * FROM animals";    
	var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"]; 

	//SELECTION
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

    //SORTING
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

    //FILTERING
    if ("fields" in req.query) {         
    	query = query.replace("*", req.query["fields"]);     
    }

    //PAGINATION
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

//FOR ANIMALS : ONE DATA
app.get('/animals/:id', function(req,res) {
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id = " + id; 
	var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"]; 

	//SELECTION
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

    //SORTING 
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

    //FILTERING
    if ("fields" in req.query) {         
    	query = query.replace("*", req.query["fields"]);     
    }

    //PAGINATION
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


//FOR CAGES : ALL DATA
app.get('/cages', function(req,res) {
	var query = "SELECT * FROM cages";    
	var conditions = ["id", "name", "description", "area"]; 

	//SELECTION
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

    //SORTING 
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

    //FILTERING
    if ("fields" in req.query) {         
    	query = query.replace("*", req.query["fields"]);     
    }

    //PAGINATION
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


//FOR CAGES : ONE DATA
app.get('/cages/:id', function(req,res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id = " + id; 
	var conditions = ["id", "name", "description", "area"]; 

	//SELECTION
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

    //SORTING
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

    //FILTERING
    if ("fields" in req.query) {         
    	query = query.replace("*", req.query["fields"]);     
    }

    //PAGINATION
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



//For food : ALL DATA
app.get('/food', function(req,res) {
	var query = "SELECT * FROM food";    
	var conditions = [ "id", "name", "quantity", "id_animal"]; 

	//SELECTION
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

    //SORTING 
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

    //FILTERING
    if ("fields" in req.query) {         
    	query = query.replace("*", req.query["fields"]);     
    }

    //PAGINATION
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

//FOR FOOD : ONE DATA
app.get('/food/:id', function(req,res) {
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id = " + id; 
	var conditions = [ "id", "name", "quantity", "id_animal"]; 

	//SELECTION
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

    //SORTING
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

    //FILTERING
    if ("fields" in req.query) {         
    	query = query.replace("*", req.query["fields"]);     
    }

    //PAGINATION
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


//For staff : ALL DATA
app.get('/staff', function(req,res) {
	var query = "SELECT * FROM staff";    
	var conditions = ["id", "firstname", "lastname", "wage"]; 

	//SELECTION
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

    //SORTING
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

    //FILTERING
    if ("fields" in req.query) {         
    	query = query.replace("*", req.query["fields"]);     
    }

    //PAGINATION
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

//FOR STAFF : ONE DATA
app.get('/staff/:id', function(req,res) {
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id = " + id; 
	var conditions = ["id", "firstname", "lastname", "wage"]; 

	//SELECTION
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

    //SORTING
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

    //FILTERING
    if ("fields" in req.query) {         
    	query = query.replace("*", req.query["fields"]);     
    }

    //PAGINATION
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


///Methods to read relations
//RELATION CAGES IN ANIMALS
//1st one : Obtain all informations of every cage, through the ID of an animal
app.get('/animals/:id/cages', function(req,res) {
	var id = req.params.id;
	var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON cages.id = animals.id_cage WHERE animals.id=" + id; 
	var conditions = ["id", "name", "description", "area"]; 

	//SELECTION
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

    //FILTERING
    if ("fields" in req.query) {         
    	query = query.replace("cages.id, cages.name, cages.description, cages.area", req.query["fields"]);     
    }

    //PAGINATION
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

//2nd one : Obtain informations of one particular cage, through the ID of an animal 
app.get('/animals/:id_animals/cages/:id_cages', function(req,res) {
	var id_cages = req.params.id_cages;
	var id_animals = req.params.id_animals;
	var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON cages.id = animals.id_cage WHERE cages.id=" + id_cages + " AND animals.id=" + id_animals; 
	var conditions = ["id", "name", "description", "area"]; 

	//SELECTION
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

    //FILTERING
    if ("fields" in req.query) {         
    	query = query.replace("cages.id, cages.name, cages.description, cages.area", req.query["fields"]);     
    }

    //PAGINATION
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

//3rd one : Obtain all informations of every animals, through the ID of a cage 
app.get('/cages/:id/animals', function(req,res) {
	var id = req.params.id;
	var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date FROM animals INNER JOIN cages ON cages.id = animals.id_cage WHERE cages.id=" + id; 
	var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"]; 

	//SELECTION
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

    //FILTERING
    if ("fields" in req.query) {         
    	query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date", req.query["fields"]);     
    }

    //PAGINATION
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




//RELATION ANIMALS - FOOD
//1st one : Obtain all informations of food, through the ID of an animal
app.get('/animals/:id/food', function(req,res) {
	var id = req.params.id;
	var query = "SELECT food.id, food.name, food.quantity, food.id_animal FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE animals.id=" + id; 
	var conditions = ["id", "name", "quantity", "id_animal"]; 

	//SELECTION
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

    //FILTERING
    if ("fields" in req.query) {         
    	query = query.replace("food.id, food.name, food.quantity, food.id_animal", req.query["fields"]);     
    }

    //PAGINATION
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

//2nd one : Obtain all information of one particular animal, through the ID food 
app.get('/food/:id_food/animals/:id_animals', function(req,res) {
	var id_food = req.params.id_food;
	var id_animals = req.params.id_animals;
	var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE food.id=" + id_food + " AND animals.id=" + id_animals; 
	var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"]; 

	//SELECTION
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

    //FILTERING
    if ("fields" in req.query) {         
    	query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", req.query["fields"]);     
    }

    //PAGINATION
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

//3rd one : Obtain all informations of animals, through the ID of a food
app.get('/food/:id/animals', function(req,res) {
	var id = req.params.id;
	var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE food.id=" + id; 
	var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"]; 

	//SELECTION
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

    //FILTERING
    if ("fields" in req.query) {         
    	query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date", req.query["fields"]);     
    }

    //PAGINATION
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


//FOOD STATS road
app.get('/food-stats', function(req,res) {
	var query = "SELECT animals.id, " 
	query += "(CASE WHEN (food.quantity/animals.food_per_day) IS NULL THEN 0 ELSE (food.quantity/animals.food_per_day) END) as days_left " 
	query += "FROM food INNER JOIN animals ON food.id_animal = animals.id";    
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});




//Roads for UPDATE (total and partial)
app.put('/animals/:id', function(req,res) {
	var id = req.params.id;
	var name = req.body.name;
	var breed = req.body.breed;
	var food = req.body.food_per_day;
	var birthday = req.body.birthday;
	var date = req.body.entry_date;
	var cage = req.body.id_cage;
	var query = "UPDATE animals SET " + "name = (CASE WHEN ? IS NULL THEN name ELSE ? END), " + "breed = (CASE WHEN ? IS NULL THEN breed ELSE ? END), " + "food_per_day = (CASE WHEN ? IS NULL THEN food_per_day ELSE ? END), " + "birthday = (CASE WHEN ? IS NULL THEN birthday ELSE ? END), " + "entry_date = (CASE WHEN ? IS NULL THEN entry_date ELSE ? END), " + "id_cage = (CASE WHEN ? IS NULL THEN id_cage ELSE ? END) " + "WHERE id = " + id;
	db.query(query, [name, name, breed, breed, food, food, birthday, birthday, date, date, cage, cage], function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.put('/cages/:id', function(req,res) {
	var id = req.params.id;
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	var query = "UPDATE cages SET " + "name = (CASE WHEN ? IS NULL THEN name ELSE ? END), " + "description = (CASE WHEN ? IS NULL THEN description ELSE ? END), " + "area = (CASE WHEN ? IS NULL THEN area ELSE ? END) " + "WHERE id = " + id;
	db.query(query, [name, name, description, description, area, area], function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


app.put('/food/:id', function(req,res) {
	var id = req.params.id;
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;
	var query = "UPDATE food SET " + "name = (CASE WHEN ? IS NULL THEN name ELSE ? END), " + "quantity = (CASE WHEN ? IS NULL THEN quantity ELSE ? END), " + "id_animal = (CASE WHEN ? IS NULL THEN id_animal ELSE ? END) " + "WHERE id ="+id;
	db.query(query, [name, name, quantity, quantity, id_animal, id_animal], function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.put('/staff/:id', function(req,res) {
	var id = req.params.id;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var query = "UPDATE staff SET " + "firstname = (CASE WHEN ? IS NULL THEN firstname ELSE ? END), " + "lastname = (CASE WHEN ? IS NULL THEN lastname ELSE ? END), " + "wage = (CASE WHEN ? IS NULL THEN wage ELSE ? END) " + "WHERE id = " + id;
	db.query(query, [firstname, firstname, lastname, lastname, wage, wage], function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});




//Roads for DELETE (total and partial)
app.delete('/animals', function(req,res) {
	var query = "DELETE FROM animals";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/cages', function(req,res) {
	var query = "DELETE FROM cages";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/food', function(req,res) {
	var query = "DELETE FROM food";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/staff', function(req,res) {
	var query = "DELETE FROM staff";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/animals/:id', function(req,res) {
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id =" +id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/cages/:id', function(req,res) {
	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id =" +id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/food/:id', function(req,res) {
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id =" +id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/staff/:id', function(req,res) {
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id =" +id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});





app.listen( 3000 , function () {
db.connect( function (err) {
if (err) throw err;
console.log( 'Connection to database successful!' );
});
console.log( 'Example app listening on port 3000!' );
});

