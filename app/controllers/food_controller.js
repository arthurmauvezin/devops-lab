var db = require('../../config/database.js');

// SHOW ALL FOOD
exports.index = function(req, res) {
    var query =  "SELECT * FROM food" ;
    var conditions = [ "name","quantity" , "id_animal" ];
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

// SHOW FOOD BY ID
exports.show = function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM `food` WHERE id=" + id;
    if("fields" in req.query)
    {
        query = query.replace("*", req.query["fields"]);
    }
    db.query(query, function(err, result, fields) {
        if(err) throw err;
        if (result.length >  0  ) {
            res.send(JSON.stringify(result));
        }
        else{
            res.send( "Access denied ===> ID NOT FOUND :::> TRY ANOTHER" );
        }
        // res.send(JSON.stringify(result));
    });
};

// ADD FOOD
exports.create = function(req, res) {
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    var query =  "INSERT INTO `food` (`name`, `quantity`, `id_animal`) VALUES ('"+name+"'," + quantity +  ","+id_animal+")";
    db.query(query,  function (err, result, fields) {
        if (err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
};

//DELETE A FOOD
exports.delete = function(req, res) {
    var id = req.params.id;
    var query =  "DELETE FROM `food` WHERE id=" + id;
    db.query(query,  function (err, result, fields) {
        if (err)  throw err;
        res.send(JSON.stringify( "Success" ));
    });
};
//DELETE ALL FOOD
exports.delete_all = function(req, res) {
    var query =  "DELETE FROM `food`" ;
    db.query(query,  function (err, result, fields) {
        if(err)  throw err;
        res.send(JSON.stringify( "Success" ));
    });
};

//MODIFY FOOD
exports.update = function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    var updates="";
    if(name)
    {updates +=" "+"`name`='"+name+"' ,"}
    if(quantity)
    {updates +=" "+"`quantity`="+quantity+" ,"}
    if(id_animal)
    {updates +=" "+"`id_animal`="+id_animal+" ,"}
    updates=updates.substr(0, updates.length-1);
    var query =  "UPDATE `food` SET "+updates+" WHERE ID="+id;
    // var query =  "UPDATE `food` SET `name`='"+name+"', `quantity`='"+quantity+"', `id_animal`='"+id_animal+"' WHERE id="+id;
    db.query(query,  function (err, result, fields) {
        if (err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
};
// RELATION ANIMALS WITH FOOD
exports.animals_with_food = function(req, res) {
    var id = req.params.id;
    var query = "SELECT animals.id,animals.name,animals.food_per_day,animals.birthday,animals.entry_date,animals.id_cage FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + id;
    var conditions = [ "id","name","breed" , "food_per_day" , "birthday" , "entry_date" , "id_cage"];
    if("fields" in req.query)
    {
        var query = "SELECT * FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + id;
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
// RELATION FOOD OF ANIMAL
exports.food_of_animal = function(req, res) {
    var id_food = req.params.id_food;
    var id_animal = req.params.id_animal;
    var query = "SELECT animals.id,animals.name,animals.food_per_day,animals.birthday,animals.entry_date,animals.id_cage FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + id_food+" and animals.id="+id_animal;
    if("fields" in req.query)
    {
        var query = "SELECT * FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + id_food+" and animals.id="+id_animal;
        query = query.replace("*", req.query["fields"]);
    }
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
};

// FOOD STATISTICS
exports.food_status = function(req, res) {
    var query = "SELECT animals.id,IFNULL(quantity/food_per_day,0) as days_left FROM food join animals where food.id_animal=animals.id";
    db.query(query ,  function(err, result, fields) {
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
};
