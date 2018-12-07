const express = require('express'); // "require" command imports 
                                    // specified libraries
const mysql = require('mysql'); // set up a connection with the mysql library
const bodyParser = require('body-parser'); // extracts data from POST request
const app = express();

// === Setting up connection to the database ===
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project",
    port: "3306"
})


// === Firewall ===
app.use(function(req, res, next) {
    if("key" in req.query) {
        var key = req.query["key"]; // checks whether a key (optional query) is requested
        var query = "SELECT * FROM users WHERE apikey='" + key + "'"; // verify that it corresponds to the database

        db.query(query, function(err, result, fields) {
            if (err) throw err;

            if (result.length > 0) { // checking if the key entered by the user corresponds to at least one user in the database
                next();
            }
            else { // if not, throw an HTTP 403 error and an "Access Denied" message
                res.status(403).send("Access denied");
            }
        });
    } else {
        res.status(403).send("Access denied"); // if no key is requested, immediately block access
    }
});

// gives access to the body-parser library, needed to get user queries
app.use(bodyParser.urlencoded({ extended: true })); 

// root page
app.get('/', function(req,res) { // "get" creates a route, '/' root folder
        var response = { "page": "home"};
        res.send(JSON.stringify(response)); // "stringify": transforms any serializable variable into JSON text
});

// GET QUERY ELEMENTS
app.get('/query', function(req, res) {
    res.send(JSON.stringify(req.query));
});

// === Animals ===

// Delete all data
app.delete('/animals', function(req, res) {
    var query = "DELETE FROM animals";
    db.query(query, function(err, result, fields){
        if (err) throw err;

        res.send(JSON.stringify("Deleted all information on animals in database"));
    });
});

// Create data
app.post('/animals', function(req,res) {

    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;

    // substitute method to shorten length of query, each "?" refers to one element in the array in db.query()
    var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES (?,?,?,?,?,?)";
    db.query(query, [name, breed, food_per_day, birthday, entry_date, id_cage] , function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Created succesfully"));
    });
});

// Read all data
app.get('/animals', function(req,res) {
    var query = "SELECT * FROM animals"; // read all data without filters

    // with filters

    // CONDITIONS ; conditional selection method equivalent to "WHERE" and "AND" clauses in SQL
    // contains all selectable info pertaining to one animal
    var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    // properly writes out the query by splicing in parameters from conditions[] that matches req.query
    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    // SORT ; orders list in either descending or ascending order
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";

        for (var index in sort) {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);

            query += " " + field;

            if (direction == "-")
                query += " DESC,";
            else query += " ASC,";
        }

        query = query.slice(0, -1); // removes the extra ","
    }

    // FIELDS ; select specific fields
    if("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    // PAGINATION
    if("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];

        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }

    // returns result
    db.query(query, function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify(result)); 
    });
});

// Read data
app.get('/animals/:id', function(req,res) {
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id; // without filters

    // with filters
    // CONDITIONS
    var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    // NO SORT METHOD, as only one row is returned

    // FIELDS
    if("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    // NO PAGINATION METHOD, as only one row is returned; nothing to limit or offset


    db.query(query, function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify(result));
    });
});

// Update data
app.put('/animals/:id', function(req, res) {

    var id = req.params.id;
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;

    /* if query is executed without CASE clauses, the server will crash
    because it will expect every parameter to be specified by the user.
    Because of this, it is necessary to use CASE clauses to identify what
    happens when the user only PARTIALLY updates a row in the table, so that
    the SQL query is adjusted properly. When the value of the previous
    variables is null, the SQL query will just set the parameter to its
    original value instead.*/

    /* Substitute method with an array is again used to facilitate the use
    of CASE clauses, only downside being that I have to specify each parameter
    twice because of the way I have worded each case */

    var query = "UPDATE animals SET " 
    + "name = (CASE WHEN ? IS NULL THEN name ELSE ? END), "
    + "breed = (CASE WHEN ? IS NULL THEN breed ELSE ? END), "
    + "food_per_day = (CASE WHEN ? IS NULL THEN food_per_day ELSE ? END), "
    + "birthday = (CASE WHEN ? IS NULL THEN birthday ELSE ? END), "
    + "entry_date = (CASE WHEN ? IS NULL THEN entry_date ELSE ? END), "
    + "id_cage = (CASE WHEN ? IS NULL THEN id_cage ELSE ? END) "
    + "WHERE id=" + id;
    db.query(query, [name, name, breed, breed, food_per_day, food_per_day, birthday, birthday, entry_date, entry_date, id_cage, id_cage], function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Updated animal of id = " + id + " succesfully"));
    });
});

// Delete data
app.delete('/animals/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM animals WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Deleted info on animal of id= " + id + " succesfully"));
    });
});

// === END ANIMALS ===

/* Since most following routes will be similar to the ones for Animals,
comments, will only be added when code is significantly different from
previous routes*/

// === Cages === 

// Delete all data
app.delete('/cages', function(req, res) {
    var query = "DELETE FROM cages";
    db.query(query, function(err, result, fields){
        if (err) throw err;

        res.send(JSON.stringify("Deleted all cages successfully"));
    });
});

// Create data
app.post('/cages', function(req,res) {

    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;

    var query = "INSERT INTO cages (name, description, area) VALUES (?,?,?)"; // "+ [...] +"" needed to insert variables
    db.query(query, [name, description, area], function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Success"));
    });
});

// Read all data
app.get('/cages', function(req,res) {
    var query = "SELECT * FROM cages";

    // CONDITIONS
    var conditions = ["id", "name", "description", "area"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    // SORT
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";

        for (var index in sort) {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);

            query += " " + field;

            if (direction == "-")
                query += " DESC,";
            else query += " ASC,";
        }

        query = query.slice(0, -1);
    }

    // FIELDS
    if("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    // PAGINATION
    if("limit" in req.query) {
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

// Read data
app.get('/cages/:id', function(req,res) {
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + id;

    // SELECTION METHOD (use keys in "body" to specify which element you want to select)
    var conditions = ["id", "name", "description", "area"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    // SORTING METHOD
    if("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    db.query(query, function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify(result));
    });
});

// Update data
app.put('/cages/:id', function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    var query = "UPDATE cages SET " 
    + "name = (CASE WHEN ? IS NULL THEN name ELSE ? END), "
    + "description = (CASE WHEN ? IS NULL THEN description ELSE ? END),"
    + "area = (CASE WHEN ? IS NULL THEN area ELSE ? END) "
    + "WHERE id=" + id;
    db.query(query, [name, name, description, description, area, area], function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Updated cage of id = " + id + " succesfully"));
    });
});

// Delete data
app.delete('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM cages WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Deleted cage of id = " + id + " succesfully"));
    });
});

// === END CAGE ===


// === Food ===

// Delete all data
app.delete('/food', function(req, res) {
    var query = "DELETE FROM food";
    db.query(query, function(err, result, fields){
        if (err) throw err;

        res.send(JSON.stringify("Success"));
    });
});

// Create data
app.post('/food', function(req,res) {

    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;

    var query = "INSERT INTO food (name, quantity, id_animal) VALUES (?,?,?)"; // "+ [...] +"" needed to insert variables
    db.query(query, [name, quantity, id_animal], function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Success"));
    });
});

// read all data
app.get('/food', function(req,res) {
    var query = "SELECT * FROM food";

    // SELECTION METHOD (use keys in "body" to specify which element you want to select)
    var conditions = ["id", "name", "quantity", "id_animal"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    // SORTING METHOD 
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";

        for (var index in sort) {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);

            query += " " + field;

            if (direction == "-")
                query += " DESC,";
            else query += " ASC,";
        }

        query = query.slice(0, -1);
    }

    // SORTING METHOD
    if("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    // PAGINATION METHOD
    if("limit" in req.query) {
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

// Read data
app.get('/food/:id', function(req,res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;

    // SELECTION
    var conditions = ["id", "name", "quantity", "id_animal"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    // FIELDS
    if("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    db.query(query, function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify(result));
    });
});

// Update data
app.put('/food/:id', function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    var query = "UPDATE food SET " 
    + "name = (CASE WHEN ? IS NULL THEN name ELSE ? END), "
    + "quantity = (CASE WHEN ? IS NULL THEN quantity ELSE ? END),"
    + "id_animal = (CASE WHEN ? IS NULL THEN id_animal ELSE ? END) "
    + "WHERE id=" + id;
    db.query(query, [name, name, quantity, quantity, id_animal, id_animal], function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Updated food of id = " + id + " succesfully"));
    });
});

// Delete data
app.delete('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM food WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Success"));
    });
});

// === END FOOD ===

// === Staff ===

// Delete all data
app.delete('/staff', function(req, res) {
    var query = "DELETE FROM staff";
    db.query(query, function(err, result, fields){
        if (err) throw err;

        res.send(JSON.stringify("Success"));
    });
});

// Create data
app.post('/staff', function(req,res) {

    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;

    var query = "INSERT INTO staff (firstname, lastname, wage) VALUES (?,?,?)"; // "+ [...] +"" needed to insert variables
    db.query(query, [firstname, lastname, wage], function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Success"));
    });
});

// Read all data
app.get('/staff', function(req,res) {
    var query = "SELECT * FROM staff";

    // CONDITIONS
    var conditions = ["id", "firstname", "lastname", "wage"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    // SORT
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";

        for (var index in sort) {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);

            query += " " + field;

            if (direction == "-")
                query += " DESC,";
            else query += " ASC,";
        }

        query = query.slice(0, -1);
    }

    // FIELDS
    if("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    // PAGINATION
    if("limit" in req.query) {
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

// Read data
app.get('/staff/:id', function(req,res) {
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id;

    // CONDITIONS
    var conditions = ["id", "firstname", "lastname", "wage"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    // FIELDS
    if("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    db.query(query, function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify(result));
    });
});

// Update data
app.put('/staff/:id', function(req, res) {
    var id = req.params.id;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    var query = "UPDATE staff SET " 
    + "firstname = (CASE WHEN ? IS NULL THEN firstname ELSE ? END), "
    + "lastname = (CASE WHEN ? IS NULL THEN lastname ELSE ? END),"
    + "wage = (CASE WHEN ? IS NULL THEN wage ELSE ? END) "
    + "WHERE id=" + id;
    db.query(query, [firstname, firstname, lastname, lastname, wage, wage], function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Updated staff member of id = " + id + " succesfully"));
    });
});

// Delete data
app.delete('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM staff WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Success"));
    });
});

// === END STAFF ===

// === Relationships ===


// Relation Animals/Cages:
// Relation "cages" in "animals"
// find the cage(s) associated with one animal
app.get('/animals/:id/cages', function(req,res) {
    var id = req.params.id;
    var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;

    // CONDITIONS
    var conditions = ["id", "name", "description", "area"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    // FIELDS
    if("fields" in req.query) {
        query = query.replace("cages.id, cages.name, cages.description, cages.area", req.query["fields"]);
    } // every parameter from the initial query has to be replaced in fields

    // PAGINATION
    if("limit" in req.query) {
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

// read one
// We are looking for one specific cage associated to an animal
app.get('/animals/:id_animal/cages/:id_cage', function(req, res) {
    var id_animal = req.params.id_animal;
    var id_cage = req.params.id_cage;
    var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animal + " AND cages.id=" + id_cage;
    
    // CONDITIONS
    var conditions = ["id", "name", "description", "area"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    // FIELDS
    if("fields" in req.query) {
        query = query.replace("cages.id, cages.name, cages.description, cages.area", req.query["fields"]);
    }

    // AGAIN, NO PAGINATION METHOD as we are looking at single cage
 
    db.query(query, function(err, result, fields){
        if (err) throw err;

        res.send(JSON.stringify(result));
    });
}); 

// relation "animals" in "cages"
app.get('/cages/:id/animals', function(req,res) {
    var id = req.params.id;
    var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id=" + id;

    // CONDITIONS
    var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    // FIELDS
    if("fields" in req.query) {
        query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", req.query["fields"]);
    }

    // PAGINATION
    if("limit" in req.query) {
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

// Relation Food/Animals:

//relation "animals" in "food"
app.get('/food/:id/animals', function(req,res) {
    var id = req.params.id;
    var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + id;

    // CONDITIONS
    var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    // FIELDS
    if("fields" in req.query) {
        query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", req.query["fields"]);
    }

    // PAGINATION
    if("limit" in req.query) {
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

// read one
app.get('/food/:id_food/animals/:id_animal', function(req, res) {
    var id_animal = req.params.id_animal;
    var id_food = req.params.id_food;
    var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id_animal + " AND food.id=" + id_food;
    
    // CONDITIONS
    var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    // FIELDS
    if("fields" in req.query) {
        query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", req.query["fields"]);
    } 
    
    db.query(query, function(err, result, fields){
        if (err) throw err;

        res.send(JSON.stringify(result));
    });
}); 

// relation "food" in "animals"
app.get('/animals/:id/food', function(req,res) {
    var id = req.params.id;
    var query = "SELECT food.id, food.name, food.quantity FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE animals.id=" + id;

    // CONDITIONS
    var conditions = ["id", "name", "quantity"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    // FIELDS
    if("fields" in req.query) {
        query = query.replace("food.id, food.name, food.quantity", req.query["fields"]);
    }

    // PAGINATION
    if("limit" in req.query) {
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

// route for food-stats
app.get('/food-stats', function(req,res) {
    var query = "SELECT animals.id, "
    // CASE function needed to treat the case where there is a division by 0
    + "(CASE WHEN (food.quantity/animals.food_per_day) IS NULL THEN 0 ELSE (food.quantity/animals.food_per_day) END) as days_left " 
    + "FROM food INNER JOIN animals ON food.id_animal = animals.id";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.listen(3000, function() { // monitors request to launch app
    db.connect(function(err){
        if (err) throw err;
        console.log('Connection to database successful!');
    });

    console.log('Example app listening on port 3000!');
});