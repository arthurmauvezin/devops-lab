const express = require('express'); 
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({ host: "localhost",
    user: "root",
    password: "root",
    database: "zoo",
    port: "8889" });

//jeton - sécurité
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
               res.send("erreur",403); 
           }
        }); 
    } else {
        res.send("erreur", 403); 
    }
});


app.get('/query', function(req, res) {
    res.send(JSON.stringify(req.query)); 
});



///////////\\\\\\\\\\\\\\\\\\\\ animals
app.get('/animals', function(req, res) {
    var query = "SELECT * FROM animals" ;
    
    var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    for (var index in conditions) {
        if (conditions[index] in req.query) {
           if (query.indexOf("WHERE") < 0) { 
               query += " WHERE";
           } else {
                query += "AND"; 
           }
            
           query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
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
       query = query.replace("*", req.query["fields"]); }
    
    
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

app.get('/animals/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id;; 
    
    if ("fields" in req.query) {
       query = query.replace("*", req.query["fields"]); 
    // query+= "FROM animals WHERE id=" + id;
    } 
    db.query(query, function(err, result, fields) {
    if (err) throw err; 
        
    res.send(JSON.stringify(result));
    });
});


app.post('/animals', function(req, res) {
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;
    var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('" + name + "', '" + breed + "', '" + food_per_day + "', '" + birthday + "', '" + entry_date + "', '" + id_cage + "')";
    db.query(query, function(err, result, fields) { 
        if (err) throw err;
        
    res.send(JSON.stringify("Success")); 
    });
});
    

app.put('/animals/:id', function(req,res) {
    var id = req.params.id;
    var name = req.body.name;
    var breed= req.body.breed;
    var food_per_day= req.body.food_per_day;
    var birthday= req.body.birthday;
    var entry_date= req.body.entry_date;
    var id_cage= req.body.id_cage;
    
    var query ="UPDATE animals SET ";
    var i = 0; 
    
    if(name){ 
        if(i!=0){
            query +=","; }
        query += "name ='"+name+"'";
        i+=1;
    }
    if(breed){ 
        if(i!=0){
            query +=","; }
        query += "breed ='"+breed+"'";
        i+=1;
    }
    if(food_per_day){ 
        if(i!=0){
            query +=","; }
        query += "food_per_day ='"+food_per_day+"'";
        i+=1;
    }
    
    if(birthday){ 
        if(i!=0){
            query +=","; }
        query += "birthday ='"+birthday+"'";
        i+=1;
    }
    if(entry_date){ 
        if(i!=0){
            query +=","; }
        query += "entry_date ='"+entry_date+"'";
        i+=1;
    }
    if(id_cage){ 
        if(i!=0){
            query +=","; }
        query += "id_cage ='"+id_cage+"'";
        i+=1;
    }
    
    query += " WHERE id = " + id;
    console.log(query);
    
    db.query(query,function(err, result,fields) {
             if (err) throw err;
    if(i == 0) {
        res.send(JSON.stringify("Echec"));
    } else {
        res.send(JSON.stringify("Success"));
    }});
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
    var query = "DELETE FROM animals WHERE id="+ id; 
    db.query(query, function(err, result, fields) {
       if (err) throw err; res.send(JSON.stringify("Success"));
    }); 
});
    

///////\\\\\\\\\\\ relations animals - food
app.get('/animals/:id/food', function(req, res) {
    var id = req.params.id;
    var query = "SELECT food.id, food.name, quantity, id_animal FROM animals INNER JOIN food ON animals.id = id_animal WHERE animals.id=" + id; 
    
    var conditions = ["id","name","id_animal","quantity"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			query += " AND food.";
			query += conditions[index] + "='" +
			req.query[conditions[index]] + "'";
		}
	}
    if ("fields" in req.query) {
       query = query.replace("food.id, food.name, quantity, id_animal", req.query["fields"]); 
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
    }); 
});

app.get('/food/:id/animals', function(req, res) {
    var id = req.params.id;
    var query = "SELECT animals.id, animals.name, breed, food_per_day, birthday, entry_date, id_cage FROM food INNER JOIN animals ON id_animal = animals.id WHERE food.id=" + id; 
    
    var conditions = ["id","id_cage","name","breed","food_per_day","birthday","entry_date"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			query += " AND animals.";
			query += conditions[index] + "='" +
			req.query[conditions[index]] + "'";
		}
	}
    
    if ("fields" in req.query) {
       query = query.replace("animals.id, animals.name, breed, food_per_day, birthday, entry_date, id_cage", req.query["fields"]); 
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
    }); 
});

app.get('/food/:id_animal/animals/:animals_id', function(req, res) {
    var animals_id = req.params.animals_id;
    var id_animal = req.params.id_animal;
    var query = "SELECT animals.id, animals.name, breed, food_per_day, birthday, entry_date, id_cage FROM food INNER JOIN animals ON animals.id = id_animal WHERE animals.id=" + animals_id + " AND food.id=" + id_animal;
    
     if ("fields" in req.query) {
       query = query.replace("animals.id, animals.name, breed, food_per_day, birthday, entry_date, id_cage", req.query["fields"]); 
    } 
        
    db.query(query, function(err, result, fields) { 
        if (err) throw err;
        
        res.send(JSON.stringify(result)); 
    });
}); 

///////////\\\\\\\\\\\\\\\\\\\\ cages 
app.get('/cages', function(req, res) {
    var query = " SELECT * FROM cages " ;
    
    var conditions = ["id", "name" , "description" , "area"];
    for (var index in conditions) {
        if (conditions[index] in req.query) {
           if (query.indexOf("WHERE") < 0) { 
               query += " WHERE";
           } else {
                query += "AND"; 
           }
            
           query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
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
       query = query.replace("*", req.query["fields"]); }
    
    
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

app.get('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + id;
    
    if ("fields" in req.query) {
       query = query.replace("*", req.query["fields"]); 
    //query+= "FROM cages WHERE id=" + id;
    }
    
    db.query(query, function(err, result, fields) {
        if (err) throw err; 
        
    res.send(JSON.stringify(result));
    }); 
});

app.post('/cages', function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    var query = "INSERT INTO cages (name, description, area) VALUES ('" + name + "', '"+description+"', '" + area + "')";
    db.query(query, function(err, result, fields) { 
       if (err) throw err;
        
    res.send(JSON.stringify("Success"));
    });
});
    
app.put('/cages/:id', function(req,res) {
    var id = req.params.id;
    var name = req.body.name;
    var description= req.body.description;
    var area= req.body.area;
    
    var query ="UPDATE cages SET ";
    var i = 0; 
    
    if(name){ 
        if(i!=0){
            query +=","; }
        query += "name ='"+name+"'";
        i+=1;
    }
    if(description){ 
        if(i!=0){
            query +=","; }
        query += "description ='"+description+"'";
        i+=1;
    }
    if(area){ 
        if(i!=0){
            query +=","; }
        query += "area ='"+area+"'";
        i+=1;
    }
    
    query += " WHERE id = " + id;
    console.log(query);
    
    db.query(query,function(err, result,fields) {
             if (err) throw err;
    if(i == 0) {
        res.send(JSON.stringify("Echec"));
    } else {
        res.send(JSON.stringify("Success"));
    }});
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
    var query = "DELETE FROM cages WHERE id="+ id; 
    db.query(query, function(err, result, fields) {
       if (err) throw err; 
        
    res.send(JSON.stringify("Success"));
    }); 
});

////////\\\\\\\\\ relation cages-animals 
app.get('/cages/:id/animals', function(req, res) {
    var id = req.params.id;
    var query = "SELECT animals.id, animals.name, breed, food_per_day, birthday, entry_date, id_cage FROM cages INNER JOIN animals ON cages.id = id_cage WHERE cages.id=" + id;

    var conditions = ["id","id_cage","name","breed","food_per_day","birthday","entry_date"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			query += " AND animals.";
			query += conditions[index] + "='" +
			req.query[conditions[index]] + "'";
		}
	}
    
    if ("fields" in req.query) {
       query = query.replace("animals.id, animals.name, breed, food_per_day, birthday, entry_date, id_cage", req.query["fields"]); 
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
    }); 
});

app.get('/animals/:id/cages', function(req, res) {
    var id = req.params.id;
    var query = "SELECT cages.id, cages.name, description, area  FROM animals INNER JOIN cages ON cages.id = id_cage WHERE animals.id=" + id; 
    
    var conditions = ["id","name","description","area"];
	for (var index in conditions) {
		if (conditions[index] in req.query) {
			query += " AND cages.";
			query += conditions[index] + "='" +
			req.query[conditions[index]] + "'";
		}
	}
    
    if ("fields" in req.query) {
       query = query.replace("cages.id, cages.name, description, area", req.query["fields"]); 
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
    }); 
});

app.get('/animals/:animals_idcage/cages/:cages_id', function(req, res) {
    var cages_id = req.params.cages_id;
    var animals_idcage = req.params.animals_idcage;
    var query = "SELECT cages.id, cages.name, description, area FROM cages INNER JOIN animals ON cages.id = id_cage WHERE cages.id=" + cages_id + " AND animals.id=" + animals_idcage;
    
    if ("fields" in req.query) {
       query = query.replace("cages.id, cages.name, description, area", req.query["fields"]); 
    }
    db.query(query, function(err, result, fields) { 
        if (err) throw err;
        
        res.send(JSON.stringify(result)); 
    });
}); 
    

///////food
app.get('/food', function(req, res) {
    var query = "SELECT * FROM food" ;
    
    var conditions = ["id", "name", "quantity", "id_animal"];
    for (var index in conditions) {
        if (conditions[index] in req.query) {
           if (query.indexOf("WHERE") < 0) { 
               query += " WHERE";
           } else {
                query += "AND"; 
           }
            
           query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
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
       query = query.replace("*", req.query["fields"]); }
    
    
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
app.get('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;
    
    if ("fields" in req.query) {
       query = query.replace("*", req.query["fields"]); 
    //query+= "FROM food WHERE id=" + id;
    }
    
    db.query(query, function(err, result, fields) {
        if (err) throw err; 
        
    res.send(JSON.stringify(result));
    }); 
});

app.post('/food', function(req, res) {
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    var query = "INSERT INTO food (name, quantity, id_animal) VALUES ('" + name + "', '" + quantity + "', '" + id_animal + "')";
    db.query(query, function(err, result, fields) { 
        if (err) throw err;
        
    res.send(JSON.stringify("Success")); 
    });
});
    
app.put('/food/:id', function(req,res) {
    var id = req.params.id;
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    var query ="UPDATE food SET ";
    var i = 0; 
    
    if(name){ 
        if(i!=0){
            query +=","; }
        query += "name ='"+name+"'";
        i+=1;
    }
    if(quantity){ 
        if(i!=0){
            query +=","; }
        query += "quantity ='"+quantity+"'";
        i+=1;
    }
    if(id_animal){ 
        if(i!=0){
            query +=","; }
        query += "id_animal ='"+id_animal+"'";
        i+=1;
    }
    
    query += " WHERE id = " + id;
    console.log(query);
    
    db.query(query,function(err, result,fields) {
             if (err) throw err;
    if(i == 0) {
        res.send(JSON.stringify("Echec"));
    } else {
        res.send(JSON.stringify("Success"));
    }});
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
    var query = "DELETE FROM food WHERE id="+ id; 
    db.query(query, function(err, result, fields) {
        if (err) throw err; 
        
    res.send(JSON.stringify("Success"));
    }); 
});
    

////// staff 
app.get('/staff', function(req, res) {
    var query = "SELECT * FROM staff"
    
    var conditions = ["id", "firstname", "lastname", "wage"];
    for (var index in conditions) {
        if (conditions[index] in req.query) {
           if (query.indexOf("WHERE") < 0) { 
               query += " WHERE";
           } else {
                query += "AND"; 
           }
            
           query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
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
       query = query.replace("*", req.query["fields"]); }
    
    
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
app.get('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id;
    
    if ("fields" in req.query) {
       query = query.replace("*", req.query["fields"]); 
    //query+= "FROM staff WHERE id=" + id;
    }
    
    db.query(query, function(err, result, fields) {
        if (err) throw err; 
        
    res.send(JSON.stringify(result));
    }); 
});

app.post('/staff', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('" + firstname + "', '" + lastname + "', '" + wage + "')";
    db.query(query, function(err, result, fields) { 
        if (err) throw err;
        
    res.send(JSON.stringify("Success")); 
    });
});
    
app.put('/staff/:id', function(req,res) {
    var id = req.params.id;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    
    var query ="UPDATE staff SET ";
    var i = 0; 
    
    if(firstname){ 
        if(i!=0){
            query +=","; }
        query += "firstname ='"+firstname+"'";
        i+=1;
    }
    if(lastname){ 
        if(i!=0){
            query +=","; }
        query += "lastname ='"+lastname+"'";
        i+=1;
    }
    if(wage){ 
        if(i!=0){
            query +=","; }
        query += "wage ='"+wage+"'";
        i+=1;
    }
    
    query += " WHERE id = " + id;
    console.log(query);
    
    db.query(query,function(err, result,fields) {
             if (err) throw err;
    if(i == 0) {
        res.send(JSON.stringify("Echec"));
    } else {
        res.send(JSON.stringify("Success"));
    }});
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
    var query = "DELETE FROM staff WHERE id="+ id; 
    db.query(query, function(err, result, fields) {
        if (err) throw err; 
        
    res.send(JSON.stringify("Success"));
    }); 
});


///////route food/stats 

app.get('/food-stats', function(req, res) {
	var query="select animals.id, COALESCE(quantity/food_per_day,0) as days_left from animals join food on animals.id=food.id_animal"
	
	db.query(query,function(err,result,fields){
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