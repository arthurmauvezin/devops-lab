const express = require('express');
const mysql =  require('mysql');
const bodyParser = require('body-parser');
const app = express();
//setting the environment variables
const ehost = process.env.MYSQL_HOST || "localhost";
const eport = process.env.MYSQL_PORT || "3306";
const edatabase = process.env.MYSQL_DATABASE || "zoo2";
const euser = process.env.MYSQL_USER || "root";
const epassword = process.env.MYSQL_PASSWORD || "";


app.use(bodyParser.urlencoded({extended : true}));

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "zoo2",
    port: "3306"
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
            }
            else {
                res.status(403).send("Access denied");
            }
        });
    } else {
        res.status(403).send("Access denied");
    }
});

//---------------------------------------------------##########
app.post('/staff',function (req,res){
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let wage = req.body.wage;
    let query = "insert into STAFF(firstname,lastname,wage)" +
        " values('"+firstname+"','"+lastname+"',"+wage+")";
    db.query(query,function (err) {
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.get('/staff',function(req,res){
    var query = "SELECT * FROM staff";
    var conditions = ["id", "firstname","lastname","wage"];
    for (let index in conditions) {
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
        for (let index in sort) {
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
    db.query(query, function(err, result) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/staff/:id',function(req,res){
    let id = req.params.id;
    let query = "SELECT * FROM staff WHERE id="+id;
    var conditions = ["id", "firstname","lastname","wage"];
    for (let index in conditions) {
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
        for (let index in sort) {
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
    db.query(query, function (err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});


app.put('/staff/:id',function (req,res) {
    let id = req.params.id;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let wage = req.body.wage;
    let query = "update staff set ";
    if(firstname !== undefined) query+="firstname = '"+firstname+"',";
    if(lastname !== undefined) query+="lastname = '"+lastname+"',";
    if(wage !== undefined) query+="wage = "+wage+",";
    query = query.slice(0,-1);
    query += " where id="+id;
    db.query(query,function(err,result){
        if(err) throw err;
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



//////////////////////////////////////////////////////////////
app.post('/animals',function (req,res){
    let name = req.body.name;
    let breed = req.body.breed;
    let food_per_day = req.body.food_per_day;
    let birthday = req.body.birthday;
    let entry_date = req.body.entry_date;
    let id_cage = req.body.id_cage;
    let query = "insert into animals(name,breed,food_per_day,birthday,entry_date,id_cage)" +
        " values('"+name+"','"+breed+"',"+food_per_day+",'"+birthday+"','"+entry_date+"',"+id_cage+")";
    db.query(query,function (err) {
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.get('/animals',function(req,res){
    var query = "SELECT * FROM animals";
    var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
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

    db.query(query, function (err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id',function(req,res){
    let id = req.params.id;
    let query = "SELECT * FROM animals WHERE id="+id;
    var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
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
    db.query(query, function (err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id/cages',function(req,res){
    let id = req.params.id;
    let query =
        "SELECT cages.id, cages.name, cages.description, cages.area  " +
        "FROM animals INNER JOIN cages ON cages.id = animals.id_cage " +
        "WHERE animals.id="+id;
    var conditions = ["id", "name","description","area"];
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
        query = query.replace("cages.id, cages.name, cages.description, cages.area", "cages."+req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function (err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id/cages/:id_cage',function(req,res){
    let id = req.params.id;
    let id_cage = req.params.id_cage;
    let query =
        "SELECT cages.id, cages.name, cages.description, cages.area  " +
        "FROM animals INNER JOIN cages ON cages.id = animals.id_cage " +
        "WHERE animals.id="+id+" AND cages.id="+id_cage;
    var conditions = ["id", "name","description","area"];
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
        query = query.replace("cages.id, cages.name, cages.description, cages.area", req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function (err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.put('/animals/:id',function (req,res) {
    let id = req.params.id;
    let name = req.body.name;
    let breed = req.body.breed;
    let food_per_day = req.body.food_per_day;
    let birthday = req.body.birthday;
    let entry_date = req.body.entry_date;
    let id_cage = req.body.id_cage;
    let query = "update animals set ";
    if(name !== undefined) query+="name = '"+name+"',";
    if(breed !== undefined) query+="breed = '"+breed+"',";
    if(food_per_day !== undefined) query+="food_per_day = "+food_per_day+",";
    if(birthday !== undefined) query+="birthday = '"+birthday+"',";
    if(entry_date !== undefined) query+="entry_date = '"+entry_date+"',";
    if(id_cage !== undefined) query+="id_cage = "+id_cage+",";
    query = query.slice(0,-1);
    query += " where id="+id;
    db.query(query,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.get('/animals/:id/food',function(req,res){
    let id = req.params.id;
    let query =
        "SELECT food.id, food.name, food.quantity, food.id_animal " +
        "FROM animals INNER JOIN food ON food.id_animal = animals.id " +
        "WHERE animals.id="+id;
    var conditions = ["id", "name","quantity","id_animal"];
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
        query = query.replace("food.id, food.name, food.quantity, food.id_animal", "food."+req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function (err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id/food/:id_food',function(req,res){
    let id = req.params.id;
    let id_food = req.params.id_food;
    let query =
        "SELECT food.id, food.name, food.quantity, food.id_animal " +
        "FROM animals INNER JOIN food ON food.id_animal = animals.id " +
        "WHERE animals.id="+id+" AND food.id="+id_food;
    var conditions = ["id", "name","quantity","id_animal"];
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
        query = query.replace("food.id, food.name, food.quantity, food.id_animal", "food."+req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function (err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
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
////////////////////////////////////////////////

app.post('/cages',function (req,res){
    let name = req.body.name;
    let description = req.body.description;
    let area = req.body.area;
    let query = "insert into cages(name,description,area)" +
        " values('"+name+"','"+description+"',"+area+")";
    db.query(query,function (err) {
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


app.get('/cages',function(req,res){
    var query = "SELECT * FROM cages";
    var conditions = ["id", "name","description","area"];
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

    db.query(query, function(err, result) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages/:id',function(req,res){
    let id = req.params.id;
    let query = "SELECT * FROM cages WHERE id="+id;
    var conditions = ["id", "name","description","area"];
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
    db.query(query, function (err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages/:id/animals',function(req,res){
    let id = req.params.id;
    let query =
        "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage "+
        "FROM cages INNER JOIN animals ON cages.id = animals.id_cage " +
        "WHERE cages.id="+id;
    var conditions = ["id","name", "breed","food_per_day","birthday","entry_date","id_cage"];
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
        query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", "animals."+req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    // console.log(query);
    db.query(query, function (err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages/:id/animals/:id_animals',function(req,res){
    let id = req.params.id;
    let id_animals = req.params.id_animals;
    let query =
        "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage "+
        "FROM animals INNER JOIN cages ON cages.id = animals.id_cage " +
        "WHERE cages.id="+id+" AND animals.id="+id_animals;
    var conditions = ["id","name", "breed","food_per_day","birthday","entry_date","id_cage"];
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
        query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", "animals."+req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    // console.log(query);
    db.query(query, function (err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});


app.put('/cages/:id',function (req,res) {
    let id = req.params.id;
    let name = req.body.name;
    let description = req.body.description;
    let area = req.body.area;
    let query = "update cages set ";
    if(name !== undefined) query+="name = '"+name+"',";
    if(description !== undefined) query+="description = '"+description+"',";
    if(area !== undefined) query+="area = "+area+",";
    query = query.slice(0,-1);
    query += " where id="+id;
    db.query(query,function(err,result){
        if(err) throw err;
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

///////////////////////////////////////////////////////////////

app.post('/food',function (req,res){
    let name = req.body.name;
    let quantity = req.body.quantity;
    let id_animal = req.body.id_animal;
    let query = "insert into food(name,quantity,id_animal)" +
        " values('"+name+"',"+quantity+","+id_animal+")";
    // res.send(req.body);
    // res.send(query);
    db.query(query,function (err) {
        if(err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.get('/food',function(req,res){
    var query = "SELECT * FROM food";
    var conditions = ["id", "name","quantity","id_animal"];
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

    db.query(query, function(err, result) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food/:id',function(req,res){
    let id = req.params.id;
    let query = "SELECT * FROM food WHERE id="+id;
    var conditions = ["id", "name","quantity","id_animal"];
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
    db.query(query, function (err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food/:id/animals',function(req,res){
    let id = req.params.id;
    let query =
        "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, " +
        "animals.birthday, animals.entry_date, animals.id_cage " +
        "FROM food INNER JOIN animals ON food.id_animal = animals.id " +
        "WHERE food.id="+id;
    var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
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
        query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", "animals."+req.query["fields"]);
        // query = query.replace("*", req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function (err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food/:id/animals/:id_animal',function(req,res){
    let id = req.params.id;
    let id_animal = req.params.id_animal;
    let query =
        // "SELECT animals.*"+
        // "FROM food INNER JOIN animals ON food.id_animal = animals.id " +
        // "WHERE food.id="+id+" AND animals.id="+id_animal;
        "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, " +
        "animals.birthday, animals.entry_date, animals.id_cage " +
        "FROM food INNER JOIN animals ON food.id_animal = animals.id " +
        "WHERE food.id="+id+" AND animals.id="+id_animal;

    var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
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
        query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", "animals."+req.query["fields"]);
        // query = query.replace("*", req.query["fields"]);
    }
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    // console.log(query);
    db.query(query, function (err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});


app.put('/food/:id',function (req,res) {
    let id = req.params.id;
    let name = req.body.name;
    let quantity = req.body.quantity;
    let id_animal = req.body.id_animal;
    let query = "update food set ";
    if(name !== undefined) query+="name = '"+name+"',";
    if(quantity !== undefined) query+="quantity = '"+quantity+"',";
    if(id_animal !== undefined) query+="id_animal = "+id_animal+",";
    query = query.slice(0,-1);
    query += " where id="+id;
    db.query(query,function(err,result){
        if(err) throw err;
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/food-stats', function(req, res) {

    db.query("SELECT animals.id," +
        "(case when animals.food_per_day = 0 then 0 " +
        "else (food.quantity/animals.food_per_day)end ) as days_left " +
        "FROM food INNER JOIN animals ON food.id_animal=animals.id", function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


////////////////////////////////////////////////////////////////
app.listen(3000,function (){
//    db.connect(function (err) {
//        console.log("Trying to connect to "+
//    "host:"+ db.host+
//    "user:"+ db.user+
//    "password:"+ db.pasword+
//    "database:"+ db.database+
//    "port:"+ db.port);
//        if(err) throw err;
//        console.log('Connection to database successful');
//    });
    console.log("Example app listening on port 3000" );
});


