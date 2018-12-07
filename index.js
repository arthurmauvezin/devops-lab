const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "project",
    port: "8889"
});

//firewall
app.use(function(req, res,next){

    if("key" in req.query){
        var key=req.query["key"];
        //var query="SELECT * FROM users WHERE apikey = '"+key+"'";
        var query="SELECT * FROM users WHERE apikey = '"+key+"'";
        db.query(query,function (err,result,fields) {
            if(err) throw err;
            if(result.length>0){
                next();
            }
            else {
                //res.status(403).render();
                // next(createError(403));
                //var httpError = createError(404, err, { expose: false })
                // res.send("access denied");
                res.status(403).send("You do not have rights to visit this page");
            }
        });
    } else {
        res.status(403).send("You do not have rights to visit this page");
    }
});
app.get('/', function (req, res) {
    db.query("SELECT * FROM staff", function (err, result, fileds) {
        if (err) throw err;

        var response = {"page": "home", "result": result};
        res.send(JSON.stringify(response));
    });
});

////////////////animal//////////////////////////////


///////////filtre//////////

app.get('/animals', function(req, res) {
    var query = "SELECT * FROM animals";
    var conditions = ["id", "name","breed", "food_per_day","birthday","entry_date","id_cage"];
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

    ///ordre
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";

        for (var index2 in sort) {
            var direction = sort[index2].substr(0, 1);
            var field = sort[index2].substr(1);
            query += " " + field;

            if (direction === "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    ///field////
    if("fields" in req.query){
        query=query.replace("*",req.query["fields"]);
    }
///pagna///
    if("limit" in req.query){
        query += " LIMIT "+ req.query["limit"];

        if("offset" in req.query){
            query += " OFFSET "+ req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//filtre avec id

app.get('/animals/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id;
    var conditions = ["id", "name","breed", "food_per_day","birthday","entry_date","id_cage"];
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

    ///ordre
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";

        for (var index2 in sort) {
            var direction = sort[index2].substr(0, 1);
            var field = sort[index2].substr(1);
            query += " " + field;

            if (direction === "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    ///field////
    if("fields" in req.query){
        query=query.replace("*",req.query["fields"]);
    }
///pagna///
    if("limit" in req.query){
        query += " LIMIT "+ req.query["limit"];

        if("offset" in req.query){
            query += " OFFSET "+ req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//////get///
app.get('/animals', function (req, res) {
    var query = "SELECT * FROM animals";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });

});


app.get('/animals/:id', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });

});
//post//////////
app.post('/animals', function (req, res) {
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;
    var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" + name + "','" + breed + "','" + food_per_day + "','"+birthday+"','"+entry_date+"','"+id_cage+"')";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//put//////////
app.put('/animals/:id', function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;
    if (name != null ) {
        var query = "UPDATE animals set name='"+name+"' WHERE id=" + id;
        db.query(query, function (err, result, fields) {
            if (err) throw err;


        });
    }
    if (breed != null ) {
        var query = "UPDATE animals set breed='"+breed+"' WHERE id=" + id;
        db.query(query, function (err, result, fields) {
            if (err) throw err;


        });
    }
    if (food_per_day != null ) {
        var query = "UPDATE animals set food_per_day='"+food_per_day+"' WHERE id=" + id;
        db.query(query, function (err, result, fields) {
            if (err) throw err;


        });
    }
    if (birthday != null ) {
        var query = "UPDATE animals set birthday='"+birthday+"' WHERE id=" + id;
        db.query(query, function (err, result, fields) {
            if (err) throw err;


        });
    }
    if (entry_date != null ) {
        var query = "UPDATE animals set entry_date='"+entry_date+"' WHERE id=" + id;
        db.query(query, function (err, result, fields) {
            if (err) throw err;


        });
    }
    if (id_cage != null ) {
        var query = "UPDATE animals set id_cage='"+id_cage+"' WHERE id=" + id;
        db.query(query, function (err, result, fields) {
            if (err) throw err;


        });
    }
    res.send(JSON.stringify("success"));
});
//////////////DELETE/////////////////////////////////////////////////
app.delete('/animals', function (req, res) {
    var query ="DELETE FROM animals";
    db.query(query, function (err,result,fields) {
        if(err) throw err;

        res.send(JSON.stringify("Success"));
    });

});

app.delete('/animals/:id', function (req, res) {
    var id=req.params.id;
    var query ="DELETE FROM animals WHERE id="+id;
    db.query(query, function (err,result,fields) {
        if(err) throw err;

        res.send(JSON.stringify("Success"));
    });

});



////////////////animals fin//////////////////////////////


////////////////cage//////////////////////////////
/*app.get('/cage', function (req, res) {
    var response = {"page": "cage"}
    res.send(JSON.stringify(response));
});
*/
///////////filtre//////////

app.get('/cages', function(req, res) {
    var query = "SELECT * FROM cages";
    var conditions = ["id", "name","description", "area"];
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

    ///ordre
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";

        for (var index2 in sort) {
            var direction = sort[index2].substr(0, 1);
            var field = sort[index2].substr(1);
            query += " " + field;

            if (direction === "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    ///field////
    if("fields" in req.query){
        query=query.replace("*",req.query["fields"]);
    }
///pagna///
    if("limit" in req.query){
        query += " LIMIT "+ req.query["limit"];

        if("offset" in req.query){
            query += " OFFSET "+ req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//avec filtre et id
app.get('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + id;
    var conditions = ["id", "name","description", "area"];
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

    ///ordre
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";

        for (var index2 in sort) {
            var direction = sort[index2].substr(0, 1);
            var field = sort[index2].substr(1);
            query += " " + field;

            if (direction === "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    ///field////
    if("fields" in req.query){
        query=query.replace("*",req.query["fields"]);
    }
///pagna///
    if("limit" in req.query){
        query += " LIMIT "+ req.query["limit"];

        if("offset" in req.query){
            query += " OFFSET "+ req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//get///////////
app.get('/cages', function (req, res) {
    var query = "SELECT * FROM cages";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });

});

app.get('/cages/:id', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });

});
//post//////////
app.post('/cages', function (req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    var query = "INSERT INTO cages (name, DESCRIPTION, AREA) VALUES ('" + name + "','" + description + "','" + area + "')";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//put//////////
app.put('/cages/:id', function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;

    if (name != null ) {
        var query = "UPDATE cages set name='"+name+"' WHERE id=" + id;
        db.query(query, function (err, result, fields) {
            if (err) throw err;


        });
    }
    if (description != null ) {
        var query = "UPDATE cages set DESCRIPTION='"+description+"' WHERE id=" + id;
        db.query(query, function (err, result, fields) {
            if (err) throw err;


        });
    }
    if (area != null ) {
        var query = "UPDATE cages set AREA='"+area+"' WHERE id=" + id;
        db.query(query, function (err, result, fields) {
            if (err) throw err;


        });
    }
    res.send(JSON.stringify("success"));
});
//////////////DELETE/////////////////////////////////////////////////
app.delete('/cages', function (req, res) {
    var query ="DELETE FROM cages";
    db.query(query, function (err,result,fields) {
        if(err) throw err;

        res.send(JSON.stringify("Success"));
    });

});

app.delete('/cages/:id', function (req, res) {
    var id=req.params.id;
    var query ="DELETE FROM cages WHERE id="+id;
    db.query(query, function (err,result,fields) {
        if(err) throw err;

        res.send(JSON.stringify("Success"));
    });

});

////////////////cage fin//////////////////////////////

////////////////food//////////////////////////////
/*app.get('/food', function (req, res) {
    var response = {"page": "food"}
    res.send(JSON.stringify(response));
});
*/
///////////filtre//////////

app.get('/food', function(req, res) {
    var query = "SELECT * FROM food";
    var conditions = ["id", "name","quantity", "id_animal"];
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

    ///ordre
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";

        for (var index2 in sort) {
            var direction = sort[index2].substr(0, 1);
            var field = sort[index2].substr(1);
            query += " " + field;
            if (direction === "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    ///field////
    if("fields" in req.query){
        query=query.replace("*",req.query["fields"]);
    }
///pagna///
    if("limit" in req.query){
        query += " LIMIT "+ req.query["limit"];

        if("offset" in req.query){
            query += " OFFSET "+ req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//filter et id
app.get('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;
    var conditions = ["id", "name","quantity", "id_animal"];
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

    ///ordre
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";

        for (var index2 in sort) {
            var direction = sort[index2].substr(0, 1);
            var field = sort[index2].substr(1);
            query += " " + field;
            if (direction === "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    ///field////
    if("fields" in req.query){
        query=query.replace("*",req.query["fields"]);
    }
///pagna///
    if("limit" in req.query){
        query += " LIMIT "+ req.query["limit"];

        if("offset" in req.query){
            query += " OFFSET "+ req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//get///////////
app.get('/food', function (req, res) {
    var query = "SELECT * FROM food";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });

});

app.get('/food/:id', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });

});
//post//////////
app.post('/food', function (req, res) {
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    var query = "INSERT INTO food (name, QUANTITY, id_animal) VALUES ('" + name + "','" + quantity + "','" + id_animal + "')";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//put//////////
app.put('/food/:id', function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    if (name != null ) {
        var query = "UPDATE food set name='"+name+"' WHERE id=" + id;
        db.query(query, function (err, result, fields) {
            if (err) throw err;


        });
    }
    if (quantity != null ) {
        var query = "UPDATE food set QUANTITY='"+quantity+"' WHERE id=" + id;
        db.query(query, function (err, result, fields) {
            if (err) throw err;


        });
    }
    if (id_animal != null ) {
        var query = "UPDATE food set id_animal='"+id_animal+"' WHERE id=" + id;
        db.query(query, function (err, result, fields) {
            if (err) throw err;


        });
    }
    res.send(JSON.stringify("success"));
});
//////////////DELETE/////////////////////////////////////////////////
app.delete('/food', function (req, res) {
    var query ="DELETE FROM food";
    db.query(query, function (err,result,fields) {
        if(err) throw err;

        res.send(JSON.stringify("Success"));
    });

});

app.delete('/food/:id', function (req, res) {
    var id=req.params.id;
    var query ="DELETE FROM food WHERE id="+id;
    db.query(query, function (err,result,fields) {
        if(err) throw err;

        res.send(JSON.stringify("Success"));
    });

});

////////////////food fin//////////////////////////////

////////////////staff//////////////////////////////

/*app.get('/staff', function (req, res) {
    var response = {"page": "staff"}
    res.send(JSON.stringify(response));
});*/
///////////filtre//////////

app.get('/staff', function(req, res) {
    var query = "SELECT * FROM staff";
    var conditions = ["id","firsname","lastname","wage"];
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

    ///ordre
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index2 in sort) {
            var direction = sort[index2].substr(0, 1);
            var field = sort[index2].substr(1);
            query += " " + field;
            if (direction === "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    ///field////
    if("fields" in req.query){
        query=query.replace("*",req.query["fields"]);
    }
///pagna///
    if("limit" in req.query){
        query += " LIMIT "+ req.query["limit"];

        if("offset" in req.query){
            query += " OFFSET "+ req.query["offset"];
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
    var conditions = ["id","firsname","lastname","wage"];
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

    ///ordre
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index2 in sort) {
            var direction = sort[index2].substr(0, 1);
            var field = sort[index2].substr(1);
            query += " " + field;
            if (direction === "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    ///field////
    if("fields" in req.query){
        query=query.replace("*",req.query["fields"]);
    }
///pagna///
    if("limit" in req.query){
        query += " LIMIT "+ req.query["limit"];

        if("offset" in req.query){
            query += " OFFSET "+ req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//get///////////
app.get('/staff', function (req, res) {
    var query = "SELECT * FROM staff";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });

});

app.get('/staff/:id', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });

});
//post//////////
app.post('/staff', function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('" + firstname + "','" + lastname + "','" + wage + "')";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//put//////////
app.put('/staff/:id', function (req, res) {
    var id = req.params.id;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    if (firstname != null ) {
        var query = "UPDATE staff set FIRSTNAME='"+firstname+"' WHERE id=" + id;
        db.query(query, function (err, result, fields) {
            if (err) throw err;


        });
    }
    if (lastname != null ) {
        var query = "UPDATE staff set LASTNAME='"+lastname+"' WHERE id=" + id;
        db.query(query, function (err, result, fields) {
            if (err) throw err;


        });
    }
    if (wage != null ) {
        var query = "UPDATE staff set WAGE='"+wage+"' WHERE id=" + id;
        db.query(query, function (err, result, fields) {
            if (err) throw err;


        });
    }
    res.send(JSON.stringify("success"));
});
//////////////DELETE/////////////////////////////////////////////////
app.delete('/staff', function (req, res) {
    var query ="DELETE FROM staff";
    db.query(query, function (err,result,fields) {
        if(err) throw err;

        res.send(JSON.stringify("Success"));
    });

});

app.delete('/staff/:id', function (req, res) {
    var id=req.params.id;
    var query ="DELETE FROM staff WHERE id="+id;
    db.query(query, function (err,result,fields) {
        if(err) throw err;

        res.send(JSON.stringify("Success"));
    });

});

////////////////staff fin//////////////////////////////

////////////////jour restant nourriture//////////////////////////////
/*app.get('/food-stats', function (req, res) {
    var response = {"page": "food-stats"}
    res.send(JSON.stringify(response));
});*/
app.get('/cages/:id/animals', function (req, res) {
    var id= req.params.id;
    var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id =animals.id_cage WHERE cages.id= "+ id;
    //var query =  ​"SELECT * FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id="​ + id;
    // var query ="SELECT dada.id, dada.value FROM users INNER JOIN dada ON users.id=dada.user_id WHERE users.id=1 AND dada.id=2";
    var conditions = ["id","name","breed","food_per_day","birthday","entry_day","id_cage"];
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

    ///ordre
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index2 in sort) {
            var direction = sort[index2].substr(0, 1);
            var field = sort[index2].substr(1);
            query += " " + field;
            if (direction === "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    ///field////
    if("fields" in req.query){
        query=query.replace("*",req.query["fields"]);
    }
///pagna///
    if("limit" in req.query){
        query += " LIMIT "+ req.query["limit"];

        if("offset" in req.query){
            query += " OFFSET "+ req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id/cages', function (req, res) {
    var id= req.params.id;
    var query = "SELECT cages.* FROM cages INNER JOIN animals ON cages.id =animals.id_cage WHERE animals.id= "+ id;
    //var query =  ​"SELECT * FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id="​ + id;
    // var query ="SELECT dada.id, dada.value FROM users INNER JOIN dada ON users.id=dada.user_id WHERE users.id=1 AND dada.id=2";
    var conditions = ["id","name","description","area"];
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

    ///ordre
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index2 in sort) {
            var direction = sort[index2].substr(0, 1);
            var field = sort[index2].substr(1);
            query += " " + field;
            if (direction === "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    ///field////
    if("fields" in req.query){
        query=query.replace("*",req.query["fields"]);
    }
///pagna///
    if("limit" in req.query){
        query += " LIMIT "+ req.query["limit"];

        if("offset" in req.query){
            query += " OFFSET "+ req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id_animal/cages/:id_cage', function (req, res) {
    var id_animal= req.params.id_animal;
    var id_cage= req.params.id_cage;
    var query = "SELECT cages.* FROM cages INNER JOIN animals ON cages.id =animals.id_cage WHERE animals.id= "+ id_animal+" AND id_cage= "+id_cage;
    //var query =  ​"SELECT * FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id="​ + id;
    // var query ="SELECT dada.id, dada.value FROM users INNER JOIN dada ON users.id=dada.user_id WHERE users.id=1 AND dada.id=2";
    var conditions = ["id","name","description","area"];
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

    ///ordre
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index2 in sort) {
            var direction = sort[index2].substr(0, 1);
            var field = sort[index2].substr(1);
            query += " " + field;
            if (direction === "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    ///field////
    if("fields" in req.query){
        query=query.replace("*",req.query["fields"]);
    }
///pagna///
    if("limit" in req.query){
        query += " LIMIT "+ req.query["limit"];

        if("offset" in req.query){
            query += " OFFSET "+ req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
///////////food animals
/*app.get('/animals/:id/food', function (req, res) {
    var id= req.params.id;
    var query = "SELECT food.* FROM food INNER JOIN animals ON food.id_animal =animals.id WHERE animals.id= "+ id;
    //var query =  ​"SELECT * FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id="​ + id;
    // var query ="SELECT dada.id, dada.value FROM users INNER JOIN dada ON users.id=dada.user_id WHERE users.id=1 AND dada.id=2";

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});*/
app.get('/animals/:id/food', function (req, res) {
    var id= req.params.id;
    var query = "SELECT food.* FROM food INNER JOIN animals ON food.id_animal =animals.id WHERE animals.id= "+ id;
    //var query =  ​"SELECT * FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id="​ + id;
    // var query ="SELECT dada.id, dada.value FROM users INNER JOIN dada ON users.id=dada.user_id WHERE users.id=1 AND dada.id=2";
   // var conditions = ["id","name","breed","food_per_day","birthday","entry_day","id_cage"];
    var conditions = ["id","name","quantity","id_animal"];
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

    ///ordre
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index2 in sort) {
            var direction = sort[index2].substr(0, 1);
            var field = sort[index2].substr(1);
            query += " " + field;
            if (direction === "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    ///field////
    if("fields" in req.query){
        query=query.replace("*",req.query["fields"]);
    }
///pagna///
    if("limit" in req.query){
        query += " LIMIT "+ req.query["limit"];

        if("offset" in req.query){
            query += " OFFSET "+ req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/food/:id/animals', function (req, res) {
    var id= req.params.id;
    var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal=animals.id WHERE food.id= "+id;

    var conditions = ["id","name","breed","food_per_day","birthday","entry_day","id_cage"];
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

    ///ordre
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index2 in sort) {
            var direction = sort[index2].substr(0, 1);
            var field = sort[index2].substr(1);
            query += " " + field;
            if (direction === "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    ///field////
    if("fields" in req.query){
        query=query.replace("*",req.query["fields"]);
    }
///pagna///
    if("limit" in req.query){
        query += " LIMIT "+ req.query["limit"];

        if("offset" in req.query){
            query += " OFFSET "+ req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
///luiiidd
app.get('/food/:id_food/animals/:id_animal', function (req, res) {
    var id_animal= req.params.id_animal;
    var id_food= req.params.id_food;
    var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal=animals.id WHERE food.id= "+id_food+" AND animals.id= "+id_animal;
    //var query =  ​"SELECT * FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id="​ + id;
    // var query ="SELECT dada.id, dada.value FROM users INNER JOIN dada ON users.id=dada.user_id WHERE users.id=1 AND dada.id=2";
    var conditions = ["id","name","breed","food_per_day","birthday","entry_day","id_cage"];
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

    ///ordre
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index2 in sort) {
            var direction = sort[index2].substr(0, 1);
            var field = sort[index2].substr(1);
            query += " " + field;
            if (direction === "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    ///field////
    if("fields" in req.query){
        query=query.replace("*",req.query["fields"]);
    }
///pagna///
    if("limit" in req.query){
        query += " LIMIT "+ req.query["limit"];

        if("offset" in req.query){
            query += " OFFSET "+ req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
/*app.get('/food/:id/animals', function (req, res) {
    var id= req.params.id;
    var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal =animals.id WHERE food.id_animal= "+ id;
    //var query =  ​"SELECT * FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id="​ + id;
    // var query ="SELECT dada.id, dada.value FROM users INNER JOIN dada ON users.id=dada.user_id WHERE users.id=1 AND dada.id=2";
    var conditions = ["id","name","breed","food_per_day","birthday","entry_day","id_cage"];
    //var conditions = ["id","name","quantity","id_animal"];
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

    ///ordre
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index2 in sort) {
            var direction = sort[index2].substr(0, 1);
            var field = sort[index2].substr(1);
            query += " " + field;
            if (direction === "-")
                query += " DESC,";
            else
                query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    ///field////
    if("fields" in req.query){
        query=query.replace("*",req.query["fields"]);
    }
///pagna///
    if("limit" in req.query){
        query += " LIMIT "+ req.query["limit"];

        if("offset" in req.query){
            query += " OFFSET "+ req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});*/

/////////relation entre cage est animal
/*
app.get('/cages/:id/animals'​, function (req, res) {
    var id= req.params.id;
    var query =  ​"SELECT * FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id="​ + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});*/
/////


/*app.get('/food-stats', function (req, res) {
    var query = "SELECT a.id \"id\", (quantity/food_per_day)\"days_left\" FROM animals a inner JOIN food f on a.id=f.id_animal";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});*/

app.get('/food-stats', function (req, res) {
    var id= req.params.id;
    var query = "SELECT a.id \"id\", (quantity/food_per_day) \"days_left\" FROM animals a inner JOIN food f on a.id=f.id_animal";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
     for(var i = 0 ; i < result.length ; i++) {

         if(result[i].days_left==null)
         {result[i].days_left=0}
}

        res.send(JSON.stringify(result));
    });
});
////////////////jour restant nourriture//////////////////////////////

////add a new apikey
app.post('/register', function (req, res) {
    var pass = req.body.pass;
    hmac2 = crypto.createHmac(algorithm, secret);
    hmac2.update(pass);
    hash2 = hmac2.digest('hex');
    var query = "INSERT INTO apikey (pass) VALUES ('" + hash2 + "')";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

/*app.get('/foodstats​​', function (req, res) {
    //var query = "SELECT a.IDA, a.NAME, (QUANTITY/food_per_day) FROM `animals` a inner JOIN food f on a.IDA=f.IDA";
    var query="SELECT * FROM animals";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });

});*/

////////////////fin jour restant nourriture//////////////////////////

app.listen(3000, function () {
    db.connect(function (err) {
        if (err) throw err;
        console.log('Connection to database successful!');
    });
    console.log('Example app listening on port 3000');
});
