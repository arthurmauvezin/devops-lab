const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "zoo",
    port: "3306"
});





//FOOD STATS
app.get('/food-stats', function(req, res) {
    var query = "SELECT animals.id as id, coalesce((quantity/food_per_day),0) as days_left FROM animals inner join food on animals.id=food.id_animal";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


//POST 
app.post('/animals', function(req, res) {
    var Nom = req.body.name;
    var Race = req.body.breed;
    var Nourriture = req.body.food_per_day;
    var Naissance = req.body.birthday;
    var Entree = req.body.entry_date;
    var CID = req.body.id_cage;
    var query = "INSERT INTO animals(name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" + Nom + "','" + Race + "'," + Nourriture + ",'" + Naissance + "','" + Entree + "'," + CID + ")";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


app.post('/cages', function(req, res) {
    var Nom = req.body.name;
    var Description = req.body.description;
    var Taille = req.body.area;
    var query = "INSERT INTO cages(name,description,area) VALUES ('" + Nom + "','" + Description + "'," + Taille + ")";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


app.post('/food', function(req, res) {
    var Nom = req.body.name;
    var Quantite = req.body.quantity;
    var AID = req.body.id_animal;
    var query = "INSERT INTO food(name,quantity,id_animal) VALUES ('" + Nom + "'," + Quantite + "," + AID + ")";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


app.post('/staff', function(req, res) {
    var Nom = req.body.firstname;
    var Prenom = req.body.lastname;
    var Salaire = req.body.wage;
    var query = "INSERT INTO staff(firstname,lastname,wage) VALUES ('" + Nom + "','" + Prenom + "'," + Salaire + ")";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});







//PUT Possible sur un champ
app.put('/animals/:id', function(req, res) {
    var id = req.params.id;
    var query = "UPDATE animals SET ";
    var virgule = 0;

    if (req.body.name != null) {
        var name = req.body.name;
        query += " name = '" + name + "' ";
        virgule = 1;
    }
    if (req.body.breed != null) {
        if (virgule == 1) {
            query += ", ";
        }
        var breed = req.body.breed;
        query += " breed = '" + breed + "' ";
        virgule = 1;
    }
    if (req.body.birthday != null) {
        if (virgule == 1) {
            query += ", ";
        }
        var birthday = req.body.birthday;
        query += " birthday = '" + birthday + "' ";
        virgule = 1;
    }
    if (req.body.food_per_day != null) {
        if (virgule == 1) {
            query += ", ";
        }
        var food_per_day = req.body.food_per_day;
        query += " food_per_day = '" + food_per_day + "' ";
        virgule = 1;
    }
    if (req.body.entry_date != null) {
        if (virgule == 1) {
            query += ", ";
        }
        var entry_date = req.body.entry_date;
        query += " entry_date = '" + entry_date + "' ";
        virgule = 1;
    }
    if (req.body.id_cage != null) {
        if (virgule == 1) {
            query += ", ";
        }
        var id_cage = req.body.id_cage;
        query += " id_cage = " + id_cage;
        virgule = 1;
    }
    query += " WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


app.put('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "UPDATE cages SET ";
    var virgule = 0;

    if (req.body.name != null) {
        var name = req.body.name;
        query += " name = '" + name + "' ";
        virgule = 1;
    }
    if (req.body.area != null) {
        if (virgule == 1) {
            query += ", ";
        }
        var area = req.body.area;
        query += " area = " + area;
        virgule = 1;
    }
    if (req.body.description != null) {
        if (virgule == 1) {
            query += ", ";
        }
        var description = req.body.description;
        query += " description = '" + description + "' ";
        virgule = 1;
    }
    query += " WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


app.put('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "UPDATE food SET ";
    var virgule = 0;

    if (req.body.name != null) {
        var name = req.body.name;
        query += " name = '" + name + "' ";
        virgule = 1;
    }
    if (req.body.quantity != null) {
        if (virgule == 1) {
            query += ", ";
        }
        var quantity = req.body.quantity;
        query += " quantity = " + quantity;
        virgule = 1;
    }
    if (req.body.id_animal != null) {
        if (virgule == 1) {
            query += ", ";
        }
        var id_animal = req.body.id_animal;
        query += " id_animal = " + id_animal;
        virgule = 1;
    }
    query += " WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


app.put('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "UPDATE staff SET ";
    var virgule = 0;

    if (req.body.firstname != null) {
        var firstname = req.body.firstname;
        query += " firstname = '" + firstname + "' ";
        virgule = 1;
    }
    if (req.body.wage != null) {
        if (virgule == 1) {
            query += ", ";
        }
        var wage = req.body.wage;
        query += " wage = " + wage;
        virgule = 1;
    }
    if (req.body.lastname != null) {
        if (virgule == 1) {
            query += ", ";
        }
        var lastname = req.body.lastname;
        query += " lastname = '" + lastname + "' ";
        virgule = 1;
    }
    query += " WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});





//DELETE
app.delete('/animals/:id', function(req, res) {
    var AID = req.params.id;
    var query = "DELETE FROM animals WHERE id=" + AID;
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


app.delete('/cages/:id', function(req, res) {
    var CID = req.params.id;
    var query = "DELETE FROM cages WHERE id=" + CID;
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


app.delete('/food/:id', function(req, res) {
    var NID = req.params.id;
    var query = "DELETE FROM food WHERE id=" + NID;
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


app.delete('/staff/:id', function(req, res) {
    var PID = req.params.id;
    var query = "DELETE FROM staff WHERE id=" + PID;
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





//GET ROUTE NORMAL
app.get('/animals', function(req, res) {
    var query = "SELECT * FROM animals";
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
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
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


app.get('/cages', function(req, res) {
    var query = "SELECT * FROM cages";
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
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
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


app.get('/food', function(req, res) {
    var query = "SELECT * FROM food";
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
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
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


app.get('/staff', function(req, res) {
    var query = "SELECT * FROM staff";
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
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
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






//GET ROUTE PARAM ID
app.get('/animals/:id', function(req, res) {
    var AID = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + AID;

    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    for (var index in conditions) {
        if (conditions[index] in req.query) {
            query += " AND";
            query += " " + conditions[index] + "='" +
                req.query[conditions[index]] + "'";
        }
    }

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
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
    var AID = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + AID;
    var conditions = ["name", "description", "area"];
    for (var index in conditions) {
        if (conditions[index] in req.query) {
            query += " AND";
            query += " " + conditions[index] + "='" +
                req.query[conditions[index]] + "'";
        }
    }

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
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
    var AID = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + AID;
    var conditions = ["name", "id_animal", "quantity"];
    for (var index in conditions) {
        if (conditions[index] in req.query) {
            query += " AND";
            query += " " + conditions[index] + "='" +
                req.query[conditions[index]] + "'";
        }
    }

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
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
    var AID = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + AID;
    var conditions = ["firstname", "lastname", "wage"];
    for (var index in conditions) {
        if (conditions[index] in req.query) {
            query += " AND";
            query += " " + conditions[index] + "='" +
                req.query[conditions[index]] + "'";
        }
    }

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
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




//RELATION
app.get('/animals/:id_animal/cages', function(req, res) {
    var id_animals = req.params.id_animal;
    var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id";
   
  var conditions = ["cages.name", "description", "area"];
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

app.get('/cages/:id_cages/animals', function(req, res) {
    var id_cages = req.params.id_cages;
    var query = "SELECT animals.* FROM cages INNER JOIN animals ON animals.id_cage = cages.id";
    var conditions = ["animals.name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
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



app.get('/animals/:id_animals/food', function(req, res) {
    var id_animals = req.params.id_animals;
    var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id= food.id_animal";
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
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
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


app.get('/food/:id_food/animals', function(req, res) {
    var id_food = req.params.id_food;
    var query = "SELECT animals.* FROM food INNER JOIN animals ON animals.id = food.id_animal WHERE food.id=" + id_food;
    var conditions = ["animals.name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
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




//FIREWALL
app.use(function(req, res, next) {
    if ("key" in req.query) {
        var key = req.query["key"];
        var query = "SELECT * FROM users WHERE apikey='" + key + "'";
        db.query(query, function(err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                next();
            } else {
                res.status(404).send("Access denied", );
            }
        });
    } else {
        res.status(404).send("Access denied");
    }
});




//LISTEN
app.listen(3000, function() {
    db.connect(function(err) {
        if (err) throw err;
        console.log('Connection to database successful!');
    });
    console.log('Example app listening on port 3000!');
});