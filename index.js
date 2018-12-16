require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');


// connection
var db = mysql.createConnection({
host: process.environment.MYSQL_HOST,
	user: process.environment.MYSQL_LOGIN,
	password: process.environment.MYSQL_PASSWORD,
	database: process.environment.MYSQL_DATABASE,
	port: process.environment.MYSQL_PORT
});

//firewall
app.use(function(req, res, next) {
    
    if ("key" in req.query) {
        var key = req.query["key"];
        var query = "SELECT * FROM users WHERE apikey='" + key + "'";
        db.query(query, function(err, result, fields) 
        {
            if (err) throw err;
            if (result.length > 0) {
            next();
        }
        else {
            res.send("Error", 403); //HTTP error 403
        }
        });
        } else {
            res.send("Error", 403);
        }
});

app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function(req, res) {
    var response = { "page": "zoo" };
    res.send(JSON.stringify(response));
});


// read all animals
app.get('/animals', function(req, res) {
    
    var query = "SELECT * FROM animals";
    var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];

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


        if ("limit" in req.query) {
            query += " LIMIT " + req.query["limit"];
            if ("offset" in req.query) {
                query += " OFFSET " + req.query["offset"];
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


    db.query(query, function(err, result, fields) {
    if (err) throw err;
        res.send(JSON.stringify(result));
    });
    
});


// read one animal
app.get('/animals/:id', function(req, res) {

    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id="+id;
    var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
    
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


        if ("limit" in req.query) {
            query += " LIMIT " + req.query["limit"];
            if ("offset" in req.query) {
                query += " OFFSET " + req.query["offset"];
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


    db.query(query, function(err, result, fields) {
    if (err) throw err;
        res.send(JSON.stringify(result));
    });
    
});


//create animal
app.post('/animals', function(req, res) {
    
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;
    var query = "INSERT INTO animals(`name`, `breed`, `food_per_day`, `birthday`, `entry_date`, `id_cage`) VALUES ( '" + name + "', '" + breed + "', '" + food_per_day + "', '" + birthday + "', '" + entry_date + "', '" + id_cage + "')";
    
    
    db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});


// update animal
app.put('/animals/:id', function(req,res) {
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;
    var id = req.params.id;
    

    
    var query = "UPDATE animals SET ";
    
    if(name!== undefined) query+=" name='"+name+"',";
    if(breed!== undefined) query+=" breed='"+breed+"',";
    if(food_per_day!== undefined) query+=" food_per_day='"+food_per_day+"',";
    if(birthday!== undefined) query+=" birthday='"+birthday+"',";
    if(entry_date!== undefined) query+=" entry_date='"+entry_date+"',";
    if(id_cage!== undefined) query+=" id_cage='"+id_cage+"',";
    
    query=query.slice(0,-1);
    
    query+= " WHERE id=" + id;

    db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});


//delete all animal
app.delete('/animals', function(req, res) {
    
    var query = "DELETE FROM animals";
    db.query(query, function(err, result, fields) {
    if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


//delete one animal
app.delete('/animals/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM animals WHERE id=" + id;
    db.query(query, function(err, result, fields) {
    if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});





// read one cage
app.get('/cages/:id', function(req, res) {
    
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id="+id;
    var conditions = ["id", "name", "description","area"];
    
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
        });
});


//read all cage
app.get('/cages', function(req, res) {
    
    var query = "SELECT * FROM cages";
    var conditions = ["id", "name", "description","area"];
    
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
        });
});


// create cage
app.post('/cages', function(req, res) {
    
    var area = req.body.area;
    var name = req.body.name;
    var description = req.body.description;
    
    var query = "INSERT INTO cages(`name`, `description`, `area`) VALUES ('" + name + "', '" + description + "', '" + area + "')";
    
    db.query(query, function(err, result, fields) {
        if (err) throw err;
            res.send(JSON.stringify("Success"));
        });
});


//update one cage
app.put('/cages/:id', function(req,res) {
    
    var id = req.params.id;
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    
    var query = "UPDATE cages SET ";
    
    if(name!== undefined) query+=" name='"+name+"',";
    if(description!== undefined) query+=" description='"+description+"',";
    if(area!== undefined) query+=" area='"+area+"',";
    
    query=query.slice(0,-1);
    
    query+= " WHERE id=" + id;
    
    db.query(query, function(err, result, fields) {
        if (err) throw err;
            res.send(JSON.stringify("Success"));
        });
});


//delete all cage
app.delete('/cages', function(req, res) {
    
    var query = "DELETE FROM cages";
    
    db.query(query, function(err, result, fields) {
    if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


//delete one cage
app.delete('/cages/:id', function(req, res) {
    
    var id = req.params.id;
    var query = "DELETE FROM cages WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
            res.send(JSON.stringify("Success"));
    });
});


// read one food
app.get('/food/:id', function(req, res) {
    
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id="+id;
    var conditions = ["id", "name","id_animal", "quantity"];
    
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
        });
});


//read all food
app.get('/food', function(req, res) {
    
    var query = "SELECT * FROM food";
    var conditions = ["id", "name","id_animal", "quantity"];
    
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
        });
});


//create food
app.post('/food', function(req, res) {
    
    var name = req.body.name;
    var id_animal = req.body.id_animal;
    var quantity = req.body.quantity;
    var query = "INSERT INTO food(`name`, `quantity`, `id_animal`) VALUES ('" + name + "', '" + quantity + "', '" + id_animal + "')";
    
    db.query(query, function(err, result, fields) {
        if (err) throw err;
            res.send(JSON.stringify("Success"));
        });
});


//update food
app.put('/food/:id', function(req,res) {
    
    var id = req.params.id;
    var name = req.body.name;
    var id_animal = req.body.id_animal;
    var quantity = req.body.quantity;
    
    var query = "UPDATE food SET ";
    
    if(name!== undefined) query+=" name='"+name+"',";
    if(id_animal!== undefined) query+=" id_animal='"+id_animal+"',";
    if(quantity!== undefined) query+=" quantity='"+quantity+"',";
    
    query=query.slice(0,-1);
    
    query+= " WHERE id=" + id;
    
    db.query(query, function(err, result, fields) {
        if (err) throw err;
            res.send(JSON.stringify("Success"));
        });
});


//delete all food
app.delete('/food', function(req, res) {
    var query = "DELETE FROM food";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
            res.send(JSON.stringify("Success"));
    });
});


//delete one food
app.delete('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM food WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
            res.send(JSON.stringify("Success"));
    });
});



// read one staff
app.get('/staff/:id', function(req, res) {
    
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id="+id;
    var conditions = ["id", "firstname","lastname","wage"];
    
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
        });
});


//create staff
app.post('/staff', function(req, res) {
    
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    var query = "INSERT INTO staff(`firstname`, `lastname`, `wage`) VALUES ('" + firstname + "', '" + lastname + "', '" + wage + "')";
    
    db.query(query, function(err, result, fields) {
        if (err) throw err;
            res.send(JSON.stringify("Success"));
        });
});


//read all staff
app.get('/staff', function(req, res) {
    
    var query = "SELECT * FROM staff";
    var conditions = ["id", "firstname","lastname","wage"];
    
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
        });
});



//update staff
app.put('/staff/:id', function(req,res) {
    
    var id = req.params.id;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    
    var query = "UPDATE staff SET ";
    
    if(firstname!== undefined) query+=" firstname='"+firstname+"',";
    if(lastname!== undefined) query+=" lastname='"+lastname+"',";
    if(wage!== undefined) query+=" wage='"+wage+"',";
    
    query=query.slice(0,-1);
    
    query+= " WHERE id=" + id;
    
    db.query(query, function(err, result, fields) {
        if (err) throw err;
            res.send(JSON.stringify("Success"));
        });
});



//delete all staff
app.delete('/staff', function(req, res) {
    var query = "DELETE FROM staff";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
            res.send(JSON.stringify("Success"));
    });
});



//delete one staff
app.delete('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM staff WHERE id=" + id;
    db.query(query, function(err, result, fields) {
    if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});













// RELATIONSHIPS

//animals in cages
//read one animal in cages
app.get('/cages/:id_cage/animals/:id_animal', function(req, res) {
    
    var id_animal = req.params.id_animal;
    var id_cage = req.params.id_cage;

    var query = "SELECT animals.* FROM animals FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animal + " AND cages.id=" + id_cage;

    var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " animals." + conditions[index] + "='" +
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
        });
});


//read all animals in cages
app.get('/cages/:id/animals', function(req, res) {
    
    var id = req.params.id;

    var query = "SELECT animals.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id=" + id;

    var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " animals." + conditions[index] + "='" +
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


        if ("limit" in req.query) {
            query += " LIMIT " + req.query["limit"];
            if ("offset" in req.query) {
                query += " OFFSET " + req.query["offset"];
            }
    }

            if ("fields" in req.query) {
                query = query.replace("*", req.query["fields"]);
    }

    db.query(query, function(err, result, fields) {
        if (err) throw err;
            res.send(JSON.stringify(result));
        });
});



//cages in animals
//read all cage in animals
app.get('/animals/:id/cages', function(req, res) {
    
    var id = req.params.id;
    var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;
    var conditions = ["id", "name", "description","area"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " cages." + conditions[index] + "='" +
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


        if ("limit" in req.query) {
            query += " LIMIT " + req.query["limit"];
            if ("offset" in req.query) {
                query += " OFFSET " + req.query["offset"];
            }
    }

        if ("fields" in req.query) {
            query = query.replace("*", req.query["fields"]);
    }

    db.query(query, function(err, result, fields) {
        if (err) throw err;
            res.send(JSON.stringify(result));
        });
});

//read one cage in animals
app.get('/animals/:id_animal/cages/:id_cage', function(req, res) {
    
    var id_animal = req.params.id_animal;
    var id_cage = req.params.id_cage;
    var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animal + " AND cages.id=" + id_cage;

    var conditions = ["id", "name", "description","area"];
        for (var index in conditions) {
            if (conditions[index] in req.query) {
                if (query.indexOf("WHERE") < 0) {
                    query += " WHERE";
                } else {
                    query += " AND";
                }
                query += " cages." + conditions[index] + "='" +
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
        });
});



// animals in food
// read all animals in food
app.get('/food/:id/animals', function(req, res) {
    
    var id = req.params.id;
    var query = "SELECT animals.* FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE food.id=" + id;
    var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
    
    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " animals." + conditions[index] + "='" +
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
        });
});

// read one animal in food
app.get('/food/:id_food/animals/:id_animal', function(req, res) {
    
    var id_food = req.params.id_food;
    var id_animal = req.params.id_animal;
    var query = "SELECT animals.* FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE food.id=" + id_food + " AND  animals.id=" +id_animal;
    var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " animals." + conditions[index] + "='" +
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
        });
}); 




// food in animals
// read all food in animals
app.get('/animals/:id/food', function(req, res) {
    
    var id = req.params.id;
    var query = "SELECT food.* FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE animals.id=" + id;
    var conditions = ["id", "name","quantity","id_animal"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " food." + conditions[index] + "='" +
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
        });
});

//read one food in animals
app.get('/food/:id_food/animals/:id_animal', function(req, res) {
    
    var id_food = req.params.id_food;
    var id_animal = req.params.id_animal;
    var query = "SELECT food.* FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE food.id=" + id_food + " AND  animals.id=" +id_animal;
    var conditions = ["id", "name","quantity","id_animal"];
    
    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " food." + conditions[index] + "='" +
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
        });
}); 








// food statistics
app.get('/food-stats', function(req,res) {
    
    var query ="SELECT animals.id,CASE WHEN animals.food_per_day =0 THEN 0 ELSE food.quantity/animals.food_per_day END as days_left FROM food INNER JOIN animals ON food.id_animal=animals.id";
    
    db.query(query, function(err, result, fields) {
        if (err) throw err;
            res.send(JSON.stringify(result));
        });
});


//  app listening
app.listen(3000, function() {
db.connect(function(err) {
//if (err) throw err;
console.log('Connection to database successful!');
});
console.log('Example app listening on port 3000!');
}); 