const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

var database = mysql.createConnection({
    host : process.env.MYSQL_HOST,
    user : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE,
    port : process.env.MYSQL_PORT
});

//Use Firewall
app.use(function(req, res, next){
    if ("key" in req.query)
    {
        var key = req.query["key"];
        var query = "select apikey from users where apikey = '"+key+"'";
        database.query(query, function(err, result, fields)
        {
        if (err) throw err;
        if (result.length > 0)
        {
            next();
        }
        else
        {
            res.status(403).send();
        }
        });
    }
    else
    {
        res.status(403).send();
    }
});

//Routes Animals
app.post('/animals', function(req, res) {
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;
    var query = "insert into animals(name, breed, food_per_day, birthday, entry_date, id_cage) values('"+name+"', '"+breed+"', '"+food_per_day+"', '"+birthday+"', '"+entry_date+"', '"+id_cage+"')";
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals', function(req, res){
    var query = "select * from animals";
    
    //SELECTION
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }
    
    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " order by";

        for (var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);

            query += " " + field;

            if(direction == "-")
            query += " DESC,";
            else
            query += " ASC,"
        }

        query = query.slice(0, -1);
    }
    
    //FILTERS
    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }
    
    //PAGINATION
    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id', function(req, res) {
    var id = req.params.id;
    var query = "select * from animals where id ="+id;
    
    //SELECTION
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " order by";

        for (var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);

            query += " " + field;

            if(direction == "-")
            query += " DESC,";
            else
            query += " ASC,"
        }

        query = query.slice(0, -1);
    }

    //FILTER
    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    //PAGINATION
    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.put('/animals/:id', function(req, res) {
    var query = "update animals";
    var id = req.params.id;
    
    //SELECTION
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    for(var index in conditions){
        if(conditions[index] in req.body){
            if(query.indexOf("set")<0){
                query += " set";
            } else {
                query += ", ";
            }

            query += " "+conditions[index]+" = '"+req.body[conditions[index]]+"'";
        }
    }

    query += " where id = "+id;
    database.query(query, function(err, result, fields){
        console.log(query);
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.delete('/animals', function(req, res){
    var query = "delete from animals";
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.delete('/animals/:id', function(req, res) {
    var id = req.params.id;
    var query = "delete from animals where id ="+id;
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Routes Cages
app.post('/cages', function(req, res){
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    var query = "insert into cages(name, description, area) values('"+name+"', '"+description+"', '"+area+"')";
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages', function(req, res){
    var query = "select * from cages";
    
    //SELECTION
    var conditions = ["name", "description", "area"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }
    
    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " order by";

        for (var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);

            query += " " + field;

            if(direction == "-")
            query += " DESC,";
            else
            query += " ASC,"
        }

        query = query.slice(0, -1);
    }

    //FILTER
    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    //PAGINATION
    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "select * from cages where id ="+id;
    
    //SELECTION
    var conditions = ["name", "description", "area"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " order by";

        for (var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);

            query += " " + field;

            if(direction == "-")
            query += " DESC,";
            else
            query += " ASC,"
        }

        query = query.slice(0, -1);
    }

    //FILTER
    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    //PAGINATION
    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.put('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "update cages";
    
    //SELECTION
    var conditions = ["name", "description", "area"];

    for(var index in conditions){
        if(conditions[index] in req.body){
            if(query.indexOf("set")<0){
                query += " set";
            } else {
                query += ", ";
            }

            query += " "+conditions[index]+" = '"+req.body[conditions[index]]+"'";
        }
    }

    query += " where id = "+id;
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.delete('/cages', function(req, res){
    var query = "delete from cages";
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.delete('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "delete from cages where id ="+id;
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Routes Food
app.post('/food', function(req, res){
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    var query = "insert into food(name, quantity, id_animal) values('"+name+"', '"+quantity+"', '"+id_animal+"')";
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food', function(req, res){
    var query = "select * from food";
    
    //SELECTION
    var conditions = ["name", "quantity", "id_animal"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " order by";

        for (var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);

            query += " " + field;

            if(direction == "-")
            query += " DESC,";
            else
            query += " ASC,"
        }

        query = query.slice(0, -1);
    }

    //FILTER
    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    //PAGINATION
    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "select * from food where id ="+id;
    
    //SELECTION
    var conditions = ["name", "quantity", "id_animal"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " order by";

        for (var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);

            query += " " + field;

            if(direction == "-")
            query += " DESC,";
            else
            query += " ASC,"
        }

        query = query.slice(0, -1);
    }

    //FILTER
    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    //PAGINATION
    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.put('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "update food";
    
    //SELECTION
    var conditions = ["name", "quantity", "id_animal"];

    for(var index in conditions){
        if(conditions[index] in req.body){
            if(query.indexOf("set")<0){
                query += " set";
            } else {
                query += ", ";
            }

            query += " "+conditions[index]+" = '"+req.body[conditions[index]]+"'";
        }
    }

    query += " where id = "+id;
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.delete('/food', function(req, res){
    var query = "delete from food";
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.delete('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "delete from food where id ="+id;
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Routes Staff
app.post('/staff', function(req, res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    var query = "insert into staff(firstname, lastname, wage) values('"+firstname+"', '"+lastname+"', '"+wage+"')";
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/staff', function(req, res){
    var query = "select * from staff";
    
    //SELECTION
    var conditions = ["firstname", "lastname", "wage"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }
    
    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " order by";

        for (var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);

            query += " " + field;

            if(direction == "-")
            query += " DESC,";
            else
            query += " ASC,"
        }

        query = query.slice(0, -1);
    }

    //FILTER
    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    //PAGINATION
    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "select * from staff where id ="+id;
    
    //SELECTION
    var conditions = ["firstname", "lastname", "wage"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    //SORTING
    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " order by";

        for (var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);

            query += " " + field;

            if(direction == "-")
            query += " DESC,";
            else
            query += " ASC,"
        }

        query = query.slice(0, -1);
    }

    //FILTER
    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    //PAGINATION
    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.put('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "update staff";
    
    //SELECTION
    var conditions = ["firstname", "lastname", "wage"];
    
    for(var index in conditions){
        if(conditions[index] in req.body){
            if(query.indexOf("set")<0){
                query += " set";
            } else {
                query += ", ";
            }

            query += " "+conditions[index]+" = '"+req.body[conditions[index]]+"'";
        }
    }

    query += " where id = "+id;
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.delete('/staff', function(req, res){
    var query = "delete from staff";
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.delete('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "delete from staff where id ="+id;
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Routes Relations & Special Queries
app.get('/animals/:id_animals/cages', function(req, res) {
    var id_animals = req.params.id_animals;
    var query = "select cages.* from animals join cages on cages.id = animals.id_cage where animals.id="+id_animals;
    
    //SELECTION
    var conditions = ["name", "description", "area"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " cages."+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    //FILTER
    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    //PAGINATION
    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id_animals/cages/:id_cages', function(req, res) {
    var id_animals = req.params.id_animals;
    var id_cages = req.params.id_cages;
    var query = "select cages.* from animals join cages on cages.id = animals.id_cage where animals.id= '"+id_animals+"' and cages.id= "+id_cages;
    
    //SELECTION
    var conditions = ["name", "description", "area"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " cages."+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    //FILTER
    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    //PAGINATION
    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages/:id_cages/animals', function(req, res) {
    var id_cages = req.params.id_cages;
    var query = "select animals.* from cages join animals on animals.id_cage=cages.id where cages.id= "+id_cages;
    
    //SELECTION
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " animals."+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    //FILTER
    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    //PAGINATION
    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food/:id_food/animals', function(req, res) {
    var id_food = req.params.id_food;
    var query = "select animals.* from food join animals on food.id_animal = animals.id where food.id= "+id_food;
    
    //SELECTION
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " animals."+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    //FILTER
    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    //PAGINATION
    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food/:id_food/animals/:id_animals', function(req, res) {
    var id_food = req.params.id_food;
    var id_animals = req.params.id_animals;
    var query = "select animals.* from food join animals on food.id_animal = animals.id where food.id= '"+id_food+"' and animals.id= "+id_animals;
    
    //SELECTION
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " animals."+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    //FILTER
    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    //PAGINATION
    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id_animals/food', function(req, res) {
    var id_animals = req.params.id_animals;
    var query = "select food.* from animals join food on animals.id = food.id_animal where animals.id= "+id_animals;
    
    //SELECTION
    var conditions = ["name", "quantity", "id_animal"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " food."+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    //FILTER
    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    //PAGINATION
    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food-stats', function(req, res) {
    var id = req.params.id;
    var query = "select distinct a.id as 'id', COALESCE(floor(dayL.dayLeft), 0) as 'days_left' from animals a natural join (select a1.id, (f.quantity / a1.food_per_day) as dayLeft from animals a1 join food f on a1.id = f.id_animal) as dayL";
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Run Application
app.listen(3000, function(){
    database.connect(function(err) {
        if(err) throw err;
        console.log('Connexion Successful');
    });
    console.log('App listening on port 3000');
})