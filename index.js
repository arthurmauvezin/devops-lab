/* Connection à la BDD */
// Inclusion des bibliothèques utiles
const express = require('express'); // Utilisation de express
const mysql = require('mysql'); // MySQL
const bodyParser = require('body-parser'); // Pour body, postman
const app = express(); // pour express

app.use(bodyParser.urlencoded({ extended: true })); // Initialisation

// Connection (ici paramètres pour Xamp)
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project",
    port: "3306"
});

// Make the server listen on port 3000
app.listen(3000, function () {
    db.connect(function (err) {
        if (err) throw err;
        console.log('Connection to database successful!');
    });
    console.log('The server is listening on port 3000!');
});

/************* FIREWALL  *************/

// Get from headers the x-api-key value, if it is in the database,
app.use(function (req, res, next) {

    console.log("\n\n" + req.originalUrl);
    console.log(req.body);

    if ("key" in req.query) {

        var key = req.query["key"];

        var query = "SELECT * FROM users WHERE apikey='" + key + "'";

        db.query(query, function (err, result, fields) {
            if (err) throw err;

            if (result.length > 0) {
                next();
            }
            else {

                res.status(403).send()
            }
        });


    } else {
        res.status(403).send()
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////                                                                                                                                                     ////
////                                                                           ANIMALS                                                                   ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// get (read) ////////////////////////////////////////////////////////////////////////
app.get('/animals', function (req, res) {

    var query = "SELECT * FROM animals"
    var conditions = ["id", "name", "breed", "birthday", "entry_date", "id_cage", "food_per_day"];

    // Filter sort 
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

    // filter conditions
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

    // filter fields
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    // pagination 
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }


    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

// get (read) a specific data , id in parameters 
app.get('/animals/:id', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id;

    var conditions = ["id", "name", "breed", "birthday", "entry_date", "id_cage", "food_per_day"];

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

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

// Create /////////////////////////////////////////////////////////////////////
app.post('/animals', function (req, res) {
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;

    var query = "INSERT INTO animals " +
        "(name, breed, food_per_day, birthday, entry_date, id_cage ) " +
        "VALUES ('" + name + "', '" + breed + "', '" + food_per_day + "', '" + birthday + "'," +
        "'" + entry_date + "','" + id_cage + "')";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

// Update ///////////////////////////////////////////////////////////////
app.put('/animals/:id', function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;

    var query = "UPDATE animals SET  "

    // Conditions depending on how the body is filled
    if (name != null) {
        var subquery_name = " name = '" + name + "' ,";
        query += subquery_name;
    }

    if (breed != null) {
        var subquery_breed = " breed = '" + breed + "' ,";
        query += subquery_breed;
    }
    if (food_per_day != null) {
        var subquery_fpd = " food_per_day = '" + food_per_day + "' ,";
        query += subquery_fpd;
    }
    if (birthday != null) {
        var subquery_birthday = " birthday = '" + birthday + "' ,";
        query += subquery_birthday;
    }
    if (entry_date != null) {
        var subquery_ed = " entry_date = '" + entry_date + "' ,";
        query += subquery_ed;
    }
    if (id_cage != null) {
        var subquery_id_cage = " id_cage = '" + id_cage + "' ,";
        query += subquery_id_cage;
    }

    // delete the last "," if there is no ",", there are two spaces after SET in the query 
    query = query.slice(0, -1);

    query += " WHERE id = " + id;

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

// Delete ///////////////////////////////////////////////////////////////
app.delete('/animals', function (req, res) {
    var query = "DELETE FROM animals";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.delete('/animals/:id', function (req, res) {

    var id = req.params.id;
    var query = "DELETE FROM animals WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////                                                                                                                                                     ////
////                                                                           CAGES                                                                     ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Exactly the same functionment as animals for the JS 
// delete all 
app.delete('/cages', function (req, res) {

    var query = "DELETE FROM cages";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

// create 
app.post('/cages', function (req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;

    var query = "INSERT INTO cages " +
        "(name, description , area ) " +
        "VALUES ('" + name + "', '" + description + "', '" + area + "')";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

// read all
app.get('/cages', function (req, res) {

    var query = "SELECT * FROM cages"
    var conditions = ["id", "name", "description", "area"];

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

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }



    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

// read specific
app.get('/cages/:id', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + id;

    var conditions = ["id", "name", "description", "area"];

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

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

// Update data (all)
app.put('/cages/:id', function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;

    var query = "UPDATE cages SET  "

    if (name != null) {
        var subquery_name = " name = '" + name + "' ,";
        query += subquery_name;
    }

    if (description != null) {
        var subquery_description = " description = '" + description + "' ,";
        query += subquery_description;
    }
    if (area != null) {
        var subquery_area = " area = '" + area + "' ,";
        query += subquery_area;
    }
    // if there is one, cut the last coma
    query = query.slice(0, -1);

    query += " WHERE id = " + id;


    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

// Delete data 
app.delete('/cages/:id', function (req, res) {

    var id = req.params.id;
    var query = "DELETE FROM cages WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////                                                                                                                                                     ////
////                                                                           FOOD                                                                      ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Exactly the same functionment as animals for the JS 
// Delete all
app.delete('/food', function (req, res) {

    var query = "DELETE FROM food";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
// create
app.post('/food', function (req, res) {
    var name = req.body.name;
    var id_animal = req.body.id_animal;
    var quantity = req.body.quantity;

    var query = "INSERT INTO food " +
        "(id_animal, name, quantity ) " +
        "VALUES ('" + id_animal + "', '" + name + "', '" + quantity + "')";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
// Read all 
app.get('/food', function (req, res) {

    var query = "SELECT * FROM food"
    var conditions = ["id", "id_animal", "name", "quantity"];

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

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
// Read specific Data
app.get('/food/:id', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id= " + id;

    var conditions = ["id", "id_animal", "name", "quantity"];

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

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }


    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
// Update Data (all)
app.put('/food/:id', function (req, res) {
    var id = req.params.id;
    var id_animal = req.body.id_animal;
    var name = req.body.name;
    var quantity = req.body.quantity;

    var query = "UPDATE food SET  "

    // Conditions depending on how the body is filled 
    if (name != null) {
        var subquery_name = " name = '" + name + "' ,";
        query += subquery_name;
    }

    if (id_animal != null) {
        var subquery_id_animal = " id_animal = '" + id_animal + "' ,";
        query += subquery_id_animal;
    }
    if (quantity != null) {
        var subquery_quantity = " quantity = '" + quantity + "' ,";
        query += subquery_quantity;
    }

    query = query.slice(0, -1);

    query += " WHERE id = " + id;


    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
// Delete data 
app.delete('/food/:id', function (req, res) {

    var id = req.params.id;
    var query = "DELETE FROM food WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////                                                                                                                                                     ////
////                                                                           STAFF                                                                     ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Exactly the same functionment as animals for the JS 

// Delete all
app.delete('/staff/', function (req, res) {

    var query = "DELETE FROM staff";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
// create
app.post('/staff', function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;

    var query = "INSERT INTO staff " +
        "(firstname, lastname, wage ) " +
        "VALUES ('" + firstname + "', '" + lastname + "', '" + wage + "')";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
// Read all 
app.get('/staff', function (req, res) {

    var query = "SELECT * FROM staff"

    var conditions = ["id", "firstname", "lastname", "wage"];

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

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }


    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
// Read specific Data
app.get('/staff/:id', function (req, res) {
    var id = req.params.id;

    var query = "SELECT * FROM staff WHERE id = " + id;
    var conditions = ["id", "firstname", "lastname", "wage"];

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

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }



    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
// Update Data 
app.put('/staff/:id', function (req, res) {

    var id = req.params.id;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;

    var query = "UPDATE staff SET  "

    if (firstname != null) {
        var subquery_name = " firstname = '" + firstname + "' ,";
        query += subquery_name;
    }

    if (lastname != null) {
        var subquery_lastname = " lastname = '" + lastname + "' ,";
        query += subquery_lastname;
    }
    if (wage != null) {
        var subquery_wage = " wage = '" + wage + "' ,";
        query += subquery_wage;
    }

    query = query.slice(0, -1);

    query += " WHERE id = " + id;


    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
// Delete data 
app.delete('/staff/:id', function (req, res) {

    var id = req.params.id;
    var query = "DELETE FROM staff WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////                                                                                                                                                     ////
////                                                                           FOOD-STATS                                                                ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Food-stat advanced = if the result is null, return 0

app.get('/food-stats', function (req, res) {

    // We make the division in the query, but we don't know if the result is null or not
    var query = "SELECT animals.id, (food.quantity / animals.food_per_day) as days_left " +
        "FROM food JOIN animals " +
        "ON food.id_animal = animals.id";

    db.query(query, function (err, result, fields) {
        if (err) throw err;

        // So here, we ensure that the result displayed will not be "null"
        // for each tuple returned in the result 
        for (var i = 0; i < result.length; i++) {

            // if days_left is null, set it to 0
            if (result[i].days_left == null) {
                result[i].days_left = 0;
            }
        }

        res.send(JSON.stringify(result));
    });

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////                                                                         RELATIONS                                                                   ////
////                                                                       ANIMALS/CAGES                                                                 ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// First route 
app.get('/animals/:id/cages', function (req, res) {

    var id = req.params.id;
    var query_table = "cages";

    // if filter by fields, change the table in which the query must be made
    if ("fields" in req.query) {
        if (req.query["fields"] == "name" || req.query["fields"] == "description" || req.query["fields"] == "area") {
            query_table = "cages";
        } else {
            query_table = "animals";
        }
    }

    var query = "SELECT " + query_table + ".* FROM animals JOIN cages ON cages.id = animals.id_cage WHERE animals.id=" + id;

    var conditions = ["id", "name", "description", "area"];
    var conditions2 = ["id", "name", "breed", "birthday", "entry_date", "id_cage", "food_per_day"];

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

    for (var index in conditions2) {

        if (conditions2[index] in req.query) {

            if (query.indexOf("WHERE") < 0) {

                query += " WHERE";

            } else {

                query += " AND";

            }

            query += " " + conditions2[index] + "='" +
                req.query[conditions2[index]] + "'";
        }
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

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

// Read One
app.get('/animals/:id_animal/cages/:id_cage', function (req, res) {

    var id_user = req.params.id_animal;
    var id_data = req.params.id_cage;
    var query = "SELECT cages.* FROM animals JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_user + " AND cages.id=" + id_data;

    var conditions = ["id", "name", "description", "area"];

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

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

// Second route other 
app.get('/cages/:id/animals', function (req, res) {

    var id = req.params.id;
    var query = "SELECT animals.* FROM animals JOIN cages ON animals.id_cage = cages.id WHERE cages.id=" + id;

    var conditions = ["id", "name", "breed", "birthday", "entry_date", "id_cage", "food_per_day"];

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

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }



    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////                                                                         RELATIONS                                                                   ////
////                                                                       ANIMALS/FOOD                                                                  ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Exactly the same as for ANIMALS/CAGES

// First route 
app.get('/food/:id/animals', function (req, res) {

    var id = req.params.id;
    var query_table = "animals";

    if ("fields" in req.query) {
        if (req.query["fields"] == "name" || req.query["fields"] == "id_animal" || req.query["fields"] == "quantity") {
            query_table = "food";
        } else {
            query_table = "animals";
        }
    }

    var query = "SELECT " + query_table + ".* FROM animals JOIN food ON animals.id = food.id_animal WHERE food.id=" + id;

    var conditions = ["id", "name", "id_animal", "quantity"];
    var conditions2 = ["id", "name", "breed", "birthday", "entry_date", "id_cage", "food_per_day"];

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

    for (var index in conditions2) {

        if (conditions2[index] in req.query) {

            if (query.indexOf("WHERE") < 0) {

                query += " WHERE";

            } else {

                query += " AND";

            }

            query += " " + conditions2[index] + "='" +
                req.query[conditions2[index]] + "'";
        }
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

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

// Read One
app.get('/food/:id/animals/:id_animal', function (req, res) {

    var id = req.params.id;
    var id_animal = req.params.id_animal;
    var query_table = "animals";

    // To be sure we call the good table if a field is specified in the query
    if ("fields" in req.query) {
        if (req.query["fields"] == "name" || req.query["fields"] == "id_animal" || req.query["fields"] == "quantity") {
            query_table = "food";
        } else {
            query_table = "animals";
        }
    }

    var query = "SELECT " + query_table + ".* FROM animals JOIN food ON animals.id = food.id_animal WHERE food.id=" + id + " AND animals.id = " + id_animal;

    var conditions = ["id", "name", "id_animal", "quantity"];
    var conditions2 = ["id", "name", "breed", "birthday", "entry_date", "id_cage", "food_per_day"];

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

    for (var index in conditions2) {

        if (conditions2[index] in req.query) {

            if (query.indexOf("WHERE") < 0) {

                query += " WHERE";

            } else {

                query += " AND";

            }

            query += " " + conditions2[index] + "='" +
                req.query[conditions2[index]] + "'";
        }
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

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

// Second Route 
app.get('/animals/:id/food', function (req, res) {

    var id = req.params.id;
    var query_table = "food";

    // If a field is specified in the query, we ensure that the good table is called 
    if ("fields" in req.query) {
        if (req.query["fields"] == "name" || req.query["fields"] == "id_animal" || req.query["fields"] == "quantity") {
            query_table = "food";
        } else {
            query_table = "animals";
        }
    }

    var query = "SELECT " + query_table + ".* FROM animals JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;

    var conditions = ["id", "name", "id_animal", "quantity"];
    var conditions2 = ["id", "name", "breed", "birthday", "entry_date", "id_cage", "food_per_day"];

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

    for (var index in conditions2) {

        if (conditions2[index] in req.query) {

            if (query.indexOf("WHERE") < 0) {

                query += " WHERE";

            } else {

                query += " AND";

            }

            query += " " + conditions2[index] + "='" +
                req.query[conditions2[index]] + "'";
        }
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

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});