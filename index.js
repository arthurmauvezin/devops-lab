const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//connection to the database called zoo
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "zoo",
    port: "3306"
});
//Set up the firewall
app.use(function(req, res, next) {
    if ("key" in req.query) {
        var key = req.query["key"];
        var query = "SELECT * FROM users WHERE apikey='" + key + "'";
        db.query(query, function(err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                next();
            } else {
                res.status(403).send("Access denied");
            }
        });
    } else {
        res.status(403).send("Access denied");
    }
});
/** animals CRUD **/
//Post request for the creation route
app.post('/animals', function(req, res) {
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;

    var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" + name + "','" + breed + "'," + food_per_day + ",'" + birthday + "','" + entry_date + "'," + id_cage + ")";
    db.query(query, function(err, result, fields) {
        if (err) { throw err };
        res.send(JSON.stringify("Success"));
    });
});
//Get request using filters based on selection, sorting, filtering and pagination
app.get('/animals', function(req, res) {
    var query = "SELECT * FROM animals";
    var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    //check for conditions in query
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
    //check for fields
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    //check for sort
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
    //check for limit in req.query
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        //check for offset in req.query
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Get request using id
//the id is matched with an expression comprised of 1 or more int
app.get('/animals/:id(\\d+)', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM animals where id=" + id;
    var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    //check for conditions in query
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
    //check for fields
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    //check for sort
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
    //check for limit in req.query
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        //check for offset in req.query
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Get request using a relationship between the animals and the cage
//displays all the information about the cage
app.get('/animals/:id/cages', function(req, res) {
    var id = req.params.id;
    var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id = " + id;
    var conditions = ["id", "name", "description", "area"];
    //check for conditions in query
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
    //check for fields
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    //check for pagination
    //search for limit in req.query
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        //search for offset in req.query
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Get request using a relationship between the animals and their cages
//displays information about one cage 
app.get('/animals/:id/cages/:id_cage', function(req, res) {
    var id = req.params.id;
    var id_cage = req.params.id_cage;
    var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id = " + id + " AND cages.id=" +
        id_cage;
    var conditions = ["id", "name", "description", "area"];
    //check for conditions in query
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
    //check for fields
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    //check for pagination
    //search for limit in req.query
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        //search for offset in req.query
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


//Get request using a relationship between animals and food
//Displays all information about food
app.get('/animals/:id_animal/food', function(req, res) {
    var id_animal = req.params.id_animal;
    var query = "SELECT food.* FROM food INNER JOIN animals ON animals.id = food.id_animal WHERE animals.id = " + id_animal;
    var conditions = ["id", "name", "quantity", "id_animal"];
    //console.log(req.query);
    //check for conditions in query
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

    //check for fields
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    //check for pagination
    //search for limit in req.query
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        //search for offset in req.query
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Put request for the update route
//This request updates the name of the animals
app.put('/animals/:id(\\d+)', function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    var query = "UPDATE animals SET";

    for (var index in conditions) {
        if (conditions[index] in req.body) {
            query += " " + conditions[index] + " = '" + req.body[conditions[index]] + "',";

        }
    }
    query = query.slice(0, -1);
    query += " WHERE id=" + id;
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("OK"));
    });
});

//Delete request for the delete route
app.delete('/animals', function(req, res) {
    var query = "DELETE FROM animals";
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("OK"));
    });
});
//Delete route using id
app.delete('/animals/:id(\\d+)', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM animals WHERE id = " + id;
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("OK"));
    });
});

/** cages CRUD**/
//Post request for the create route
app.post('/cages', function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    var query = "INSERT INTO cages (name,description,area) VALUES ('" + name + "','" + description + "','" + area + "')";
    db.query(query, function(err, result, fields) {
        if (err) { throw err };
        res.send(JSON.stringify("Success"));
    });
});
//Get request for the read route using filters based on selection, sorting,filtering and paging
app.get('/cages', function(req, res) {
    var query = "SELECT * FROM cages";
    var conditions = ["id", "name", "description", "area"];
    //check for conditions in query
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
    //check for fields
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    //check for sort
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
    //check for limit in req.query
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        //check for offset in req.query
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Get request for the read route using id
app.get('/cages/:id(\\d+)', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + id;
    var conditions = ["id", "name", "description", "area"];
    //check for conditions in query
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
    //check for fields
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    //check for sort
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
    //check for limit in req.query
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        //check for offset in req.query
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Get request using relationship between cages and animal
//Display all the information about the animals
app.get('/cages/:id/animals', function(req, res) {
    var id = req.params.id;
    var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id;
    var conditions = ["id", "name", "breed", "food_per_day", "entry_date", "birthday", "id_cage"];
    //check for conditions in query
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
    //check for fields
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    //Check for pagination
    //check for limit in req.query
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        //check for offset in req.query
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Put request for the update route
app.put('/cages/:id(\\d+)', function(req, res) {
    var id = req.params.id;
    var conditions = ["id", "name", "description", "area"];
    var query = "UPDATE cages SET";

    for (var index in conditions) {
        if (conditions[index] in req.body) {
            query += " " + conditions[index] + " = '" + req.body[conditions[index]] + "',";

        }
    }
    query = query.slice(0, -1);
    query += " WHERE id=" + id;
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("OK"));
    });
});
//Delete request for the delete route
app.delete('/cages', function(req, res) {
    var query = "DELETE FROM cages";
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("OK"));
    });
});
//Delete request using the id of the cages
app.delete('/cages/:id(\\d+)', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM cages WHERE id = " + id;
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("OK"));
    });
});

/** FOOD CRUD **/
//Post request for the create route
app.post('/food', function(req, res) {
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    var query = "INSERT INTO food (name,quantity,id_animal) VALUES ('" + name + "','" + quantity + "'," + id_animal + ")";
    db.query(query, function(err, result, fields) {
        if (err) { throw err };
        res.send(JSON.stringify("Success"));
    });
});
//Get request for the read route of food using filters based on selection, sorting,filtering and paging
app.get('/food', function(req, res) {
    var query = "SELECT * FROM food";
    var conditions = ["id", "name", "quantity", "id_animal"];
    //check for conditions in query
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
    //check for fields
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    //check for sort
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
    //check for limit in req.query
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        //check for offset in req.query
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//Get request for the read route using the id of the food
app.get('/food/:id(\\d+)', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;
    var conditions = ["id", "name", "quantity", "id_animal"];
    //check for conditions in query
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
    //check for fields
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    //check for sort
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
    //check for limit in req.query
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        //check for offset in req.query
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Get Request using a relationship between the animals table and the food table
//displays all the information about animals
app.get('/food/:id_food/animals', function(req, res) {
    var id_food = req.params.id_food;
    var query = "SELECT animals.* FROM animals INNER JOIN food ON food.id_animal=animals.id WHERE food.id=" + id_food;
    var conditions = ["id", "name", "breed", "food_per_day", "entry_date", "birthday", "id_cage"];
    //check for conditions in query
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
    //check for fields
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    //check for limit in req.query
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        //check for offset in req.query
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    })
});

//Get Request using a relationship between the animals table and the food table
//displays information about one animal
app.get('/food/:id_food/animals/:id_animal', function(req, res) {
    var id_food = req.params.id_food;
    var id_animal = req.params.id_animal;
    var query = "SELECT animals.* FROM animals INNER JOIN food ON food.id_animal=animals.id WHERE food.id=" + id_food + " AND" +
        " animals.id =" + id_animal;
    var conditions = ["id", "name", "breed", "food_per_day", "entry_date", "birthday", "id_cage"];
    //check for conditions in query
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
    //check for fields
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    //check for limit in req.query
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        //check for offset in req.query
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    })
});

//Put request for update route
app.put('/food/:id(\\d+)', function(req, res) {
    var id = req.params.id;

    var conditions = ["id", "name", "quantity", "id_animal"];
    var query = "UPDATE food SET";

    for (var index in conditions) {
        if (conditions[index] in req.body) {
            query += " " + conditions[index] + " = '" + req.body[conditions[index]] + "',";

        }
    }
    query = query.slice(0, -1);
    query += " WHERE id=" + id;
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("OK"));
    });
});


//Delete request for the delete route
app.delete('/food', function(req, res) {
    var query = "DELETE FROM food";
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("OK"));
    });
});
//Delete route using parameter id
app.delete('/food/:id(\\d+)', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM food WHERE id = " + id;
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("OK"));
    });
});



/** STAFF CRUD **/
//Post request for the create route
app.post('/staff', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('" + firstname + "','" + lastname + "'," + wage + ")";
    db.query(query, function(err, result, fields) {
        if (err) { throw err };
        res.send(JSON.stringify("OK"));
    });
});
//Get request for the read route using filters based on selection, sorting,filtering and paging
app.get('/staff', function(req, res) {
    var query = "SELECT * FROM staff";
    var conditions = ["id", "firstname", "lastname", "wage"];
    //check for conditions in query
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
    //check for fields
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    //check for sort
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
    //check for limit in req.query
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        //check for offset in req.query
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Get request using parameter id
app.get('/staff/:id(\\d+)', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id;
    var conditions = ["id", "firstname", "lastname", "wage"];
    //check for conditions in query
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
    //check for fields
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    //check for sort
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
    //check for limit in req.query
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        //check for offset in req.query
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//Put request for the update route
app.put('/staff/:id(\\d+)', function(req, res) {
    var id = req.params.id;
    var conditions = ["id", "firstname", "lastname", "wage"];
    var query = "UPDATE staff SET";

    for (var index in conditions) {
        if (conditions[index] in req.body) {
            query += " " + conditions[index] + " = '" + req.body[conditions[index]] + "',";

        }
    }
    query = query.slice(0, -1);
    query += " WHERE id=" + id;
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("OK"));
    });
});
//DElete request for the delete route
app.delete('/staff', function(req, res) {
    var query = "DELETE FROM staff";
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("OK"));
    });
});
//Delete route using parameter id
app.delete('/staff/:id(\\d+)', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM staff WHERE id = " + id;
    db.query(query, function(err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("OK"));
    });
});

/** FOOD STAT **/
//This read route returns the quantity of food left measured in days for each animals in the database
//Check in select clause if the food_per_day attribute is equal to 0, in which case the output is 0
app.get('/food-stats', function(req, res) {
    db.query("SELECT animals.id,(case when animals.food_per_day =0 then 0 else (food.quantity/animals.food_per_day) end) as days_left FROM food INNER JOIN animals ON food.id_animal=animals.id", function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});





/** Listen to the port 3000 **/

app.listen(3000, function() {
    //db.connect(function(err) {
        //if (err) throw err;
        //console.log('Connection to database successful!')
    //});
    console.log('listening port 3000');
});