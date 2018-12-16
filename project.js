const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require ('body-parser');
const dhost = process.env.MYSQL_HOST;
const dport = process.env.MYSQL_PORT;
const ddatabase = process.env.MYSQL_DATABASE;
const dlogin = process.env.MYSQL_LOGIN;
const dpassword = process.env.MYSQL_PASSWORD;


var db = mysql.createConnection( {
    host : dhost,
    user : dlogin,
    password : dpassword,
    database : ddatabase
});
app.use(bodyParser.urlencoded({ extended: true }));

/////////////FireWall///////////
app.use(function(req,res,next){
	if("key" in req.query)
	{
		var key = req.query.key;
        var query = "SELECT * FROM users WHERE apikey = '" + key + "'";
        db.query(query,function(err,result,fields){
            if(err) throw err;
            if(result.length > 0)
            {
                next();
            }
            else
            {
                res.status(403).send("Access denied").end();
            }
        });
	}
	else
	{
		 res.status(403).send("Access denied").end();
	}
}); 

///////////Fonction de publication////////////
app.post('/animals', function(req,res) {
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;
    var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" + name + "','" + breed + "'," + food_per_day + ",'"+ birthday + "','" +entry_date + "'," + id_cage + ")";

    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.post('/cages', function(req,res) {
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    var query = "INSERT INTO cages (name,description,area) VALUES ('" + name + "','" + description + "'," + area + ")";
    
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.post('/food', function(req,res) {
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    var query = "INSERT INTO food (name,quantity,id_animal) VALUES ('" + name + "'," + quantity + "," + id_animal +")";
    
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.post('/staff', function(req,res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('" + firstname + "','" + lastname + "'," + wage + ")";
    
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
}); 

/////////////////PUT//////////////////
app.put('/animals/:id', function(req,res){
    var id = req.params.id;
    var query = "UPDATE animals SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send( JSON.stringify( "Success" ))
    });
});
app.put('/cages/:id', function(req,res){
    var id = req.params.id;
    var query = "UPDATE cages SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send( JSON.stringify( "Success" ))
    });
});
app.put('/food/:id', function(req,res){
    var id = req.params.id;
    var query = "UPDATE food SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send( JSON.stringify( "Success" ))
    });
});
app.put('/staff/:id', function(req,res){
    var id = req.params.id;
    var query = "UPDATE staff SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send( JSON.stringify( "Success" ))
    });
});

/*app.put('/cages/:id', function(req,res){
    var name = req.body.name;
    var id_food = req.params.id;
    var query = "UPDATE cages SET name = " + req.params.name + " where id=" + id_food;
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.put('/food/:id', function(req,res){
    var name = req.body.name;
    var id_food = req.params.id;
    var query = "UPDATE food SET name = " + req.params.name + " where id=" + id_food;
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.put('/staff/:id', function(req,res){
    var name = req.body.name;
    var id_food = req.params.id;
    var query = "UPDATE staff SET name = " + req.params.name + " where id=" + id_food;
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});*/

///////////Fonction de lecture////////////
app.get('/animals', function(req,res) {
    var query = "SELECT * FROM animals";
    var conditions = ["name","breed","food_per_day","birthday","entry_date"];
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
    for(var index in conditions){
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) {
                query += " WHERE";
            }
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";
        }
    }
    if ( "sort" in req.query) {
        var sort = req.query[ "sort" ].split( "," );
        query += " ORDER BY" ;
        for ( var index in sort) {
            var direction = sort[index].substr( 0 , 1 );
            var field = sort[index].substr( 1 );
            query += " " + field;
            if (direction == "-" )
                query += " DESC," ;
            else
                query += " ASC," ;
        }
        query = query.slice( 0 , -1 );
    }
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get( '/animals/:id(\\d+)' , function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id;
    var conditions = ["name","breed","food_per_day","birthday","entry_date"];
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
    for(var index in conditions){
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) {
                query += " WHERE";
            }
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";
        }
    }
    if ( "sort" in req.query) {
        var sort = req.query[ "sort" ].split( "," );
        query += " ORDER BY" ;
        for ( var index in sort) {
            var direction = sort[index].substr( 0 , 1 );
            var field = sort[index].substr( 1 );
            query += " " + field;
            if (direction == "-" )
                query += " DESC," ;
            else
                query += " ASC," ;
        }
        query = query.slice( 0 , -1 );
    }
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages', function(req,res) {
    var query = "SELECT * FROM cages";
    var conditions = ["name","description","area"];
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
    for(var index in conditions){
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) {
                query += " WHERE";
            }
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";
        }
    }
    if ( "sort" in req.query) {
        var sort = req.query[ "sort" ].split( "," );
        query += " ORDER BY" ;
        for ( var index in sort) {
            var direction = sort[index].substr( 0 , 1 );
            var field = sort[index].substr( 1 );
            query += " " + field;
            if (direction == "-" )
                query += " DESC," ;
            else
                query += " ASC," ;
        }
        query = query.slice( 0 , -1 );
    }
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get( '/cages/:id(\\d+)' , function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + id;
    var conditions = ["name","description","area"];
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
    for(var index in conditions){
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) {
                query += " WHERE";
            }
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";
        }
    }
    if ( "sort" in req.query) {
        var sort = req.query[ "sort" ].split( "," );
        query += " ORDER BY" ;
        for ( var index in sort) {
            var direction = sort[index].substr( 0 , 1 );
            var field = sort[index].substr( 1 );
            query += " " + field;
            if (direction == "-" )
                query += " DESC," ;
            else
                query += " ASC," ;
        }
        query = query.slice( 0 , -1 );
    }
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food', function(req,res) {
    var query = "SELECT * FROM food";
    var conditions = ["name","quantity","id_animal"];
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
    for(var index in conditions){
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) {
                query += " WHERE";
            }
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";
        }
    }
    if ( "sort" in req.query) {
        var sort = req.query[ "sort" ].split( "," );
        query += " ORDER BY" ;
        for ( var index in sort) {
            var direction = sort[index].substr( 0 , 1 );
            var field = sort[index].substr( 1 );
            query += " " + field;
            if (direction == "-" )
                query += " DESC," ;
            else
                query += " ASC," ;
        }
        query = query.slice( 0 , -1 );
    }
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }

    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/food/:id(\\d+)' , function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;
    var conditions = ["name","quantity","id_animal"];
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
    for(var index in conditions){
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) {
                query += " WHERE";
            }
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";
        }
    }
    if ( "sort" in req.query) {
        var sort = req.query[ "sort" ].split( "," );
        query += " ORDER BY" ;
        for ( var index in sort) {
            var direction = sort[index].substr( 0 , 1 );
            var field = sort[index].substr( 1 );
            query += " " + field;
            if (direction == "-" )
                query += " DESC," ;
            else
                query += " ASC," ;
        }
        query = query.slice( 0 , -1 );
    }
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }

    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/staff', function(req,res) {
    var query = "SELECT * FROM staff";
    var conditions = ["firstname","lastname","wage"];
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
    for(var index in conditions){
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) {
                query += " WHERE";
            }
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";
        }
    }
    if ( "sort" in req.query) {
        var sort = req.query[ "sort" ].split( "," );
        query += " ORDER BY" ;
        for ( var index in sort) {
            var direction = sort[index].substr( 0 , 1 );
            var field = sort[index].substr( 1 );
            query += " " + field;
            if (direction == "-" )
                query += " DESC," ;
            else
                query += " ASC," ;
        }
        query = query.slice( 0 , -1 );
    }
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get( '/staff/:id(\\d+)' , function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id;
    var conditions = ["firstname","lastname","wage"];
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
    for(var index in conditions){
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) {
                query += " WHERE";
            }
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";
        }
    }
    if ( "sort" in req.query) {
        var sort = req.query[ "sort" ].split( "," );
        query += " ORDER BY" ;
        for ( var index in sort) {
            var direction = sort[index].substr( 0 , 1 );
            var field = sort[index].substr( 1 );
            query += " " + field;
            if (direction == "-" )
                query += " DESC," ;
            else
                query += " ASC," ;
        }
        query = query.slice( 0 , -1 );
    }
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

///////////Statistiques//////////
app.get('/food-stats', function(rep, res){
	var query = "SELECT a.breed, (npj.Tquantity/a.Tfood_per_day) FROM (SELECT id, sum(quantity) AS 'Tquantity', name FROM food GROUP BY name) npj INNER JOIN (SELECT sum(food_per_day) AS 'Tfood_per_day', breed, id FROM animals GROUP BY breed) a ON a.id = npj.id ";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

//////////Relations//////////
///cages
app.get('/animals/:id/cages', function(req, res){ //All data
    var id = req.params.id;
	var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;
    var conditions = ["name", "description","area"];
    if ( "fields" in req.query) {
        query = query.replace( "cages.id, cages.name, cages.description, cages.area" , req.query[ "fields" ]);
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

    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
        query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

app.get('/animals/:id/cages/:cid', function(req, res) { //One data
    var AID = req.params.id;
    var CID = req.params.cid;
    var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + AID + " AND cages.id=" + CID;
    var conditions = ["name", "description","area"];
    if ( "fields" in req.query) {
        query = query.replace( "cages.id, cages.name, cages.description, cages.area" , req.query[ "fields" ]);
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

app.get('/cages/:id/animals', function(req, res){ //Other direction
    var id = req.params.id;
    var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day , animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id=" + id;
    var conditions = ["name", "breed","food_per_day", "birthday", "entry_date", "id_cage"];
    if ( "fields" in req.query) {
        query = query.replace( "animals.id, animals.name, animals.breed, animals.food_per_day , animals.birthday, animals.entry_date, animals.id_cage" , req.query[ "fields" ]);
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

    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

///Food
app.get('/food/:id/animals', function(req, res){ //All data
    var id = req.params.id;
    var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day , animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + id;
    var conditions = ["name", "breed","food_per_day", "birthday", "entry_date", "id_cage"];
    if ( "fields" in req.query) {
        query = query.replace( "animals.id, animals.name, animals.breed, animals.food_per_day , animals.birthday, animals.entry_date, animals.id_cage" , req.query[ "fields" ]);
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

    if ("limit" in req.query) {
query += " LIMIT " + req.query["limit"];
if ("offset" in req.query) {
query += " OFFSET " + req.query["offset"];
}
}
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

app.get('/food/:idf/animals/:ida', function(req, res){ //Other direction
    var idF = req.params.idf;
    var idA = req.params.ida;
    var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day , animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + idF + " AND animals.id = " +idA;
    var conditions = ["name", "breed","food_per_day", "birthday", "entry_date", "id_cage"];
    if ( "fields" in req.query) {
        query = query.replace( "animals.id, animals.name, animals.breed, animals.food_per_day , animals.birthday, animals.entry_date, animals.id_cage" , req.query[ "fields" ]);
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

    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

app.get('/animals/:id/food', function(req, res){ //Other direction
    var id = req.params.id;
    var query = "SELECT food.id, food.name, food.quantity, food.id_animal FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;
    var conditions = ["name", "quantity","id_animal"];
    if ( "fields" in req.query) {
        query = query.replace( "food.id, food.name, food.quantity, food.id_animal" , req.query[ "fields" ]);
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

    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

///////////DELETE//////////
app.delete('/animals',function(req,res) {
    var query = "DELETE FROM animals";
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.delete('/cages',function(req,res) {
    var query = "DELETE FROM cages";
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.delete('/food',function(req,res) {
    var query = "DELETE FROM food";
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.delete('/staff',function(req,res) {
    var query = "DELETE FROM staff" ;
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.delete('/animals/:id',function(req,res) {
    var id = req.params.id ;
    var query = "DELETE FROM animals WHERE id=" + id;
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.delete('/cages/:id',function(req,res) {
    var id = req.params.id ;
    var query = "DELETE FROM cages WHERE id=" + id;
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.delete('/food/:id',function(req,res) {
    var id = req.params.id ;
    var query = "DELETE FROM food WHERE id=" + id;
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.delete('/staff/:id',function(req,res) {
    var id = req.params.id ;
    var query = "DELETE FROM staff WHERE id="+ id ;
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.listen(3000,function() {
   console.log('App listening on port 3000!');
});