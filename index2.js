
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

const host=process.environment.MYSQL_HOST;
const port=process.environment.MYSQL_PORT;
const database=process.environment.MYSQL_DATABASE;
const login=process.environment.MYSQL_USER;
const password=process.environment.MYSQL_PASSWORD;



app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({
  
	host: host,
	user: login,
	password: password,
	database: database,
	port: port

});


function filter(query,req,conditions)
{
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
	return query;
}

/* COUCOU FIREWALL*/

app.use(function (req,res,next){
    if ("key" in req.query) {
        var key = req.query["key"];
        var query = "SELECT * FROM users WHERE apikey='" + key + "'";
        db.query(query, function(err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                next();
            }
            else {
                //res.send("Access denied");
                res.status(403).send();
            }
        });
    } else {
        //res.send("Access denied");
        res.status(403).send();
    }

});


/*GET AVEC QUERY*/
app.get('/animals', function(req, res) {
    var query = "SELECT * FROM animals";
	var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
	query = filter(query,req,conditions);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/animals/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id;
	var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
	query = filter(query,req,conditions);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

/*CAGES & ANIMALS*/
app.get('/animals/:id/cages', function(req, res) {
    var id = req.params.id;
    var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;
	var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage","name","description","area"];
    query = filter(query,req,conditions);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages/:id/animals', function(req, res) {
    var id = req.params.id;
    var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id;
    var conditions = ["id_cage","name","description","area","id", "name","breed","food_per_day","birthday","entry_date"];
    query = filter(query,req,conditions);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id_animal/cages/:id_cage', function(req, res) {
    var id_animal = req.params.id_animal;
    var id_cage = req.params.id_cage;
    var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animal + " AND cages.id=" +id_cage;
    var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage","name","description","area"];
    query = filter(query,req,conditions);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages/:id_cage/animals/:id_animal', function(req, res) {
    var id_animal = req.params.id_animal;
    var id_cage = req.params.id_cage;
    var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id_animal = animals.id WHERE animals.id=" + id_animal + " AND cages.id=" +id_cage;
    var conditions = ["id_cage","name","description","area","id", "name","breed","food_per_day","birthday","entry_date"];
    query = filter(query,req,conditions);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages', function(req, res) {
    var query = "SELECT * FROM cages";
	var conditions = ["id", "name","description","area"];
	query = filter(query,req,conditions);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + id;
	var conditions = ["id", "name","description","area"];
	query = filter(query,req,conditions);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food', function(req, res) {
    var query = "SELECT * FROM food";
	var conditions = ["id", "name","quantity","id_animal"];
	query = filter(query,req,conditions);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;
	var conditions = ["id", "name","quantity","id_animal"];
	query = filter(query,req,conditions);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


/*FOOD & ANIMALS*/
app.get('/food/:id/animals', function(req, res) {
    var id = req.params.id;
    var query = "SELECT animals.* FROM food INNER JOIN animals ON animals.id = food.id_animal WHERE food.id=" + id;
    var conditions = ["id", "name","quantity","id_animal","breed","food_per_day","birthday","entry_date","id_cage"];
	query = filter(query,req,conditions);
	db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food/:id_food/animals/:id_animal', function(req, res) {
    var id_animal = req.params.id_animal;
    var id_food = req.params.id_food;
    var query = "SELECT animals.* FROM food INNER JOIN animals ON animals.id = food.id_animal WHERE animals.id=" + id_animal + " AND food.id=" + id_food;
    var conditions = ["id", "name","quantity","id_animal","breed","food_per_day","birthday","entry_date","id_cage"];
	query = filter(query,req,conditions);
	db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id/food', function(req, res) {
    var id = req.params.id;
    var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;
    var conditions = ["breed","food_per_day","birthday","entry_date","id_cage","id", "name","quantity","id_animal"];
    query = filter(query,req,conditions);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id_animal/food/:id_food', function(req, res) {
    var id_animal = req.params.id_animal;
    var id_food = req.params.id_food;
    var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id_animal + " AND food.id=" + id_food;
    var conditions = ["id_animal","breed","food_per_day","birthday","entry_date","id_cage","id", "name","quantity"];
    query = filter(query,req,conditions);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


app.get('/staff', function(req, res) {
    var query = "SELECT * FROM staff";
	var conditions = ["id", "firstname","lastname","wage"];
	query = filter(query,req,conditions);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id;
	var conditions = ["id", "firstname","lastname","wage"];
	query = filter(query,req,conditions);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


/* TRUC DU FOOD-STATS
app.get('/food-stats', function(req, res) {
    var id_animal = req.params.id_animal;
    var query = "SELECT animals.* FROM food INNER JOIN animals ON animals.id = food.id_animal WHERE animals.id=" + id_animal + " AND food.id=" + id_food;
    var conditions = ["quantity","id_animal","food_per_day"];
    query = filter(query,req,conditions);
    query =
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

*/
////////////////////////////////

/*POST AVEC QUERY*/

app.post('/animals/', function(req, res) {
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;

    var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('" + name + "','" + breed + "','" + food_per_day + "','" + birthday + "','" + entry_date + "','" + id_cage + "')";
    db.query(query, function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Success"));
    });
});

app.post('/cages/', function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;

    var query = "INSERT INTO cages (name,description,area) VALUES ('" + name + "','" + description + "','" + area + "')";
    db.query(query, function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Success"));
    });
});

app.post('/food/', function(req, res) {
    var name = req.body.name;
    var id_animal = req.body.id_animal;
    var quantity = req.body.quantity;

    var query = "INSERT INTO food (name,id_animal,quantity) VALUES ('" + name + "','" + id_animal + "','" + quantity + "')";
    db.query(query, function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Success"));
    });
});

app.post('/staff/', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;

    var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('" + firstname + "','" + lastname + "','" + wage + "')";
    db.query(query, function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Success"));
    });
});

/*PUT AVEC QUERY*/
/*put animals*/
app.put('/animals/:id',function(req,res) {
    console.log(req.params);
    var id = req.params.id;
    var query = "UPDATE animals SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});
/*put cages */
app.put('/cages/:id',function(req,res) {
    console.log(req.params);
    var id = req.params.id;
    var query = "UPDATE cages SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});
/*put food*/
app.put('/food/:id',function(req,res) {
    console.log(req.params);
    var id = req.params.id;
    var query = "UPDATE food SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});
/*put staff*/
app.put('/staff/:id',function(req,res) {
    var id = req.params.id;
    var query = "UPDATE staff SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});


/*DELETE AVEC QUERY*/
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

app.listen(3000, function() {
    db.connect(function(err) {
        if (err) throw err;
        console.log('Connection to database successful!');
    });
    console.log('Example app listening on port 3000!');
});




