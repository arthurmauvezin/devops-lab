const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require ('body-parser');


var db = mysql.createConnection( {
    host : "localhost",
    user : "root",
    password : "",
    database : "zoo"
});

app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Fonction de get
 *
 **/
app.get('/animal', function(req,res) {
    var query = "SELECT * FROM animaux";
    var conditions = ["nom","race","qtnourriture","datenaissance","dateentree"];
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
app.get('/cage', function(req,res) {
    var query = "SELECT * FROM cage"
    var conditions = ["nom","taille"];
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
app.get('/nourriture', function(req,res) {
    var query = "SELECT * FROM nourriture";
    var conditions = ["nom","qte"];
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
app.get('/personnel', function(req,res) {
    var query = "SELECT * FROM personnel";
    var conditions = ["prenom","nom","salaire"];
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


/**
 * Fonction de post
 *
 **/
app.post('/animal', function(req,res) {
    var query = "INSERT INTO animaux ("
    for(var prop in req.body) {
        query+=prop;
        query += ",";
    }
    var query = query.substring(0, query.length-1);
    query += ") VALUES (";
    for(var prop in req.body) {
        query+="'" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query +=")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.post('/cage', function(req,res) {
    var query = "INSERT INTO cage ("
    for(var prop in req.body) {
        query+=prop;
        query += ",";
    }
    var query = query.substring(0, query.length-1);
    query += ") VALUES (";
    for(var prop in req.body) {
        query+="'" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query +=")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.post('/nourriture', function(req,res) {
    var query = "INSERT INTO nourriture ("
    for(var prop in req.body) {
        query+=prop;
        query += ",";
    }
    var query = query.substring(0, query.length-1);
    query += ") VALUES (";
    for(var prop in req.body) {
        query+="'" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query +=")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.post('/personnel', function(req,res) {
    var query = "INSERT INTO personnel ("
    for(var prop in req.body) {
        query+=prop;
        query += ",";
    }
    var query = query.substring(0, query.length-1);
    query += ") VALUES (";
    for(var prop in req.body) {
        query+="'" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query +=")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});


/**
 * Fonction de put
 *
 **/
app.put('/animal/:id',function(req,res) {
    console.log(req.params);
    var id = req.params.id;
    var query = "UPDATE animaux SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE aid = " +id;
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});

app.put('/cage/:id',function(req,res) {
    console.log(req.params);
    var id = req.params.id;
    var query = "UPDATE cage SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE cid = " +id;
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});

app.put('/nourriture/:id',function(req,res) {
    console.log(req.params);
    var id = req.params.id;
    var query = "UPDATE nourriture SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE nid = " +id;
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});

app.put('/personnel/:id',function(req,res) {
    var id = req.params.id;
    var query = "UPDATE personnel SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE pid = " +id;
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});


/**
 * Fonction de delete
 *
 **/
app.delete('/animal/:id',function(req,res) {
    var id = req.params.id;
    console.log(id);
    var query = "DELETE FROM animal WHERE id=" +id;
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.delete('/nourriture/:id',function(req,res) {
    var id = req.params.id;
    console.log(id);
    var query = "DELETE FROM nourriture WHERE id=" +id;
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.delete('/cage/:id',function(req,res) {
    var id = req.params.id;
    console.log(id);
    var query = "DELETE FROM cage WHERE id=" +id;
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.delete('/personnel/:id',function(req,res) {
    var id = req.params.id;
    console.log(id);
    var query = "DELETE FROM persronnel WHERE id=" +id;
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.get('/food-stat',function(req,res){
   var query = "select t2.race, t1.Qte/t2.qtnourriture as \"Nombre d'heures restantes\" from (select sum(qte) as \"Qte\", nom, nid from nourriture group by nom) as t1 Inner join ( select nid, sum(qtnourriture) as \"qtnourriture\", race from animaux group by race) as t2 on t2.nid = t1.nid";
   db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
   });
});



/**
 * Requetages avec arguments dans l'URL
 *
 **/
app.get( '/query' , function (req, res) {
    res.send( JSON.stringify(req.query));
});

app.get( '/data' , function (req, res) {
    var query = "SELECT * FROM data" ;
    var conditions = [ "user_id" , "value" ];
    for ( var index in conditions) {
        if (conditions[index] in req.query) {
            if (query.indexOf( "WHERE" ) < 0 ) {
                query += " WHERE" ;
            }
            query += " " + conditions[index] + "='" +
                req.query[conditions[index]] + "'" ;
        }
    }
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

/**
 * Query
 */
app.get('/nourriture/:id/animal',function(req,res){
    var id = req.params.id;
    var query = "SELECT animaux.aid as 'Animal ID', animaux.nom as 'Nom animal', nourriture.nom as 'Nourriture' FROM animaux INNER JOIN nourriture ON animaux.nid = nourriture.nid WHERE nourriture.nid=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});
app.get('/nourriture/:id_nourriture/animal/:id_animal',function(req,res){
    var id_nourriture = req.params.id_nourriture;
    var id_animal = req.params.id_animal;
    var query = "SELECT animaux.aid as 'Animal ID', animaux.nom as 'Nom animal', nourriture.nom as 'Nourriture' FROM animaux INNER JOIN nourriture ON animaux.nid = nourriture.nid WHERE nourriture.nid=" + id_nourriture + " AND animaux.aid="+id_animal;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});
app.get('/cage/:id/animal',function(req,res){
    var id = req.params.id;
    var query = "SELECT animaux.aid as 'Animal ID', animaux.nom as 'Nom animal', cage.nom as 'Cage' FROM animaux INNER JOIN cage ON animaux.cid = cage.cid WHERE cage.cid=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});
app.get('/cage/:id_cage/animal/:id_animal',function(req,res){
    var id_cage = req.params.id_cage;
    var id_animal = req.params.id_animal;
    var query = "SELECT animaux.aid as 'Animal ID', animaux.nom as 'Nom animal', cage.nom as 'Cage' FROM animaux INNER JOIN cage ON animaux.cid = cage.cid WHERE cage.cid=" + id_nourriture + " AND animaux.aid="+id_animal;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});
app.get('/nourriture/:id/cage',function(req,res){
    var id = req.params.id;
    var query = "SELECT cage.cid as 'cage ID', cage.nom as 'Nom cage', nourriture.nom as 'Nourriture' FROM cage INNER JOIN nourriture ON cage.cid = nourriture.nid WHERE nourriture.nid=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});
app.get('/nourriture/:id_nourriture/cage/:id_cage',function(req,res){
    const id_nourriture = req.params.id_nourriture;
    const id_cage = req.params.id_cage;
    var query = "SELECT cage.cid as 'cage ID', cage.nom as 'Nom cage', nourriture.nom as 'Nourriture' FROM cage INNER JOIN nourriture ON cage.cid = nourriture.nid WHERE nourriture.nid=" + id_nourriture + " AND cage.cid="+id_cage;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

/**
 * Création de la page web
 *
 *
 **/
app.listen(3000,function() {
    db.connect(function(err) {
        if(err) throw err;
        console.log('example app listening on port 3000');
    } );
});