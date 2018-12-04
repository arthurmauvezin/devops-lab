var db = require('../../config/database.js');

// SHOW ALL CAGES
exports.index = function(req, res) {
    var query =  "SELECT * FROM cages" ;
    var conditions = [ "name","description" , "area" ];
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

// SHOW ONE CAGE
exports.show = function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM `cages` WHERE id=" + id;
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
            res.send( "Access denied ===> ID NOT FOUND :::> TRY ANOTHER" );
        }
    });
};

// ADD A CAGE
exports.create = function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    var query =  "INSERT INTO `cages` (`name`, `description`, `area`) VALUES ('"+name+"','" + description +  "',"+area+")";
    db.query(query,  function (err, result, fields) {
        if (err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
};

// DELETE A CAGE
exports.delete = function(req, res) {
    var id = req.params.id;
    var query =  "DELETE FROM `cages` WHERE id=" + id;
    db.query(query,  function (err, result, fields) {
        if (err)  throw err;
        res.send(JSON.stringify( "Success" ));
    });
};
//DELETE ALL CAGES
exports.delete_all = function(req, res) {
    var query =  "DELETE FROM `cages`" ;
    db.query(query,  function (err, result, fields) {
        if(err)  throw err;
        res.send(JSON.stringify( "Success" ));
    });
};

//MODIFY A CAGE
exports.update = function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    var updates="";
    if(name)
    {updates +=" "+"`name`='"+name+"' ,"}
    if(description)
    {updates +=" "+"`description`='"+description+"' ,"}
    if(area)
    {updates +=" "+"`area`='"+area+"' ,"}
    updates=updates.substr(0, updates.length-1);
    var query =  "UPDATE `cages` SET "+updates+" WHERE ID="+id;
    db.query(query,  function (err, result, fields) {
        if (err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
};
//RELATION ANIMAL IN CAGE
exports.animal_in_cage = function(req, res) {
    var id = req.params.id;
    var query = "SELECT animals.id,animals.name,animals.food_per_day,animals.birthday,animals.entry_date,animals.id_cage FROM animals INNER JOIN cages ON cages.id = animals.id_cage WHERE cages.id=" + id;
    var conditions = [ "name","breed" , "food_per_day" , "birthday" , "entry_date" , "id_cage"];
    if("fields" in req.query)
    {
        var query = "SELECT * FROM animals INNER JOIN cages ON cages.id = animals.id_cage WHERE cages.id=" + id;
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



