/*
    ZOO WebService
    Author : Dorian CLISSON
    Contact : dorian.clisson@edu.ece.fr
*/



    // INCLUDES & CONF
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));



    // SQL CONNECTION
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "zoo",
    port: "3306",
});



    // PORT TO LISTEN
app.listen(3000, function() {
    db.connect(function(err) {
        if(err) throw err;
        console.log('Connection to database successful!')
    });

    console.log('Example app listening on port 3000!');
});



    // FIREWALL
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
                res.sendStatus(403);
            }
        });
    } else {
        res.sendStatus(403);
    }
});



    // ANIMALS

//CREATE ANIMAL
app.post('/animals', function(req, res) {
    let name = req.body.name;
    let breed = req.body.breed;
    let food_per_day = req.body.food_per_day;
    let birthday = req.body.birthday;
    let entry_date = req.body.entry_date;
    let id_cage = req.body.id_cage;

    let query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" + name + "','" + breed + "'," + food_per_day + ",'" + birthday + "','" + entry_date + "'," + id_cage + ")";

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify("Animal inserted !"));
    });
});

//READ ALL ANIMALS
app.get('/animals', function(req, res) {
    var prequery = "SELECT * FROM animals";

    //FILTRES
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    var query = filter(req, prequery, conditions);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//READ ANIMAL BY ID
app.get('/animals/:id(\\d+)', function(req, res) {
    let id = req.params.id;

    var prequery = "SELECT * FROM animals WHERE id = " + id;

    //FILTRES
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    var query = filter(req, prequery, conditions);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//RELATION ANIMALS TO FOOD
app.get('/animals/:id(\\d+)/food', function(req, res) {
    let id = req.params.id;

    var prequery = "SELECT food.* FROM food INNER JOIN animals on food.id_animal = animals.id WHERE animals.id = " + id;

    //FILTRES
    var conditions = ["name", "quantity", "id_animal"];
    var query = filter(req, prequery, conditions);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//RELATION ANIMALS TO CAGES
app.get('/animals/:id(\\d+)/cages', function(req, res) {
    let id = req.params.id;

    var prequery = "SELECT cages.* FROM animals INNER JOIN cages on cages.id = animals.id_cage WHERE animals.id = " + id;

    //FILTRES
    var conditions = ["name", "description", "area"];
    var query = filter(req, prequery, conditions);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//RELATION ANIMALS TO CAGES (WITH BOTH IDs)
app.get('/animals/:id(\\d+)/cages/:id_cage(\\d+)', function(req, res) {
    let id = req.params.id;
    let id_cage = req.params.id_cage;

    var prequery = "SELECT cages.* FROM animals INNER JOIN cages on cages.id = animals.id_cage WHERE animals.id = " + id + " AND cages.id = " + id_cage;

    //FILTRES
    var conditions = ["name", "description", "area"];
    var query = filter(req, prequery, conditions);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//UPDATE ANIMAL BY ID
app.put('/animals/:id(\\d+)', function(req, res) {
    let id = req.params.id;

    var query = "UPDATE animals SET ";

    next_need_comma = false;

    if(req.body.name){
        query = query + "name = '" + req.body.name + "'";
        next_need_comma = true;
    }
    if(req.body.breed){
        if(next_need_comma) query = query + ", ";
        query = query + "breed = '" + req.body.breed + "'";
        next_need_comma = true;
    }
    if(req.body.food_per_day){
        if(next_need_comma) query = query + ", ";
        query = query + "food_per_day = '" + req.body.food_per_day + "'";
        next_need_comma = true;
    }
    if(req.body.birthday){
        if(next_need_comma) query = query + ", ";
        query = query + "birthday = '" + req.body.birthday + "'";
        next_need_comma = true;
    }
    if(req.body.entry_cage){
        if(next_need_comma) query = query + ", ";
        query = query + "entry_cage = '" + req.body.entry_cage + "'";
        next_need_comma = true;
    }
    if(req.body.id_cage){
        if(next_need_comma) query = query + ", ";
        query = query + "id_cage = '" + req.body.id_cage + "'";
    }

    query = query + " WHERE id = " + id;

    if(req.body.name || req.body.breed || req.body.food_per_day || req.body.birthday || req.body.entry_cage || req.body.id_cage){
        db.query(query, function(err, result, fields) {
            if(err) throw err;

            res.send(JSON.stringify("Animal modified !"));
        });
    }
});

//DELETE ALL ANIMALS
app.delete('/animals', function(req, res) {
    let query = "DELETE FROM animals";

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify("ALL Animals deleted !"));
    });
});

//DELETE ANIMAL BY ID
app.delete('/animals/:id(\\d+)', function(req, res) {
    let id = req.params.id;

    let query = "DELETE FROM animals WHERE id = " + id;

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify("Animal deleted !"));
    });
});



    // CAGES

//CREATE CAGE
app.post('/cages', function(req, res) {
    let name = req.body.name;
    let description = req.body.description;
    let area = req.body.area;

    let query = "INSERT INTO cages (name,description,area) VALUES ('" + name + "','" + description + "'," + area + ")";

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify("Cage inserted !"));
    });
});

//READ ALL CAGES
app.get('/cages', function(req, res) {
    var prequery = "SELECT * FROM cages";

    //FILTRES
    var conditions = ["name", "description", "area"];
    var query = filter(req, prequery, conditions);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//READ CAGE BY ID
app.get('/cages/:id(\\d+)', function(req, res) {
    let id = req.params.id;

    var prequery = "SELECT * FROM cages WHERE id = " + id;

    //FILTRES
    var conditions = ["name", "description", "area"];
    var query = filter(req, prequery, conditions);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//RELATION CAGES TO ANIMALS
app.get('/cages/:id(\\d+)/animals', function(req, res) {
    let id = req.params.id;

    var prequery = "SELECT animals.* FROM animals INNER JOIN cages on cages.id = animals.id_cage WHERE cages.id = " + id;

    //FILTRES
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    var query = filter(req, prequery, conditions);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//UPDATE CAGE BY ID
app.put('/cages/:id(\\d+)', function(req, res) {
    let id = req.params.id;

    var query = "UPDATE cages SET ";

    var next_need_comma = false;

    if(req.body.name){
        query = query + "name = '" + req.body.name + "'";
        next_need_comma = true;
    }

    if(req.body.description){
        if(next_need_comma) query = query + ", ";
        query = query + "description = '" + req.body.description + "'";
        next_need_comma = true;
    }

    if(req.body.area){
        if(next_need_comma) query = query + ", ";
        query = query + "area = " + req.body.area;
    }

    query = query + " WHERE id = " + id;

    if(req.body.name || req.body.description || req.body.area){
        db.query(query, function(err, result, fields) {
            if(err) throw err;

            res.send(JSON.stringify("Cage modified !"));
        });
    }
});

//DELETE ALL CAGES
app.delete('/cages', function(req, res) {
    let query = "DELETE FROM cages";

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify("ALL Cages deleted !"));
    });
});

//DELETE CAGE BY ID
app.delete('/cages/:id(\\d+)', function(req, res) {
    let id = req.params.id;

    let query = "DELETE FROM cages WHERE id = " + id;

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify("Cage deleted !"));
    });
});



    // FOOD

//CREATE FOOD
app.post('/food', function(req, res) {
    let name = req.body.name;
    let quantity = req.body.quantity;
    let id_animal = req.body.id_animal;

    let query = "INSERT INTO food (name,quantity,id_animal) VALUES ('" + name + "'," + quantity + "," + id_animal + ")";

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify("Food inserted !"));
    });
});

//READ ALL FOOD
app.get('/food', function(req, res) {
    var prequery = "SELECT * FROM food";

    //FILTRES
    var conditions = ["name", "quantity", "id_animal"];
    var query = filter(req, prequery, conditions);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//READ FOOD BY ID
app.get('/food/:id(\\d+)', function(req, res) {
    let id = req.params.id;

    var prequery = "SELECT * FROM food WHERE id = " + id;

    //FILTRES
    var conditions = ["name", "quantity", "id_animal"];
    var query = filter(req, prequery, conditions);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//RELATION FOOD TO ANIMALS
app.get('/food/:id(\\d+)/animals', function(req, res) {
    let id = req.params.id;

    var prequery = "SELECT animals.* FROM animals INNER JOIN food on food.id_animal = animals.id WHERE food.id = " + id;

    //FILTRES
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    var query = filter(req, prequery, conditions);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//RELATION FOOD TO ANIMALS (WITH BOTH IDs)
app.get('/food/:id(\\d+)/animals/:id_animal(\\d+)', function(req, res) {
    let id = req.params.id;
    let id_animal = req.params.id_animal;

    var prequery = "SELECT animals.* FROM animals INNER JOIN food on food.id_animal = animals.id WHERE food.id = " + id + " AND animals.id = " + id_animal;

    //FILTRES
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    var query = filter(req, prequery, conditions);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//UPDATE FOOD BY ID
app.put('/food/:id(\\d+)', function(req, res) {
    let id = req.params.id;

    var query = "UPDATE food SET ";

    var next_need_comma = false;

    if(req.body.name){
        query = query + "name = '" + req.body.name + "'";
        next_need_comma = true;
    }

    if(req.body.id_animal){
        if(next_need_comma) query = query + ", ";
        query = query + "id_animal = '" + req.body.id_animal + "'";
        next_need_comma = true;
    }

    if(req.body.quantity){
        if(next_need_comma) query = query + ", ";
        query = query + "quantity = " + req.body.quantity;
    }

    query = query + " WHERE id = " + id;

    if(req.body.name || req.body.id_animal || req.body.quantity){
        db.query(query, function(err, result, fields) {
            if(err) throw err;

            res.send(JSON.stringify("Food modified !"));
        });
    }
});

//DELETE ALL FOOD
app.delete('/food', function(req, res) {
    let query = "DELETE FROM food";

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify("ALL Food deleted !"));
    });
});

//DELETE FOOD BY ID
app.delete('/food/:id(\\d+)', function(req, res) {
    let id = req.params.id;

    let query = "DELETE FROM food WHERE id = " + id;

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify("Food deleted !"));
    });
});



    //  STAFF

//CREATE STAFF
app.post('/staff', function(req, res) {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let wage = req.body.wage;

    let query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('" + firstname + "','" + lastname + "'," + wage + ")";

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify("Staff inserted !"));
    });
});

//READ ALL STAFF
app.get('/staff', function(req, res) {
    var prequery = "SELECT * FROM staff";

    //FILTRES
    var conditions = ["firstname", "lastname", "wage"];
    var query = filter(req, prequery, conditions);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//READ STAFF BY ID
app.get('/staff/:id(\\d+)', function(req, res) {
    let id = req.params.id;

    var prequery = "SELECT * FROM staff WHERE id = " + id;

    //FILTRES
    var conditions = ["firstname", "lastname", "wage"];
    var query = filter(req, prequery, conditions);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//UPDATE STAFF BY ID
app.put('/staff/:id(\\d+)', function(req, res) {
    let id = req.params.id;

    var query = "UPDATE staff SET ";

    var next_need_comma = false;

    if(req.body.firstname){
        query = query + "firstname = '" + req.body.firstname + "'";
        next_need_comma = true;
    }

    if(req.body.lastname){
        if(next_need_comma) query = query + ", ";
        query = query + "lastname = '" + req.body.lastname + "'";
        next_need_comma = true;
    }

    if(req.body.wage){
        if(next_need_comma) query = query + ", ";
        query = query + "wage = '" + req.body.wage + "'";
    }

    query = query + " WHERE id = " + id;

    if(req.body.firstname || req.body.lastname || req.body.wage){
        db.query(query, function(err, result, fields) {
            if(err) throw err;

            res.send(JSON.stringify("Staff modified !"));
        });
    }
});

//DELETE ALL STAFF
app.delete('/staff', function(req, res) {
    let query = "DELETE FROM staff";

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify("ALL Staff deleted !"));
    });
});

//DELETE STAFF BY ID
app.delete('/staff/:id(\\d+)', function(req, res) {
    let id = req.params.id;

    let query = "DELETE FROM staff WHERE id = " + id;

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify("Staff deleted !"));
    });
});



    // STATS
app.get('/food-stats', function(req, res) {
    let query = "SELECT animals.id, COALESCE(somme/food_per_day, 0) as days_left FROM animals JOIN (SELECT id_animal, SUM(quantity) as somme FROM food GROUP BY id_animal)T ON animals.id = T.id_animal";
    //OUI JE NE VOULAIS PAS LE FAIRE EN JS DONC FULL SQL BÔ JEU ADVANCED FOOD STATS EASY

    db.query(query, function(err, result, fields) {
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});



    // FILTRES
function filter(req, query, conditions){
    //FILTRES DE CONDITION
    for (var index in conditions){
        if (conditions[index] in req.query){
            if (query.indexOf("WHERE") < 0){
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    //FILTRE D'ORDRE
    if ("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";

        for (var index in sort){

            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;

            if (direction == "-"){
                query += " DESC,";
            } else {
                query += " ASC,";
            }
        }
        query = query.slice(0, -1);
    }

    //FILTRE DE CHAMPS
    if ("fields" in req.query){
        query = query.replace("*", req.query["fields"]);
    }

    //FILTRE DE PAGINATION
    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];

        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }
    return query;
}
