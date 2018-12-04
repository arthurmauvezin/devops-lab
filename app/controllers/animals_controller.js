var db = require('../../config/database.js');

// SHOW ALL ANIMALS
exports.index = function(req, res) {
    var query =  "SELECT * FROM animals" ;
    var conditions = [ "name","breed" , "food_per_day" , "birthday" , "entry_date" , "id_cage"];
    if("fields" in req.query)
    {
        query = query.replace("*", req.query["fields"]);
    }
    for ( var index in conditions) {
        if (conditions[index]  in req.query) {
            if (query.indexOf( "WHERE" ) <  0  ) {
                query +=  " WHERE";
            }  else {
                query +=  " AND";
            }
            query +=  " " + conditions[index] +  "='" +
                req.query[conditions[index]] +  "'" ;
        }
    }

    // sorting
    if( "sort" in req.query){
        var sort = req.query[ "sort" ].split( "," );
        query +=  " ORDER BY" ;
        for ( var index  in sort) {
            var direction = sort[index].substr( 0  ,  1  );
            var field = sort[index].substr( 1  );
            query+=  " " + field;
            if (direction ==  "-")
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
        }
        query = query.slice( 0  ,  -1 );
    }
    // limit offset on query
    if ( "limit" in req.query) {
        query +=  " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query,  function (err, result, fields) {
        if(err) throw err;
        res.send( JSON.stringify(result));
    });
};

// SHOW AN ANIMAL
exports.show = function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM `animals` WHERE id=" + id;
    if("fields" in req.query)
    {
        query = query.replace("*", req.query["fields"]);
    }
    db.query(query, function(err, result, fields) {
        if(err) throw err;
        if (result.length >  0  ) {
            // next();
            res.send(JSON.stringify(result));
        }
        else{
            res.send( "Access denied" );
        }
    });
};

// ADD A NEW ANIMAL
exports.create = function(req, res) {
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;


    var query = "INSERT INTO `animals` (`name`, `breed`, `food_per_day`, `birthday`, `entry_date`, `id_cage`) VALUES ('" + name + "','"+breed+"',"+food_per_day+", '"+birthday+"','"+entry_date+"',"+id_cage+")";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
};

// DELETE AN ANIMAL
exports.delete = function(req, res) {
    var id = req.params.id;
    var query =  "DELETE FROM `animals` WHERE id=" + id;
    db.query(query,  function (err, result, fields) {
        if (err)  throw err;
        res.send(JSON.stringify( "Success" ));
    });
};

// DELETE ALL ANIMALS
exports.delete_all = function(req, res) {
    var query =  "DELETE FROM `animals`" ;
    db.query(query,  function (err, result, fields) {
        if(err)  throw err;
        res.send(JSON.stringify( "Success" ));
    });
};

//MODIFY AN ANIMAL
exports.update = function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;
    var updates="";
    if(name)
    {updates +=" "+"`name`='"+name+"' ,"}
    if(breed)
    {updates +=" "+"`breed`='"+breed+"' ,"}
    if(food_per_day)
    {updates +=" "+"`food_per_day`="+food_per_day+" ,"}
    if(birthday)
    {updates +=" "+"`birthday`='"+birthday+"' ,"}
    if(entry_date)
    {updates +=" "+"`entry_date`='"+entry_date+"' ,"}
    if(id_cage)
    {updates +=" "+"`id_cage`="+id_cage+" ,"}
    updates=updates.substr(0, updates.length-1);
    var query = "UPDATE animals SET "+ updates + " WHERE id="+ id;
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
};

// RELATION FOOD OF ANIMAL
exports.food_of_animal = function(req, res) {
    var id = req.params.id;
    var query = "SELECT food.id,food.name,food.quantity FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;
    var conditions = [ "name","quantity" , "id_animal" ];
    if("fields" in req.query)
    {
        var query = "SELECT * FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;
        query = query.replace("*", req.query["fields"]);
    }
    for ( var index in conditions) {
        if (conditions[index]  in req.query) {
            if (query.indexOf( "WHERE" ) <  0  ) {
                query +=  " WHERE";
            }  else {
                query +=  " AND";
            }
            query +=  " " + conditions[index] +  "='" +
                req.query[conditions[index]] +  "'" ;
        }
    }

    // sorting
    if( "sort" in req.query){
        var sort = req.query[ "sort" ].split( "," );
        query +=  " ORDER BY" ;
        for ( var index  in sort) {
            var direction = sort[index].substr( 0  ,  1  );
            var field = sort[index].substr( 1  );
            query+=  " " + field;
            if (direction ==  "-")
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
        }
        query = query.slice( 0  ,  -1 );
    }
    // limit offset on query
    if ( "limit" in req.query) {
        query +=  " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
};

// RELATION CAGE OF ANIMAL
exports.cage_of_animal = function(req, res) {
    var id = req.params.id;
    var query = "SELECT cages.id,cages.name,cages.description,cages.area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;
    var conditions = [ "name","description" , "area" ];
    if("fields" in req.query)
    {
        var query = "SELECT * FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;
        query = query.replace("*", req.query["fields"]);
    }
    for ( var index in conditions) {
        if (conditions[index]  in req.query) {
            if (query.indexOf( "WHERE" ) <  0  ) {
                query +=  " WHERE";
            }  else {
                query +=  " AND";
            }
            query +=  " " + conditions[index] +  "='" +
                req.query[conditions[index]] +  "'" ;
        }
    }

    // sorting
    if( "sort" in req.query){
        var sort = req.query[ "sort" ].split( "," );
        query +=  " ORDER BY" ;
        for ( var index  in sort) {
            var direction = sort[index].substr( 0  ,  1  );
            var field = sort[index].substr( 1  );
            query+=  " " + field;
            if (direction ==  "-")
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
        }
        query = query.slice( 0  ,  -1 );
    }
    // limit offset on query
    if ( "limit" in req.query) {
        query +=  " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
};

// RELATION CAGE OF ANIMAL
exports.cage_of_animals = function(req, res) {
    var id_cage = req.params.id_cage;
    var id_animal = req.params.id_animal;
    var query = "SELECT cages.id,cages.name,cages.description,cages.area FROM cages INNER JOIN animals ON animals.id_cage = cages.id WHERE animals.id=" + id_animal+" and cages.id="+id_cage;
    if("fields" in req.query)
    {
        var query = "SELECT * FROM cages INNER JOIN animals ON animals.id_cage = cages.id WHERE animals.id=" + id_animal+" and cages.id="+id_cage;
        query = query.replace("*", req.query["fields"]);
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
};


