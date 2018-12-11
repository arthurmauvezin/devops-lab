const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const dhost = process.environment.MYSQL_HOST;
const dport = process.environment.MYSQL_PORT;
const ddatabase = process.environment.MYSQL_DATABASE;
const dlogin = process.environment.MYSQL_LOGIN;
const dpassword = process.environment.MYSQL_PASSWORD;


app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({
    host: dhost,
    user: dlogin,
    password: dpassword,
    database: ddatabase,
    port: dport
});



/*###############################################
##-------------------FIREWALL------------------##
###############################################*/
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
                res.status(403).send("You shall not PASS !!");
            }
        });
    } else {
        res.status(403).send("You shall not PASS !!");
    }
});


/*###############################################
##--------------*----ANIMALS-------------------##
###############################################*/

//--------SELECT--------//

//select info with filters, conditions, limitations and sorting
app.get('/animals', function(req, res) {
    var query = "SELECT * FROM animals";
    var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];

    
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
            if (direction == "-")  query += " DESC,";
            else    query += " ASC,";
        }
        query = query.slice(0, -1);
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

            query += " " + conditions[index] + "='" +req.query[conditions[index]] + "'";
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//select all info of a precise animal
app.get('/animals/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id;

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));

    });
});


//--------UPDATE--------//
app.put('/animals/:id', function(req, res) {
    var query = "UPDATE animals SET";
    var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];

    var id = req.params.id;

    for (var index in conditions) {
        if (conditions[index] in req.body) {
            query+=  " " + conditions[index] + "='" +req.body[conditions[index]] + "',";
        }
    }
    query=query.slice(0,-1);

   query+=" WHERE id="+ id+";";

 
    db.query(query, function(err,fields,result) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


//--------CREATE--------//
app.post('/animals', function(req, res) {
    var query = "INSERT INTO animals (";
    var answer= "VALUES (";
    var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];

    for (var index in conditions) {
        if (conditions[index] in req.body) {
            query+= conditions[index]+",";
            answer+= "'" +req.body[conditions[index]] +"',";
            
        }
    }

    query=query.slice(0,-1);
    answer=answer.slice(0,-1);
    query+=") ";
    answer+=");";
    query+=answer;

     
    db.query(query, function(err,fields,result) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


//--------DELETE--------//

//delete all table rows
app.delete('/animals', function(req, res) {
    var query = "DELETE FROM animals";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
//delete a prcise row
app.delete('/animals/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM animals WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
    



/*###############################################
##--------------------CAGES--------------------##
###############################################*/

//--------SELECT--------//

//select info with filters, conditions, limitations and sorting
app.get('/cages', function(req, res) {
    var query = "SELECT * FROM cages";
    var conditions = ["id", "name","description","area"];

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
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
            if (direction == "-")  query += " DESC,";
            else    query += " ASC,";
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

            query += " " + conditions[index] + "='" +req.query[conditions[index]] + "'";
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//select all info of a precise cage
app.get('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + id;

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));

    });
});


//--------UPDATE--------//
app.put('/cages/:id', function(req, res) {
    var query = "UPDATE cages SET";
    var conditions = ["id", "name","description","area"];

    var id = req.params.id;

    for (var index in conditions) {
        if (conditions[index] in req.body) {
            query+=  " " + conditions[index] + "='" +req.body[conditions[index]] + "',";
        }
    }
    query=query.slice(0,-1);

   query+=" WHERE id="+ id+";";

 
    db.query(query, function(err,fields,result) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


//--------CREATE--------//
app.post('/cages', function(req, res) {
    var query = "INSERT INTO cages (";
    var answer= "VALUES (";
    var conditions = ["id", "name","description","area"];

    for (var index in conditions) {
        if (conditions[index] in req.body) {
            query+= conditions[index]+",";
            answer+= "'" +req.body[conditions[index]] +"',";
            
        }
    }

    query=query.slice(0,-1);
    answer=answer.slice(0,-1);
    query+=") ";
    answer+=");";
    query+=answer;

     
    db.query(query, function(err,fields,result) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


//--------DELETE--------//

//delete all table rows
app.delete('/cages', function(req, res) {
    var query = "DELETE FROM cages";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
//delete a prcise row
app.delete('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM cages WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
    
    


/*###############################################
##---------------------FOOD--------------------##
###############################################*/

//--------SELECT--------//

//select info with filters, conditions, limitations and sorting
app.get('/food', function(req, res) {
    var query = "SELECT * FROM food";
    var conditions = ["id", "name","quantity","id_animal"];

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
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
            if (direction == "-")  query += " DESC,";
            else    query += " ASC,";
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

            query += " " + conditions[index] + "='" +req.query[conditions[index]] + "'";
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//select all info of a precise food
app.get('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;


    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));

    });
});


//--------UPDATE--------//
app.put('/food/:id', function(req, res) {
    var query = "UPDATE food SET";
    var conditions = ["id", "name","id_animal","quantity"];

    var id = req.params.id;

    for (var index in conditions) {
        if (conditions[index] in req.body) {
            query+=  " " + conditions[index] + "='" +req.body[conditions[index]] + "',";
        }
    }
    query=query.slice(0,-1);

   query+=" WHERE id="+ id+";";

 
    db.query(query, function(err,fields,result) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


//--------CREATE--------//
app.post('/food', function(req, res) {
    var query = "INSERT INTO food (";
    var answer= "VALUES (";
    var conditions = ["id", "name","id_animal","quantity"];

    for (var index in conditions) {
        if (conditions[index] in req.body) {
            query+= conditions[index]+",";
            answer+= "'" +req.body[conditions[index]] +"',";
            
        }
    }

    query=query.slice(0,-1);
    answer=answer.slice(0,-1);
    query+=") ";
    answer+=");";
    query+=answer;

     
    db.query(query, function(err,fields,result) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


//--------DELETE--------//

//delete all table rows
app.delete('/food', function(req, res) {
    var query = "DELETE FROM food";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
//delete a prcise row
app.delete('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM food WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});




/*###############################################
##--------------------STAFF--------------------##
###############################################*/

//--------SELECT--------//

//select info with filters, conditions, limitations and sorting
app.get('/staff', function(req, res) {
    var query = "SELECT * FROM staff";
    var conditions = ["id", "firstname","lastname","wage"];

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
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
            if (direction == "-")  query += " DESC,";
            else    query += " ASC,";
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

            query += " " + conditions[index] + "='" +req.query[conditions[index]] + "'";
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//select all info of a precise staff member
app.get('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id;

    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]);
    }

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));

    });
});


//--------UPDATE--------//
app.put('/staff/:id', function(req, res) {
    var query = "UPDATE staff SET";
    var conditions = ["id", "firstname","lastname","wage"];

    var id = req.params.id;

    for (var index in conditions) {
        if (conditions[index] in req.body) {
            query+=  " " + conditions[index] + "='" +req.body[conditions[index]] + "',";
        }
    }
    query=query.slice(0,-1);

   query+=" WHERE id="+ id+";";

   
 
    db.query(query, function(err,fields,result) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


//--------CREATE--------//
app.post('/staff', function(req, res) {
    var query = "INSERT INTO staff (";
    var answer= "VALUES (";
    var conditions = ["id", "firstname","lastname","wage"];

    for (var index in conditions) {
        if (conditions[index] in req.body) {
            query+= conditions[index]+",";
            answer+= "'" +req.body[conditions[index]] +"',";
        }
    }

    query=query.slice(0,-1);
    answer=answer.slice(0,-1);
    query+=") ";
    answer+=");";
    query+=answer;

     
    db.query(query, function(err,fields,result) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});



//--------DELETE--------//

//delete all table rows
app.delete('/staff', function(req, res) {
    var query = "DELETE FROM staff";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
//delete a prcise row
app.delete('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM staff WHERE id=" + id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});



/*###############################################
##------------------RELATIONS------------------##
###############################################*/

//--------CAGES with ANIMALS--------//
app.get('/animals/:id/cages', function(req, res) {
   
    var query= "SELECT cages.* FROM cages JOIN animals ON animals.id_cage = cages.id";
    var conditions = ["id","breed","food_per_day","birthday","entry_date","id_cage","name","description","area"];


    if ("fields" in req.query) {
        query = query.replace("cages.*", req.query["fields"]);
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

            query += " " + conditions[index] + "='" +req.query[conditions[index]] + "'";
        }
    }

    
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
    
});

app.get('/animals/:id_a/cages/:id_c', function(req, res) {
   
    var id_a=req.params.id_a;
    var id_c=req.params.id_c;

    var query= "SELECT cages.* FROM cages JOIN animals ON animals.id_cage = cages.id WHERE animals.id="+id_a+" AND cages.id="+id_c+";";


    if ("fields" in req.query) {
        query = query.replace("cages.*", req.query["fields"]);
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
    var id_c = req.params.id;
    var query= "SELECT animals.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id="+id_c;
    var conditions = ["id","name","breed","food_per_day","birthday","entry_date","id_cage"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" +req.query[conditions[index]] + "'";
        }
    }

    if ("fields" in req.query) {
        query = query.replace("animals.*", req.query["fields"]);
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

//--------ANIMALS with FOOD--------//
app.get('/food/:id_f/animals/:id_a', function(req, res) {
   
    var id_a=req.params.id_a;
    var id_f=req.params.id_f;

    var query= "SELECT animals.* FROM animals JOIN food ON animals.id = food.id_animal WHERE animals.id="+id_a+" AND food.id="+id_f+";";
    var conditions = ["id","breed","food_per_day","birthday","entry_date","id_cage","name","id_animal","quantity"];

    if ("fields" in req.query) {
        query = query.replace("animals.*", req.query["fields"]);
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
   
    var query= "SELECT animals.* FROM animals JOIN food ON animals.id = food.id_animal";
    var conditions = ["id","breed","food_per_day","birthday","entry_date","id_cage","name","id_animal","quantity"];


    if ("fields" in req.query) {
        query = query.replace("animals.*", req.query["fields"]);
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

            query += " " + conditions[index] + "='" +req.query[conditions[index]] + "'";
        }
    }

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });

    
    
});

app.get('/animals/:id/food', function(req, res) {
    var id = req.params.id;
    var query= "SELECT food.* FROM food INNER JOIN animals ON animals.id = food.id_animal WHERE animals.id="+id;
    var conditions = ["id","breed","food_per_day","birthday","entry_date","id_cage","name","id_animal","quantity"];

    for (var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf("WHERE") < 0) {
                query += " WHERE";
            } else {
                query += " AND";
            }

            query += " " + conditions[index] + "='" +req.query[conditions[index]] + "'";
        }
    }

    if ("fields" in req.query) {
        query = query.replace("food.*", req.query["fields"]);
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

//--------FOOD AND STATISTICS--------//

app.get('/food-stats', function(req, res) {
    var query = "Select animals.id, (CASE WHEN (food.quantity/animals.food_per_day) >-1 THEN (food.quantity/animals.food_per_day) ELSE 0 END)  as days_left FROM food JOIN animals ON food.id_animal = animals.id";
    // we provide  a test to avoide the division by 0 that would return a days_left: null; 
    // at the same time we avoid food misconfigurations that would display a negative days_left
    
    db.query(query, function(err, result, fields) {
        
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
    




/*###############################################
##----------------MISCELLANEOUS----------------##
###############################################*/


app.listen(3000, function() {

    db.connect(function(err) {
        if (err) throw err;
        console.log('Connection to database successful!');
    });

    console.log('Example app listening on port 3000!');
});



app.get('/query', function(req, res) {
    res.send(JSON.stringify(req.query));
});
    
