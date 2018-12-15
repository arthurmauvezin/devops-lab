///// MIGNOT GAUTIER LOPES RAPHAEL ING4SI2 /////////////

// Init des var //
const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require ('body-parser');
const rhost = process.environment.MYSQL_HOST;
const rport = process.environment.MYSQL_PORT;
const rdatabase = process.environment.MYSQL_DATABASE;
const rlogin = process.environment.MYSQL_LOGIN;
const rpassword = process.environment.MYSQL_PASSWORD;

// Creation de la connection avec la base de données locale //
var db = mysql.createConnection( {
    host : rhost,
    user : rlogin,
    password : rpassword,
    database : rdatabase
});

app.use(bodyParser.urlencoded({ extended: true }));


// Mise en place du firewall ou MiddleWare
// IL est en premier pour protéger toutes les fonctions qui suivent 
 app.use(function(req, res, next) {
 	if ("key" in req.query) { // Verification de la key du token
 		var key = req.query["key"]; // recuperation de l'argument key
 		var query = "SELECT * FROM users WHERE apikey='" + key + "'"; // Recuperation de la key dans la BDD
 		db.query(query, function(err, result, fields) { // Test de la key et de la concordance avec celle de la table 
 			if (err) throw err; 
 			if (result.length > 0) { // Verification de l'authentification 
 				next(); // Authentification réussie
 			}
 			else {
 				res.status(403).send("Access denied").end(); // Echec de l'authentification
 			}
 		});
 	} else {
 			res.status(403).send("Access denied").end(); // Echec de l'authentification
 	}
 });  




/////// Fonctions GET(Read) //////
// READ ALL //
	//Animal//
app.get('/animals', function(req,res) { 
    var query = "SELECT * FROM animals"; // Récuperation des animaux dans la BDD
    // Filtrage condition, détail des attributs voulus 
	var conditions = ["name","breed","food_per_day","birthday","entry_date"]; 
    // Filtrage champs 
	if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); // le All dans la query est remplacé par les champs envoyés 
    }
	// Filtrage Condition
    for(var index in conditions){
		// On vérifie si le mot clef Where est présent dans la query 
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) { // S'il n'est pas présent, on le rajoute 
                query += " WHERE";
            }
			// Creation de la query avec la ou les différentes conditions voulues
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";  
        }
    }
	// Filtrage Sort
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
	
	// Filtrage Pagination
    if ( "limit" in req.query) {
		// on rajoute le mot clef Limite dans la requete SQL
        query += " LIMIT " + req.query[ "limit" ];
		//Filtrage OFFSET
		// ce filtrage est inclus dans le "limit" car en SQL, il est utilisable seulement lorsque le limit est présent 
        if ( "offset" in req.query) {
			// Rajout du mot clef OFFSET 
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
	// Push de la query, avec ou sans filtrage
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});
//// READ ONE ANIMAL //////
app.get( '/animals/:id(\\d+)' , function (req, res) { // recuperation d'un animal précis en focntion de son id 
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id=" + id; // Recuperation des attributs 
    // Creation du filtre conditions
	var conditions = ["name","breed","food_per_day","birthday","entry_date"];
    // Filtrage champs 
	if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); // le All dans la query est remplacé par les champs envoyés 
    }
	// Filtrage Condition
    for(var index in conditions){
		// On vérifie si le mot clef Where est présent dans la query 
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) { // S'il n'est pas présent, on le rajoute 
                query += " WHERE";
            }
			// Creation de la query avec la ou les différentes conditions voulues
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";  
        }
    }
	// Filtrage Sort
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
	
	// Filtrage Pagination
    if ( "limit" in req.query) {
		// on rajoute le mot clef Limite dans la requete SQL
        query += " LIMIT " + req.query[ "limit" ];
		//Filtrage OFFSET
		// ce filtrage est inclus dans le "limit" car en SQL, il est utilisable seulement lorsque le limit est présent 
        if ( "offset" in req.query) {
			// Rajout du mot clef OFFSET 
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
	// Push de la query, avec ou sans filtrage
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});


/// READ ALL CAGES ////
app.get('/cages', function(req,res) {
    var query = "SELECT * FROM cages"
    var conditions = ["name","description","area"];
    // Filtrage champs 
	if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); // le All dans la query est remplacé par les champs envoyés 
    }
	// Filtrage Condition
    for(var index in conditions){
		// On vérifie si le mot clef Where est présent dans la query 
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) { // S'il n'est pas présent, on le rajoute 
                query += " WHERE";
            }
			// Creation de la query avec la ou les différentes conditions voulues
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";  
        }
    }
	// Filtrage Sort
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
	
	// Filtrage Pagination
    if ( "limit" in req.query) {
		// on rajoute le mot clef Limite dans la requete SQL
        query += " LIMIT " + req.query[ "limit" ];
		//Filtrage OFFSET
		// ce filtrage est inclus dans le "limit" car en SQL, il est utilisable seulement lorsque le limit est présent 
        if ( "offset" in req.query) {
			// Rajout du mot clef OFFSET 
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
	// Push de la query, avec ou sans filtrage
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});
//// READ ONE CAGE
app.get( '/cages/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;
	var conditions = ["name","description","area"];
    // Filtrage champs 
	if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); // le All dans la query est remplacé par les champs envoyés 
    }
	// Filtrage Condition
    for(var index in conditions){
		// On vérifie si le mot clef Where est présent dans la query 
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) { // S'il n'est pas présent, on le rajoute 
                query += " WHERE";
            }
			// Creation de la query avec la ou les différentes conditions voulues
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";  
        }
    }
	// Filtrage Sort
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
	
	// Filtrage Pagination
    if ( "limit" in req.query) {
		// on rajoute le mot clef Limite dans la requete SQL
        query += " LIMIT " + req.query[ "limit" ];
		//Filtrage OFFSET
		// ce filtrage est inclus dans le "limit" car en SQL, il est utilisable seulement lorsque le limit est présent 
        if ( "offset" in req.query) {
			// Rajout du mot clef OFFSET 
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
	// Push de la query, avec ou sans filtrage
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

//// READ ALL FOOD
app.get('/food', function(req,res) {
    var query = "SELECT * FROM food";
    var conditions = ["name","quantity"];
   // Filtrage champs 
	if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); // le All dans la query est remplacé par les champs envoyés 
    }
	// Filtrage Condition
    for(var index in conditions){
		// On vérifie si le mot clef Where est présent dans la query 
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) { // S'il n'est pas présent, on le rajoute 
                query += " WHERE";
            }
			// Creation de la query avec la ou les différentes conditions voulues
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";  
        }
    }
	// Filtrage Sort
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
	
	// Filtrage Pagination
    if ( "limit" in req.query) {
		// on rajoute le mot clef Limite dans la requete SQL
        query += " LIMIT " + req.query[ "limit" ];
		//Filtrage OFFSET
		// ce filtrage est inclus dans le "limit" car en SQL, il est utilisable seulement lorsque le limit est présent 
        if ( "offset" in req.query) {
			// Rajout du mot clef OFFSET 
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
	// Push de la query, avec ou sans filtrage
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

//// READ ONE FOOD
app.get( '/food/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id=" + id;
	var conditions = ["name","quantity"];
   // Filtrage champs 
	if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); // le All dans la query est remplacé par les champs envoyés 
    }
	// Filtrage Condition
    for(var index in conditions){
		// On vérifie si le mot clef Where est présent dans la query 
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) { // S'il n'est pas présent, on le rajoute 
                query += " WHERE";
            }
			// Creation de la query avec la ou les différentes conditions voulues
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";  
        }
    }
	// Filtrage Sort
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
	
	// Filtrage Pagination
    if ( "limit" in req.query) {
		// on rajoute le mot clef Limite dans la requete SQL
        query += " LIMIT " + req.query[ "limit" ];
		//Filtrage OFFSET
		// ce filtrage est inclus dans le "limit" car en SQL, il est utilisable seulement lorsque le limit est présent 
        if ( "offset" in req.query) {
			// Rajout du mot clef OFFSET 
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
	// Push de la query, avec ou sans filtrage
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

//// READ ALL STAFF ////
app.get('/staff', function(req,res) {
    var query = "SELECT * FROM staff";
    var conditions = ["firstname","lastname","wage"];
   // Filtrage champs 
	if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); // le All dans la query est remplacé par les champs envoyés 
    }
	// Filtrage Condition
    for(var index in conditions){
		// On vérifie si le mot clef Where est présent dans la query 
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) { // S'il n'est pas présent, on le rajoute 
                query += " WHERE";
            }
			// Creation de la query avec la ou les différentes conditions voulues
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";  
        }
    }
	// Filtrage Sort
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
	
	// Filtrage Pagination
    if ( "limit" in req.query) {
		// on rajoute le mot clef Limite dans la requete SQL
        query += " LIMIT " + req.query[ "limit" ];
		//Filtrage OFFSET
		// ce filtrage est inclus dans le "limit" car en SQL, il est utilisable seulement lorsque le limit est présent 
        if ( "offset" in req.query) {
			// Rajout du mot clef OFFSET 
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
	// Push de la query, avec ou sans filtrage
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

//// READ ONE STAFF ///
app.get( '/staff/:id(\\d+)' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id=" + id;
	var conditions = ["firstname","lastname","wage"];
   // Filtrage champs 
	if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); // le All dans la query est remplacé par les champs envoyés 
    }
	// Filtrage Condition
    for(var index in conditions){
		// On vérifie si le mot clef Where est présent dans la query 
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) { // S'il n'est pas présent, on le rajoute 
                query += " WHERE";
            }
			// Creation de la query avec la ou les différentes conditions voulues
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";  
        }
    }
	// Filtrage Sort
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
	
	// Filtrage Pagination
    if ( "limit" in req.query) {
		// on rajoute le mot clef Limite dans la requete SQL
        query += " LIMIT " + req.query[ "limit" ];
		//Filtrage OFFSET
		// ce filtrage est inclus dans le "limit" car en SQL, il est utilisable seulement lorsque le limit est présent 
        if ( "offset" in req.query) {
			// Rajout du mot clef OFFSET 
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
	// Push de la query, avec ou sans filtrage
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

///// FONCTION POST( CREATE) //////
//// CREATE ANIMAL
app.post('/animals', function(req,res) {
	// Creation de la query 
    var query = "INSERT INTO animals ("
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
    //Push de la query 
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});
//Création d'une cage
app.post('/cages', function(req,res) {
    // Creation de la query 
    var query = "INSERT INTO cages ("
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
    //Push de la query 
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});
//Création d'une nourriture
app.post('/food', function(req,res) {
    // Creation de la query 
    var query = "INSERT INTO food ("
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
    //Push de la query 
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Création d'un employé
app.post('/staff', function(req,res) {
    // Creation de la query 
    var query = "INSERT INTO staff ("
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
    //Push de la query 
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});


/**
 * Fonction de put
 *
 **/
 //mise a jour d'un animal
app.put('/animals/:id',function(req,res) {
    console.log(req.params);
    var id = req.params.id;
    // Creation de la query 
    var query = "UPDATE animals SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    //Push de la query 
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});

//mise a jour de la cage
app.put('/cages/:id',function(req,res) {
    console.log(req.params);
    var id = req.params.id;
    // Creation de la query 
    var query = "UPDATE cages SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    //Push de la query 
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});
//mise a jour de la nourriture
app.put('/food/:id',function(req,res) {
    console.log(req.params);
    var id = req.params.id;
    // Creation de la query 
    var query = "UPDATE food SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    //Push de la query 
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});
//mise a jour d'un employé
app.put('/staff/:id',function(req,res) {
    var id = req.params.id;
    // Creation de la query 
    var query = "UPDATE staff SET ";
    for (var prop in req.body) {
        query+=prop;
        query += " = '" + req.body[prop] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    //Push de la query 
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});


///// FONCTION DELETE 
//// DELETE ANIMAL
 app.delete('/animals', function (req, res) {
	 // Creation de la query 
	var query = "DELETE FROM animals";
	//Push de la query 
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

/////// DELETE DE ONE ANIMAL
app.delete('/animals/:id',function(req,res) {
	//Recuperation de l'id
    var id = req.params.id;
    console.log(id);
	//Creation de la query avec l'id à delete
    var query = "DELETE FROM animals WHERE id=" +id;
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//////DELETE FOOD
app.delete('/food', function (req, res) {
	// Creation de la query 
 	var query = "DELETE FROM food";
	//Push de la query 
 	db.query(query, function (err, result, fields) {
 		if (err) throw err;
 		res.send(JSON.stringify("Success"));
 	});
 });

//// DELETE ONE FOOD
app.delete('/food/:id',function(req,res) {
	//Recuperation de l'id
    var id = req.params.id;
    console.log(id);
		//Creation de la query avec l'id à delete
    var query = "DELETE FROM food WHERE id=" +id;
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
//////DELETE CAGES
 app.delete('/cages', function (req, res) {
	 // Creation de la query 
 	var query = "DELETE FROM cages";
	//Push de la query 
 	db.query(query, function (err, result, fields) {
 		if (err) throw err;
 		res.send(JSON.stringify("Success"));
 	});
 });
 
 //// DELETE ONE CAGE
app.delete('/cages/:id',function(req,res) {
	//Recuperation de l'id
    var id = req.params.id;
    console.log(id);
	//Creation de la query avec l'id à delete
    var query = "DELETE FROM cages WHERE id=" +id;
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


////// DELETE STAFF
app.delete('/staff', function (req, res) {
	 // Creation de la query 
 	var query = "DELETE FROM staff";
	//Push de la query 
 	db.query(query, function (err, result, fields) {
 		if (err) throw err;
 		res.send(JSON.stringify("Success"));
 	});
 });
 
 
 ////// DELETE ONE STAFF
app.delete('/staff/:id',function(req,res) {
	//Recuperation de l'id
    var id = req.params.id;
    console.log(id);
	//Creation de la query avec l'id à delete
    var query = "DELETE FROM staff WHERE id=" +id;
    db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});


///////////// FOOD-STATS ///////////////////
//// PRIMAIRE 
/*app.get('/food-stats', function(rep, res){
    //création de la requete
    var query = "SELECT Q2.id, Q1.quantity/Q2.food_per_day as days_left FROM (SELECT quantity, id_animal, name FROM food GROUP BY name) as Q1 INNER JOIN (SELECT food_per_day, name, id FROM animals GROUP BY id)as Q2 ON Q2.id = Q1.id_animal";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});*/


app.get('/food-stats', function(req, res) {
    var query = "SELECT animals.id as id, if(animals.food_per_day = 0,0,food.quantity/animals.food_per_day) as days_left from animals join food where animals.id = food.id_animal";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


//////// RELATIONSHIPS ////////////
 
 
 ////////////RELATIONSHIPS BETWEEN ANIMALs AND CAGE////////
 ////////// READ ALL /////////////
 app.get('/animals/:id/cages', function(req, res) {
 	var id = req.params.id;
	// Selection de la cage en fonction de l'id de l'animal voulu
 	var query = "SELECT cages.id, cages.name, cages.description, cages.area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;							
	// Creation du filtre conditions avec les attributs voulus 
	var conditions = ["name", "description","area"];
	// Filtrage champs
	if ( "fields" in req.query) {
		// Creation de la query avec les attributs de la cage 
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
	// filtrage pagination
	if ("limit" in req.query) {
query += " LIMIT " + req.query["limit"];
if ("offset" in req.query) {
query += " OFFSET " + req.query["offset"];
}
}
//Push de la query
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
 });

 
 
 /////// READ ONE ////////////
 app.get('/animals/:id/cages/:cid', function(req, res) {
 	var AID = req.params.id;
 	var CID = req.params.cid;
    //Création de la query
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
//Push de la Query
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
 });
///// READ ALL SENS INVERSE////////
app.get('/cages/:id/animals', function(req, res){ 
    var id = req.params.id;
    //Création de la query
    var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day , animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id=" + id;
    var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
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
//Push de la query
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
 });
 
 
 
 ////////////RELATIONSHIPS BETWEEN ANIMALs AND FOOD////////
 
 //// READ ALL /////
app.get('/food/:id/animals', function(req, res){ 
    var id = req.params.id;
    var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day , animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + id;
    var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
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
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
 });
 
  //// READ ONE /////
app.get('/food/:id/animals/:aid', function(req, res){ //Other direction
    var FID = req.params.id;
    var AID = req.params.aid;
    var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day , animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + FID + " AND animals.id = " +AID;
    var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
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
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
 });
 
 //// READ ALL SENS INVERSE ////
app.get('/animals/:id/food', function(req, res){ 
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
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
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