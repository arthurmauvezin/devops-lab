//require imports the "express" library into the express constant
const express = require('express');


const mysql = require('mysql');

const bodyParser = require('body-parser');
//An express application is created in the app constant
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

//Attention, portsman va demander la requete au port 3000 et pas 3306 sinon il enverrait direct à la db et ça marche pas
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project",
    port: "3306"
});


/////FIREWALL////

app.use(function (req, res, next) {
    if ("key" in req.query) {
        var key = req.query["key"];
        var query = "SELECT * FROM users WHERE apikey='" + key + "'";
        db.query(query, function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                next();
            } else {
                res.status(403).send("Access Forbidden ! ").end();
            }
        });
    } else {
        res.status(403).send("Access Forbidden ! ").end();
    }
});



/*this get function allows to create a route=url and assign an action to it
Route = URL monitored by the applicatioon that will perform a function associated with that route*/
/*Static Access*/
app.get('/', function (req, res) {


    /*Stringify transforms any serializable variable into JSON text*/
    var response = {
        "page": "home",
        "result": result
    };
    res.send(JSON.stringify(response));

});


///ANIMAL///
app.get('/animals', function (req, res) {
    var query = "SELECT * FROM animals"
    var conditions = ["id", "name", "breed", "id_cage", "food_per_day", "birthday", "entry_date"];



    for (var index in conditions) {

        if (conditions[index] in req.query) {

            if (query.indexOf("WHERE") < 0) {

                query += " WHERE";

            } else {

                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";

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
            else query += " ASC,";


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


    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//get animal by ID

app.get('/animals/:id', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id;


    var conditions = ["name", "breed", "id_cage", "food_per_day", "birthday", "entry_date"];



    for (var index in conditions) {

        if (conditions[index] in req.query) {

            {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";

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
            else query += " ASC,";


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






    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
})


//Create animal

app.post('/animals', function (req, res) {

    /*Dans body de postman on va utiliser "username" en Key et n'importe quel nom comme valeur*/
    var animalname = req.body.name;
    var breed = req.body.breed;
    var birthday = req.body.birthday;
    var entry = req.body.entry_date;
    var food_per_day = req.body.food_per_day;
    var cage = req.body.id_cage;
    var query = "INSERT INTO animals (name,breed,birthday,entry_date,food_per_day,id_cage) VALUES ('" + animalname + "','" + breed + "','" + birthday + "','" + entry + "','" + food_per_day + "','" + cage + "')";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//update animal
app.put('/animals/:id', function (req, res) {
    var id = req.params.id;
    var conditions = ["name", "breed", "id_cage", "food_per_day", "birthday", "entry_date"];
    var query = "UPDATE animals ";
    for (var index in conditions) {
        if (conditions[index] in req.body) {
            if (query.indexOf("SET") < 0) {
                query += "SET ";
            } else {
                query += ", ";
            }
            query += " " + conditions[index] + " = '" + req.body[conditions[index]] + "' ";
        }

    }
    query += " WHERE id = '" + id + "'";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


//Delete animals

app.delete('/animals', function (req, res) {


    var query = "DELETE FROM animals";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });



});

//delete animal by id

app.delete('/animals/:id', function (req, res) {

    var id = req.params.id;
    var query = "DELETE FROM animals WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });



});





///CAGES///
app.get('/cages', function (req, res) {
    var query = "SELECT * FROM cages"
    var conditions = ["id", "name", "description", "area"];


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

//find cage by id
app.get('/cages/:id', function (req, res) {
    var id = req.params.id;
    var conditions = ["name", "description", "area"];
    var query = "SELECT * FROM cages WHERE id=" + id;




    for (var index in conditions) {

        if (conditions[index] in req.query) {

            {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";

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
            else query += " ASC,";


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









    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
})


//Create cage
app.post('/cages', function (req, res) {

    var id = req.body.id;
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;

    var query = "INSERT INTO cages (name,description,area) VALUES ('" + name + "','" + description + "','" + area + "')";

    //   var query = "INSERT INTO cages (id, name, description, area) VALUES ('" + id + "','" + name + "','" + description + "','" + area + "')";



    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


//Update cage
app.put('/cages/:id', function (req, res) {

    var id = req.params.id;
    var conditions = ["name", "description", "area"];
    var query = "UPDATE cages ";
    for (var index in conditions) {
        if (conditions[index] in req.body) {
            if (query.indexOf("SET") < 0) {
                query += "SET ";
            } else {
                query += ", ";
            }
            query += " " + conditions[index] + " = '" + req.body[conditions[index]] + "' ";
        }

    }
    query += " WHERE id = '" + id + "'";


    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });


});



//delete all cages
app.delete('/cages', function (req, res) {


    var query = "DELETE FROM cages";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });



});


//delete cage by id
app.delete('/cages/:id', function (req, res) {

    var id = req.params.id;
    var query = "DELETE FROM cages WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });



});

///FOOD///

//find food

app.get('/food', function (req, res) {

    var query = "SELECT * FROM food"
    var conditions = ["id", "name", "id_animal", "quantity"];


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


//find food by id
app.get('/food/:id', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;

    var conditions = ["name", "id_animal", "quantity"];



    for (var index in conditions) {

        if (conditions[index] in req.query) {

            {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";

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
            else query += " ASC,";


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









    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
})

//create food
app.post('/food', function (req, res) {


    var name = req.body.name;
    var animalId = req.body.id_animal;
    var quantity = req.body.quantity;

    var query = "INSERT INTO food (name, id_animal, quantity) VALUES ('" + name + "','" + animalId + "','" + quantity + "')";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


//update food
app.put('/food/:id', function (req, res) {

    var id = req.params.id;
    var conditions = ["name", "id_animal", "quantity"];
    var query = "UPDATE food ";
    for (var index in conditions) {
        if (conditions[index] in req.body) {
            if (query.indexOf("SET") < 0) {
                query += "SET ";
            } else {
                query += ", ";
            }
            query += " " + conditions[index] + " = '" + req.body[conditions[index]] + "' ";
        }

    }
    query += " WHERE id = '" + id + "'";


    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });


});


//delete food
app.delete('/food', function (req, res) {
    var query = "DELETE FROM food";
    db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Delete"));
    });
});

//delete food by id
app.delete('/food/:id', function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM food WHERE id= '" + id + "'";
    db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Delete"));
    });
});





///FOOD-STAT///
app.get('/food-stats', function (req, res) {
    var query = "SELECT b.id, (quantity/food_per_day) AS days_left FROM FOOD a JOIN ANIMALS b ON a.id_animal = b.id";



    db.query(query, function (err, result, fields) {
        if (err) throw err;

        for (var i = 0; i < result.length; i++) {
            if (result[i].days_left == null) {
                result[i].days_left = 0;

            }

        }

        res.send(JSON.stringify(result));
    });
});

///////////STAFF

//find staff
app.get('/staff', function (req, res) {

    var query = "SELECT * FROM staff"
    var conditions = ["id", "firstname", "lastname", "wage"];


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

//find staff by id
app.get('/staff/:id', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id;
    var conditions = ["firstname", "lastname", "wage"];

    for (var index in conditions) {

        if (conditions[index] in req.query) {

            {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";

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
            else query += " ASC,";


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









    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

////////////////////-POST-////////////////////////////////////

//create staff
app.post('/staff', function (req, res) {

    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    var wage = req.body.wage;
    var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('" + firstName + "', '" + lastName + "', '" + wage + "');";
    db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Create"));
    });
});



//update staff

app.put('/staff/:id', function (req, res) {
    var id = req.params.id;
    var conditions = ["firstname", "lastname", "wage"];
    var query = "UPDATE staff ";
    for (var index in conditions) {
        if (conditions[index] in req.body) {
            if (query.indexOf("SET") < 0) {
                query += "SET ";
            } else {
                query += ", ";
            }
            query += " " + conditions[index] + " = '" + req.body[conditions[index]] + "' ";
        }

    }
    query += " WHERE id = '" + id + "'";


    db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Update"));
    });

});

//Delete staff
app.delete('/staff', function (req, res) {
    var query = "DELETE FROM staff";
    db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Delete"));
    });
});


//delete staff by id
app.delete('/staff/:id', function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM staff WHERE id= '" + id + "'";
    db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Delete"));
    });
});









////RELATIONSHIPS/////////////////

//Animals to cage
app.get('/animals/:id/cages', function (req, res) {
    var id = req.params.id;
    var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON cages.id = animals.id_cage WHERE animals.id=" + id;

    var conditions = ["name", "description", "area"];

    for (var index in conditions) {

        if (conditions[index] in req.query) {

            {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";

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
            else query += " ASC,";


        }

        query = query.slice(0, -1);

    }

    if ("fields" in req.query) {
        query = query.replace("cages.id, cages.name, cages.description, cages.area", req.query["fields"]);
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





// Animals to one  cage
app.get('/animals/:id/cages/:cage_id', function (req, res) {
    var id_animal = req.params.id;
    var id_cage = req.params.cage_id;
    var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON cages.id = animals.id_cage WHERE animals.id=" + id_animal + " AND cages.id=" + id_cage;

    var conditions = ["name", "description", "area"];

    for (var index in conditions) {

        if (conditions[index] in req.query) {

            {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";

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
            else query += " ASC,";


        }

        query = query.slice(0, -1);

    }

    if ("fields" in req.query) {
        query = query.replace("cages.id, cages.name, cages.description, cages.area", req.query["fields"]);
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


//cage to animal

app.get('/cages/:id/animals', function (req, res) {
    var id = req.params.id;
    var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN cages ON cages.id = animals.id_cage WHERE cages.id=" + id;


    var conditions = ["name", "breed", "id_cage", "food_per_day", "birthday", "entry_date"];


    for (var index in conditions) {

        if (conditions[index] in req.query) {

            {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";

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
            else query += " ASC,";


        }

        query = query.slice(0, -1);

    }

    if ("fields" in req.query) {
        query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", req.query["fields"]);
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

//Animals to food

app.get('/animals/:id/food', function (req, res) {
    var id = req.params.id;
    var query = "SELECT food.id, food.name, food.quantity FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;


    var conditions = ["name", "id_animal", "quantity"];

    for (var index in conditions) {

        if (conditions[index] in req.query) {

            {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";

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
            else query += " ASC,";


        }

        query = query.slice(0, -1);

    }

    if ("fields" in req.query) {
        query = query.replace("food.id, food.name, food.quantity", req.query["fields"]);
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


//Animals to food
app.get('/food/:id/animals', function (req, res) {
    var id = req.params.id;
    var query = "SELECT animals.id, animals.name, animals.food_per_day, animals.birthday, animals.entry_date FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + id;



    var conditions = ["name", "breed", "id_cage", "food_per_day", "birthday", "entry_date"];

    for (var index in conditions) {

        if (conditions[index] in req.query) {

            {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";

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
            else query += " ASC,";


        }

        query = query.slice(0, -1);

    }

    if ("fields" in req.query) {
        query = query.replace("animals.id, animals.name, animals.food_per_day, animals.birthday, animals.entry_date", req.query["fields"]);
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


//Animals to one food
app.get('/food/:id/animals/:id_animal', function (req, res) {
    var id = req.params.id;
    var id_animal = req.params.id_animal;
    var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.entry_date, animals.id_cage FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE animals.id=" + id_animal + " AND food.id=" + id;

    var conditions = ["name", "breed", "id_cage", "food_per_day", "birthday", "entry_date"];

    for (var index in conditions) {

        if (conditions[index] in req.query) {

            if (query.indexOf("WHERE") < 0) {

                query += " WHERE";

            } else {

                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";

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
            else query += " ASC,";


        }

        query = query.slice(0, -1);

    }

    if ("fields" in req.query) {
        query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.entry_date, animals.id_cage", req.query["fields"]);
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

app.listen(3000, function () {

    db.connect(function (err) {
        if (err) throw err;
        console.log('Connection to database successful!');
    });

    //Callback function is called after the application is succesfully started
    console.log('Example app listening on port 3000');

});
