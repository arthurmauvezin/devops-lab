const express = require ( 'express' );
const mysql = require ( 'mysql' );
const bodyParser = require ( 'body-parser' );
const app = express();
const host = process.environment.MYSQL_HOST;
const port = process.environment.MYSQL_PORT;
const database = process.environment.MYSQL_DATABASE;
const login = process.environment.MYSQL_LOGIN;
const password = process.environment.MYSQL_PASSWORD;
app.use(bodyParser.urlencoded({ extended: true }));
var db = mysql.createConnection({
    host: "host" ,
    user: "login" ,
    password: "password" ,
    database: "database"
});

//Firewall 
app.use( function (req, res, next) {
    if ( "key" in req.query) {
        var key = req.query[ "key" ];
        var query = "SELECT * FROM users WHERE apikey='" + key + "'" ;
        db.query(query, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0 ) {
            next();
        }
        else {
            res.send( "Access denied",403);
        }
        });
    } else {
        res.send( "Access denied",403);
    }
    });

// Animals 

    //Read
app.get( '/animals' , function (req, res) {
    var query = "SELECT * FROM animals" ;
    
        //Filtre par champs        
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }

        //Filtre par conditions
    var conditions = [ "name" , "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];
    for ( var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf( "WHERE" ) < 0 ) {
                query += " WHERE" ;
            } else {
                query += " AND" ;
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'" ;
        }
    }
    
        //Filtre d'ordre
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
        //Filtre par pagination
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

app.get( '/animals/:id' , function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id;
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

app.get( '/animals/:id/food' , function (req, res) {
    var id = req.params.id;
    var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;
    //Filtre par champs        
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }

        //Filtre par conditions
    var conditions = [ "id" , "name", "quantity"];
    for ( var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf( "WHERE" ) < 0 ) {
                query += " WHERE" ;
            } else {
                query += " AND" ;
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'" ;
        }
    }
    
        //Filtre d'ordre
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
        //Filtre par pagination
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

app.get( '/animals/:id/cages' , function (req, res) {
    var id = req.params.id;
    var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;
    //Filtre par champs        
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }

        //Filtre par conditions
    var conditions = [ "id" , "name", "description", "area"];
    for ( var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf( "WHERE" ) < 0 ) {
                query += " WHERE" ;
            } else {
                query += " AND" ;
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'" ;
        }
    }
    
        //Filtre d'ordre
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
        //Filtre par pagination
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

app.get( '/animals/:id/cages/:id_bis' , function (req, res) {
    var id = req.params.id;
    var id_bis = req.params.id_bis;
    var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id + " AND cages.id="+id_bis;
    //Filtre par champs        
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }

        //Filtre par conditions
    var conditions = [ "id" , "name", "description", "area"];
    for ( var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf( "WHERE" ) < 0 ) {
                query += " WHERE" ;
            } else {
                query += " AND" ;
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'" ;
        }
    }
    
        //Filtre d'ordre
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
        //Filtre par pagination
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

    //Create
app.post( '/animals' , function (req, res) {
    const name = req.body.name;
    const breed = req.body.breed;
    const food_per_day = req.body.food_per_day;
    const birthday = req.body.birthday;
    const entry_date = req.body.entry_date;
    const id_cage = req.body.id_cage;
    var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('" + name + "','" + breed + "','" + food_per_day + "','" + birthday + "','" + entry_date + "','" + id_cage + "')" ;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON.stringify( "Success"));
    });
});

    //Update
app.put( '/animals/:id' , function (req, res) {
    var id = req.params.id;
    var query = "" ;
    var fields = [ "name" , "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];
    for ( var index in fields) {
        if (fields[index] in req.body) {
            if (query.indexOf( "UPDATE" ) >= 0 ) {
                query += ", " + fields[index] + "='" +
                req.body[fields[index]] + "' ";
            } else {
                query += "UPDATE animals SET " + fields[index] + "='" +
                req.body[fields[index]] + "' " ;
            }
        }
    }
    query += "WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

    //Delete
app.delete( '/animals' , function (req, res) {
    var query = "DELETE FROM animals" ;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify( "Success" ));
    });
});

app.delete( '/animals/:id' , function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM animals WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify( "Success" ));
    });
});


// Cages

    //Read
app.get( '/cages' , function (req, res) {
    var query = "SELECT * FROM cages" ;
    
        //Filtre par champs
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
        //Filtre par conditions 
    var conditions = [ "name" , "description", "area" ];
    for ( var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf( "WHERE" ) < 0 ) {
                query += " WHERE" ;
            } else {
                query += " AND" ;
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'" ;
        }
    }
        //Filtre d'ordre
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
        //Filtre par pagination
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});
app.get( '/cages/:id' , function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + id;
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

app.get( '/cages/:id/animals' , function (req, res) {
    var id = req.params.id;
    var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id;
    //Filtre par champs        
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }

        //Filtre par conditions
    var conditions = [ "id" , "name", "breed", "food_per_day", "birthday","entry_date","id_cage"];
    for ( var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf( "WHERE" ) < 0 ) {
                query += " WHERE" ;
            } else {
                query += " AND" ;
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'" ;
        }
    }
    
        //Filtre d'ordre
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
        //Filtre par pagination
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

    //Create
app.post( '/cages' , function (req, res) {
    const name = req.body.name;
    const description = req.body.description;
    const area = req.body.area;
    var query = "INSERT INTO cages (name, description, area) VALUES ('" + name + "','" + description + "','" + area + "')" ;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON.stringify( "Success"));
    });
});


    //Update
app.put( '/cages/:id' , function (req, res) {
    var id = req.params.id;
    var query = "" ;
    var fields = [ "name" , "description", "area" ];
    for ( var index in fields) {
        if (fields[index] in req.body) {
            if (query.indexOf( "UPDATE" ) >= 0 ) {
                query += ", " + fields[index] + "='" +
                req.body[fields[index]] + "' ";
            } else {
                query += "UPDATE cages SET " + fields[index] + "='" +
                req.body[fields[index]] + "' " ;
            }
        }
    }
    query += "WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

    //Delete
app.delete( '/cages' , function (req, res) {
    var query = "DELETE FROM cages" ;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify( "Success" ));
    });
});

app.delete( '/cages/:id' , function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM cages WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify( "Success" ));
    });
});


// Food

    //Read
app.get( '/food' , function (req, res) {
    var query = "SELECT * FROM food" ;
        //Filtre par champs
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
        //Filtre par conditions 
    var conditions = [ "name" , "id_animal", "quantity" ];
    for ( var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf( "WHERE" ) < 0 ) {
                query += " WHERE" ;
            } else {
                query += " AND" ;
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'" ;
        }
    }
        //Filtre d'ordre
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
        //Filtre par pagination
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});
app.get( '/food/:id' , function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

app.get( '/food/:id/animals' , function (req, res) {
    var id = req.params.id;
    var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id=" + id;
    //Filtre par champs        
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }

        //Filtre par conditions
    var conditions = [ "id" , "name", "breed","food_per_day", "birthday", "entry_date", "id_cage"];
    for ( var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf( "WHERE" ) < 0 ) {
                query += " WHERE" ;
            } else {
                query += " AND" ;
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'" ;
        }
    }
    
        //Filtre d'ordre
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
        //Filtre par pagination
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});


app.get( '/food/:id/animals/:id_bis' , function (req, res) {
    var id = req.params.id;
    var id_bis = req.params.id_bis;
    var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id=" + id + " AND animals.id=" + id_bis;
    //Filtre par champs        
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }

        //Filtre par conditions
    var conditions = [ "id" , "name", "breed","food_per_day", "birthday", "entry_date", "id_cage"];
    for ( var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf( "WHERE" ) < 0 ) {
                query += " WHERE" ;
            } else {
                query += " AND" ;
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'" ;
        }
    }
    
        //Filtre d'ordre
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
        //Filtre par pagination
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

    //Create
app.post( '/food' , function (req, res) {
    const name = req.body.name;
    const id_animal = req.body.id_animal;
    const quantity = req.body.quantity;
    var query = "INSERT INTO food (name, id_animal, quantity) VALUES ('" + name + "','" + id_animal + "','" + quantity + "')" ;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON.stringify( "Success"));
    });
});

    //Update
app.put( '/food/:id' , function (req, res) {
    var id = req.params.id;
    var query = "" ;
    var fields = [ "name" , "id_animal", "quantity" ];
    for ( var index in fields) {
        if (fields[index] in req.body) {
            if (query.indexOf( "UPDATE" ) >= 0 ) {
                query += ", " + fields[index] + "='" +
                req.body[fields[index]] + "' ";
            } else {
                query += "UPDATE food SET " + fields[index] + "='" +
                req.body[fields[index]] + "' " ;
            }
        }
    }
    query += "WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

    //Delete
app.delete( '/food' , function (req, res) {
    var query = "DELETE FROM food" ;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify( "Success" ));
    });
});

app.delete( '/food/:id' , function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM food WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify( "Success" ));
    });
});

// Staff

    //Read
app.get( '/staff' , function (req, res) {
    var query = "SELECT * FROM staff" ;
        //Filtre par champs
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
        //Filtre par conditions 
    var conditions = [ "firstname" , "lastname", "wage" ];
    for ( var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf( "WHERE" ) < 0 ) {
                query += " WHERE" ;
            } else {
                query += " AND" ;
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'" ;
        }
    }
        //Filtre d'ordre
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
        //Filtre par pagination
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});
app.get( '/staff/:id' , function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id;
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});


    //Create
app.post( '/staff' , function (req, res) {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const wage = req.body.wage;
    var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('" + firstname + "','" + lastname + "','" + wage + "')" ;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON.stringify( "Success"));
        });
});

    //Update
app.put( '/staff/:id' , function (req, res) {
    var id = req.params.id;
    var query = "" ;
    var fields = [ "firstname" , "lastname", "wage" ];
    for ( var index in fields) {
        if (fields[index] in req.body) {
            if (query.indexOf( "UPDATE" ) >= 0 ) {
                query += ", " + fields[index] + "='" +
                req.body[fields[index]] + "' ";
            } else {
                query += "UPDATE staff SET " + fields[index] + "='" +
                req.body[fields[index]] + "' " ;
            }
        }
    }
    query += "WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

    //Delete
app.delete( '/staff' , function (req, res) {
    var query = "DELETE FROM staff" ;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify( "Success" ));
    });
});

app.delete( '/staff/:id' , function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM staff WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify( "Success" ));
    });
});

//Food-stats
app.get( '/food-stats' , function (req, res) {
    var query = "SELECT a.id as id, IFNULL(f.quantity/a.food_per_day,0) AS days_left FROM animals a join food f on f.id_animal=a.id;" ;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        //var x = result[0].name;
        res.send( JSON .stringify(result));
    });
});



app.listen( 3000 , function () {
    console.log( 'Example app listening on port 3000!' );
});