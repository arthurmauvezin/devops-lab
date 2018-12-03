
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "zoo",
    port: "3307"
});


////////////////////////////////////////TP1/////////////////////////////////////////////



////////////////////////////////////////TP2//////////////////////////////////////////////

//Creation

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
                res.send("Access denied",403);
            }
        });
    } else {
        res.send("Access denied", 403);
    }
});
app.post('/food', function(req, res) {
    var id_animal = req.body.id_animal;
    var name = req.body.name;
    var quantity = req.body.quantity;
    var query = "INSERT INTO food (name,quantity,id_animal) VALUES ('"+name+"','"+quantity+"','"+id_animal+"')";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.post('/cages', function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    var query = "INSERT INTO cages (name,description,area) VALUES ('"+name+"','"+description+"','"+area+"')";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.post('/animals', function(req, res) {
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;
    var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('"+name+"','"+breed+"','"+food_per_day+"','"+birthday+"','"+entry_date+"','"+id_cage+"')";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.post('/staff', function(req, res)   {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('"+firstname+"','"+lastname+"','"+wage+"')";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.post('/users', function(req, res) {
    var username = req.body.username;
    var apikey = req.body.apikey;
    var query = "INSERT INTO users (username, apikey) VALUES ('" + username + "','"+apikey+"')";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.post('/data', function(req, res) {
    var userId = req.body.user_id;
    var value = req.body.value;
    var query = "INSERT INTO data (user_id,value) VALUES ('" + userId + "','"+value+"')";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


//Lecture

app.get('/food', function(req, res) {
    var query = "SELECT * FROM food";
    var conditions = ["id_animal", "name","quantity"];
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/food/:id', function(req, res) {
    var id = req.params.id;
    var conditions = ["id_animal", "name","quantity"];
    var query = "SELECT * FROM food WHERE id=" + id;
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/cages', function(req, res) {
    var query = "SELECT * FROM cages";
    var conditions = ["description", "name","area"];
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/cages/:id', function(req, res) {
    var id = req.params.id;
    var conditions = ["description", "name","area"];
    var query = "SELECT * FROM cages WHERE id=" + id;
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/animals', function(req, res) {
    var query = "SELECT * FROM animals";
    var conditions = ["breed", "name","food_per_day","birthday","entry_date","id_cage"];
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/animals/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id;
    var conditions = ["breed", "name","food_per_day","birthday","entry_date","id_cage"];
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/staff', function(req, res) {
    var query = "SELECT * FROM staff";
    var conditions = ["firstname", "lastname", "wage"];
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id;
    var conditions = ["firstname", "lastname", "wage"];
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


app.get('/users', function(req, res) {
    var query = "SELECT * FROM users";
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
app.get('/users/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM users WHERE id=" + id;
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
app.get('/data', function(req, res) {
    var query = "SELECT * FROM data";
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/data/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM data WHERE id=" + id;
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


//Upload

app.put('/food/:id', function(req, res) {
    var tab=[];
    var query = "UPDATE food SET ";
    var id = req.params.id;
    var name = req.body.name;
    tab[1]=name;
    var quantity = req.body.quantity;
    tab[2]=quantity;
    var id_animal = req.body.id_animal;
    tab[3]=id_animal;
    for (var i=1; i<=3; i++){
        if (!((tab[i]==undefined)||(tab[i]=='undefined'))){
            if (i == 1) {
                query += "name = '" + tab[i] + "',";
            }else if (i == 2) {
                query += "quantity = '" + tab[i] + "',";
            }else if (i == 3) {
                query += "id_animal = '" + tab[i] + "',";
            }
        }
    }
    query = query.substr(0,query.length-1);
    query += "WHERE id = " + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.put('/cages/:id', function(req, res) {
    var tab=[];
    var query = "UPDATE cages SET ";
    var id = req.params.id;
    var name = req.body.name;
    tab[1]=name;
    var description = req.body.description;
    tab[2]=description;
    var area = req.body.area;
    tab[3]=area;
    for (var i=1; i<=3; i++){
        if (!((tab[i]==undefined)||(tab[i]=='undefined'))){
            if (i == 1) {
                query += "name = '" + tab[i] + "',";
            }else if (i == 2) {
                query += "description = '" + tab[i] + "',";
            }else if (i == 3) {
                query += "area = '" + tab[i] + "',";
            }
        }
    }
    query = query.substr(0,query.length-1);
    query += "WHERE id = " + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.put('/animals/:id', function(req, res) {
    var tab=[];
    var query = "UPDATE animals SET ";
    var id = req.params.id;
    var name = req.body.name;
    tab[1]=name;
    var breed = req.body.breed;
    tab[2]=breed;
    var food_per_day = req.body.food_per_day;
    tab[3]=food_per_day;
    var birthday = req.body.birthday;
    tab[4]=birthday;
    var entry_date = req.body.entry_date;
    tab[5]=entry_date;
    var id_cage = req.body.id_cage;
    tab[6]=id_cage;
    for (var i=1; i<=6; i++){
        if (!((tab[i]==undefined)||(tab[i]=='undefined'))){
            if (i == 1) {
                query += "name = '" + tab[i] + "',";
            }else if (i == 2) {
                query += "breed = '" + tab[i] + "',";
            }else if (i == 3) {
                query += "food_per_day = '" + tab[i] + "',";
            }else if (i == 4) {
                query += "birthday = '" + tab[i] + "',";
            }else if (i == 5) {
                query += "entry_date = '" + tab[i] + "',";
            }else if (i == 6) {
                query += "id_cage = '" + tab[i] + "',";
            }
        }
    }
    query = query.substr(0,query.length-1);
    query += "WHERE id = " + id;
    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.put('/staff/:id', function(req, res) {
    var tab=[];
    var query = "UPDATE staff SET ";
    var id = req.params.id;
    var firstname = req.body.firstname;
    tab[1]=firstname;
    var lastname = req.body.lastname;
    tab[2]=lastname;
    var wage = req.body.wage;
    tab[3]=wage;
    for (var i=1; i<=3; i++){
        if (!((tab[i]==undefined)||(tab[i]=='undefined'))){
            if (i == 1) {
                query += "firstname = '" + tab[i] + "',";
            }else if (i == 2) {
                query += "lastname = '" + tab[i] + "',";
            }else if (i == 3) {
                query += "wage = '" + tab[i] + "',";
            }
        }
    }
    query = query.substr(0,query.length-1);
    query += "WHERE id = " + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.put('/users/:id', function(req, res) {
    var id = req.params.id;
    var username = req.body.username;
    var apikey = req.body.apikey;
    var query = "UPDATE users SET username = '" + username + "' ,apikey = '" + apikey + "' WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.put('/data/:id', function(req, res) {
    var id = req.params.id;
    var user_id = req.body.user_id;
    var value = req.body.apikey;
    var query = "UPDATE data SET (user_id = '" + user_id + "' ,value = '" + value + "') WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//Suppression données

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
app.delete('/users', function(req, res){
    var query = "DELETE FROM users";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.delete('/users/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM users WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


//Temps nourriture restant

app.get('/food-stats', function(req, res) {
    var query = "SELECT animals.id, (food.quantity)/(animals.food_per_day) as days_left FROM animals INNER JOIN food ON animals.id = food.id_animal";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        var t=JSON.stringify(result);
        t = t.replace("null", 0);
        res.send(t);
    });
});



//////////////////////////////////////////TP3/////////////////////////////////////////////


//Relations
app.get('/cages/:id/animals', function(req, res) {
    var id = req.params.id;
    var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN cages ON cages.id = animals.id_cage WHERE cages.id=" + id;
    var conditions = ["id", "name", "breed", "food_per_day", "birthday","entry_date","id_cage"];
    if ("fields" in req.query) {
        query = query.replace("*", "animals." + req.query["fields"]);
    } else {
        query = query.replace("*", "animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage");
    }
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
    var conditions = ["description", "name","area"];
    var query = "SELECT * FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;
    if ("fields" in req.query) {
        query = query.replace("*", "cages." + req.query["fields"]);
    } else {
        query = query.replace("*", "cages.id, cages.name, cages.description, cages.area");
    }
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/cages/:id_cages/animals/:id_animals', function(req, res) {
    var id_cages = req.params.id_cages;
    var id_animals = req.params.id_animals;
    var conditions = ["id","breed", "name","food_per_day","birthday","entry_date","id_cage"];
    var query = "SELECT * FROM animals INNER JOIN cages ON cages.id = animals.id_cage WHERE cages.id=" + id_cages + " AND animals.id=" + id_animals;
    if ("fields" in req.query) {
        query = query.replace("*", "animals." + req.query["fields"]);
    } else {
        query = query.replace("*", "animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage");
    }
    /*for (var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }
            query += " animals." + conditions[index] + "='" +
                req.query[conditions[index]] + "'";
        }
    }*/
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
app.get('/animals/:id_animals/cages/:id_cage', function(req, res) {
    var id_animals = req.params.id_animals;
    var id_cage = req.params.id_cage;
    var conditions = ["description", "name","area"];
    var query = "SELECT * FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animals + " AND cages.id=" + id_cage;
    if ("fields" in req.query) {
        query = query.replace("*", "cages." + req.query["fields"]);
    } else {
        query = query.replace("*", "cages.id, cages.name, cages.description, cages.area");
    }
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


app.get('/animals/:id/food', function(req, res) {
    var conditions = ["breed", "name","food_per_day","birthday","entry_date","id_cage"];
    var id = req.params.id;
    var query = "SELECT * FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;
    if ("fields" in req.query) {
        query = query.replace("*", "food." + req.query["fields"]);
    } else {
        query = query.replace("*", "food.id, food.quantity, food.name");
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/food/:id/animals', function(req, res) {
    var conditions = ["breed", "name","food_per_day","birthday","entry_date","id_cage"];
    var id = req.params.id;
    var query = "SELECT * FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id=" + id;
    if ("fields" in req.query) {
        query = query.replace("*", "animals." + req.query["fields"]);
    } else {
        query = query.replace("*", "animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date");
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/animals/:id_animal/food/:id_food', function(req, res) {
    var id_animal = req.params.id_animal;
    var id_food = req.params.id_food;
    var conditions = ["quantity", "name"];
    var query = "SELECT * FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id_animal + " AND food.id=" + id_food;
    if ("fields" in req.query) {
        query = query.replace("*", "food." + req.query["fields"]);
    } else {
        query = query.replace("*", "cages.id, cages.name, cages.description, cages.area");
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
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
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/food/:id_food/animals/:id_animal', function(req, res) {
    var id_animal = req.params.id_animal;
    var id_food = req.params.id_food;
    var conditions = ["breed", "name","food_per_day","birthday","entry_date","id_cage"];
    var query = "SELECT * FROM food INNER JOIN animals ON food.id_animal = animals.id  WHERE animals.id=" + id_animal + " AND food.id=" + id_food;
    if ("fields" in req.query) {
        query = query.replace("*", "animals." + req.query["fields"]);
    } else {
        query = query.replace("*", "animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date");
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
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
    db.query(query, function(err, result, fields) {
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
