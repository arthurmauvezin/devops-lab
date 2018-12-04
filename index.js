/*Auteurs : Pierre MOULI CASTILLO et Antoine CREMEL*/
/*Only the animals section is commented since all other section follow the same construction, all the filters work the same way with every table*/
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//connection to the data base on port 3306
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "zoo",
    port: "3306"
});

/*PAR-FEU*/
app.use(function(req, res, next) {
    if ("key" in req.query) { //check if the password is in the url
        var key = req.query["key"];
        var query = "SELECT * FROM users WHERE apikey='" + key + "'"; // get the password in the database if the password is the same as the one in the url
        db.query(query, function(err, result, fields) { //if the query fails the connexion is denied
            if (err) throw err;
            if (result.length > 0) {
                next();
            }
            else {
                res.status(403).send("Access denied").end();;
            }
        });
    } else {
        res.status(403).send("Access denied").end();;
    }
});

/* ANIMALS */
app.get('/animals', function(req, res) {
    // Display/SELECT all animals in the table
    var query = "SELECT * FROM animals"; //initialisation of the query as a string
    var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"]; // creation of an array of all the conditions we might want to check when getting all the animals
    for (var index in conditions) { //for each condition possible we verify if any of them is specified
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



    if ("sort" in req.query) { // we chck if sort is in the url if it is we check the parameters and apply the sorting order
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

    if ( "fields" in req.query) {// we chack if any fields are specified in url, if it's the case instead of diplaying all fileds we only diplay the ones specified
        query = query.replace( "*" , req.query[ "fields" ]);
    }

    if ("limit" in req.query) {//we check if a limit is asked in the url, if it's the case we limit ne numbers of the resluts displayed
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }


    db.query(query, function(err, result, fields) {// final query
        if (err) throw err; // throw error if query fails
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id', function(req, res) {
    //SELCET a specific animal with its id
    //same as above but a condition on the ID is added and specified in the url
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
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

    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
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
    // SELECT all cages of an animal knowing only the animal id
    var id = req.params.id;
    var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id; 
    // with the INNER JOIN on id_cage = cage.id an the specified fileds to display we are able to display all the information of the cage in which the animal is assigned with only knowing the animal id in url
    var conditions = ["id", "name", "description", "area"];
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

    if ( "fields" in req.query) {
        query = query.replace( "cages.id, cages.name, cages.description, cages.area" , req.query[ "fields" ]);
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

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id/cages/:id_cage', function(req, res) {
    // SELECT a cage of an animal knowing  the animal id and the cage id
    var id = req.params.id;
    // same as above but we have a condition on the id of the cage we want to display, but animal can only have one cage so it don't matter much
    var id_cage = req.params.id_cage;
    var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id + " AND cages.id= " + id_cage; 
    var conditions = ["name", "description", "area"];
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

    if ( "fields" in req.query) {
        query = query.replace( "cages.id, cages.name, cages.description, cages.area" , req.query[ "fields" ]);
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

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id/food', function(req, res) {
    // SELECT all fods of an animal knowing only the animal id
    var id = req.params.id;
    var query = "SELECT food.id, food.name, food.quantity, food.id_animal FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;
    // same as '/animals/:id/cages' but to acccess all the different food of the animal only knowing the animal id. This is with INNER JOIN on animals.id = food.id_animal
    var conditions = ["name", "id_animal", "quantity"];
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

    if ( "fields" in req.query) {
        query = query.replace( "food.id, food.name, food.quantity, food.id_animal" , req.query[ "fields" ]);
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id/food/:id_food', function(req, res){
    // SELECT a food of an animal knowing the animal id and the food id
    // same as '/animals/:id/cages/:id_cage' but this time it's usefull since an animal can have multiple different foods
    var id = req.params.id;
    var id_food = req.params.id_food;
    var query = "SELECT *, animals.name as animal_name FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id + " AND food.id=" +id_food;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.post('/animals', function(req, res) {
    //INSERT A NEW ANIMAL
    var name            = req.body.name;
    var breed           = req.body.breed;
    var food_per_day    = req.body.food_per_day;
    var birthday        = req.body.birthday;
    var entry_date      = req.body.entry_date;
    var id_cage         = req.body.id_cage;
    //here we get all the information of an new animal, they are located in the body
    var query = "INSERT INTO `animals`(`name`, `breed`, `food_per_day`, `birthday`, `entry_date`, `id_cage`) VALUES ('"+name+"','"+breed+"',"+food_per_day+",'"+birthday+"','"+entry_date+"',"+id_cage+")";
    //Then we use INSERT with all the info gathered in the body, note that id is autoincremented so we don't have to get it in the body nor the url
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.put('/animals/:id', function(req, res) {
    //UPDATE AN ANIMAL
    var id = req.params.id;
    // we get the id of the animal we want to update
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;
    // Here we gather all the information we want to update
    var query = "UPDATE animals SET "
    if(name != null){
        query += "name = '" + name +"' ,"
    }
    if(breed != null){
        query += "breed = '" + breed +"' ,"
    }
    if(food_per_day != null){
        query += "food_per_day = " + food_per_day +" ,"
    }
    if(birthday != null){
        query += "birthday = '" + birthday +"' ,"
    }
    if(entry_date != null){
        query += "entry_date = '" + entry_date +"' ,"
    }
    if(id_cage != null){
        query += "id_cage = " + id_cage +" ,"
    }
    //we verify and add to the query only the fileds that need an update, if a field is not in the body it'll be skipped
    query = query.slice(0, -1); 
    query += "WHERE id=" +id; 

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.delete('/animals', function(req, res) {
    //we delete all animals
    var query = "DELETE FROM animals";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.delete('/animals/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM animals WHERE id=" + id;
    //we delete only the animal with the id in the url
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

/*CAGES*/
app.get('/cages', function(req, res) {
    var query = "SELECT * FROM cages"
    var conditions = ["id", "name", "description", "area"];
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

    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
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

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + id;
    var conditions = ["name", "description", "area"];
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

    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
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

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages/:id/animals', function(req, res) {
    var id = req.params.id;
    var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
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

    if ( "fields" in req.query) {
        query = query.replace( "animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage" , req.query[ "fields" ]);
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

app.get('/cages/:id/animals/:id_animal', function(req, res){
    var id = req.params.id;
    var id_animal = req.params.id_animal;
    var query = "SELECT *, cages.name as cage_name FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id + " AND animals.id= " +id_animal;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.post('/cages', function(req, res) {
    var name            = req.body.name;
    var description     = req.body.description;
    var area            = req.body.area;
    var query = "INSERT INTO `cages`(`name`, `description`, `area`) VALUES ('"+name+"','"+description+"',"+area+")";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.put('/cages/:id', function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    var query = "UPDATE cages SET "
    if(name != null){
        query += "name = '" + name +"' ,"
    }
    if(description != null){
        query += "description = '" + description +"' ,"
    }
    if(area != null){
        query += "area = " + area +" ,"
    }
    query = query.slice(0, -1); 
    query += "WHERE id=" +id; 

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

/*FOOD*/
app.get('/food', function(req, res) {
    var query = "SELECT * FROM food"
    var conditions = ["id", "name", "id_animal", "quantity"];
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

    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
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

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;
    var conditions = ["name", "id_animal", "quantity"];
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

    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
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

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food/:id/animals', function(req, res) {
    var id = req.params.id;
    var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE food.id=" + id;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
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

    if ( "fields" in req.query) {
        query = query.replace( "animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage" , req.query[ "fields" ]);
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

app.get('/food/:id/animals/:id_animal', function(req, res) {
    var id = req.params.id;
    var id_animal = req.params.id_animal;
    var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE food.id=" + id + " AND animals.id= " + id_animal;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
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

    if ( "fields" in req.query) {
        query = query.replace( "animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage" , req.query[ "fields" ]);
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

app.post('/food', function(req, res) {
    var name            = req.body.name;
    var id_animal       = req.body.id_animal;
    var quantity        = req.body.quantity;
    var query = "INSERT INTO `food`(`name`, `id_animal`, `quantity`) VALUES ('"+name+"',"+id_animal+","+quantity+")";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.put('/food/:id', function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var id_animal = req.body.id_animal;
    var quantity = req.body.quantity;
    var query = "UPDATE food SET "

    if(name != null){
        query += "name = '" + name +"' ,"
    }
    if(id_animal != null){
        query += "id_animal = " + id_animal +" ,"
    }
    if(quantity != null){
        query += "quantity = " + quantity +" ,"
    }
    query = query.slice(0, -1); 
    query += "WHERE id=" +id; 

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

/*STAFF*/
app.get('/staff', function(req, res) {
    var query = "SELECT * FROM staff"
    var conditions = ["id", "firstname", "lastname", "wage"];
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

    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
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

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id;
    var conditions = ["firstname", "lastname", "wage"];
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

    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
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

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.post('/staff', function(req, res) {
    var firstname      = req.body.firstname;
    var lastname       = req.body.lastname;
    var wage           = req.body.wage;
    var query = "INSERT INTO `staff`(`firstname`, `lastname`, `wage`) VALUES ('"+firstname+"','"+lastname+"',"+wage+")";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.put('/staff/:id', function(req, res) {
    var id              = req.params.id;
    var firstname      = req.body.firstname;
    var lastname       = req.body.lastname;
    var wage          = req.body.wage;
    var query = "UPDATE staff SET "

    if(firstname != null){
        query += "firstname = '" + firstname +"' ,"
    }
    if(lastname != null){
        query += "lastname = '" + lastname +"' ,"
    }
    if(wage != null){
        query += "wage = " + wage +" ,"
    }
    query = query.slice(0, -1); 
    query += "WHERE id=" +id; 

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

/*food-stats*/
app.get('/food-stats', function(req, res) {
    var query = "SELECT animals.id , COALESCE(food.quantity / NULLIF(animals.food_per_day,0), 0) as days_left from food INNER JOIN animals on food.id_animal = animals.id";
    //we divied the quatity of food per the food_pr_day to see how many time is left
    //NULLIF allows us to return null if the food_per = 0 so we don't divied per 0
    //COALESCE return the first non-null value in (division result, 0) so if we divied by 0 we put 0 in the table
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

/* Listen - database */
app.listen(3000, function() {
    db.connect(function(err) {
        if (err) throw err;
        console.log('Connection to database successful!');
    });
    console.log('Example app listening on port 3000!');
});
