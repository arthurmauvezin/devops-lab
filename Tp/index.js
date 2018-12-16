    const express = require('express');
    const mysql = require('mysql');
    const app = express();
    const bodyParser = require ('body-parser');
    const rhost = process.environment.MYSQL_HOST;
    const rport = process.environment.MYSQL_PORT;
    const rdb = process.environment.MYSQL_DATABASE;
    const rlogin = process.environment.MYSQL_LOGIN;
    const rmdp = process.environment.MYSQL_PASSWORD;


    var db = mysql.createConnection( {  // Connexion crée avec les paramètres de notre choix, ici ceux de notre base de données
    host: rhost,
    user: rlogin,
    password: rmdp,
    database: rdb,
    port: rport
    });
    app.use(bodyParser.urlencoded({ extended: true }));

    /////////////FireWall///////////
    app.use(function(req,res,next){        // Pare-feu qui nous permet de protéger l'accès aux données
    	if("key" in req.query)
    	{
    		var key = req.query.key;
            var query = "SELECT * FROM users WHERE apikey = '" + key + "'"; //Requete du parefeu
            db.query(query,function(err,result,fields){
                if(err) throw err;
                if(result.length > 0)
                {
                    next();
                }
                else
                {
                    res.status(403).send("Access denied").end();  // Accès refusé
                }
            });
    	}
    	else
    	{
    		 res.status(403).send("Access denied").end();  // Accès refusé
    	}
    }); 

    ///////////Fonction de publication////////////
    app.post('/animals', function(req,res) {  //Publication d'une entité/ d'un objet animal
        var name = req.body.name; // Initialisation et récupération des différents paramètres
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
        var name = req.body.name;// Initialisation et récupération des différents paramètres
        var description = req.body.description;
        var area = req.body.area;
        var query = "INSERT INTO cages (name,description,area) VALUES ('" + name + "','" + description + "'," + area + ")";
        
        db.query(query,function(err,result,fields){
            if(err) throw err;
            res.send(JSON.stringify(result));
        });
    });

    app.post('/food', function(req,res) {
        var name = req.body.name; // Initialisation et récupération des différents paramètres
        var quantity = req.body.quantity;
        var id_animal = req.body.id_animal;
        var query = "INSERT INTO food (name,quantity,id_animal) VALUES ('" + name + "'," + quantity + "," + id_animal +")";
        
        db.query(query,function(err,result,fields){
            if(err) throw err;
            res.send(JSON.stringify(result));
        });
    });

    app.post('/staff', function(req,res) {
        var firstname = req.body.firstname; // Initialisation et récupération des différents paramètres
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
        var id = req.params.id; // Initialisation et récupération des différents paramètres
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
        var id = req.params.id; // Initialisation et récupération des différents paramètres
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
        var id = req.params.id; // Initialisation et récupération des différents paramètres
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
        var id = req.params.id; // Initialisation et récupération des différents paramètres
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


    ///////////Fonction de lecture////////////
    app.get('/animals', function(req,res) {
        var query = "SELECT * FROM animals"; // requete complète
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
        if ( "sort" in req.query) {  // sort , on établit une requete à travers un sort qui nous permet d'ajouter des WHERE ou des and, c'est à dire des conditions
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
        if ( "limit" in req.query) {   // limit, on limite la query à quelques termes, avec un certain offset
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
        var query = "SELECT * FROM animals WHERE id=" + id; // requete complète
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
        if ( "sort" in req.query) {  // sort , on établit une requete à travers un sort qui nous permet d'ajouter des WHERE ou des and, c'est à dire des conditions
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
        if ( "limit" in req.query) {  // limit, on limite la query à quelques termes, avec un certain offset
            query += " LIMIT " + req.query[ "limit" ];
            if ( "offset" in req.query) {
                query += " OFFSET " + req.query[ "offset" ];
            }
        }
        db.query(query,function(err,result,fields){ // Requete envoyée
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
        if ( "sort" in req.query) {  // sort , on établit une requete à travers un sort qui nous permet d'ajouter des WHERE ou des and, c'est à dire des conditions
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
        if ( "limit" in req.query) {  // limit, on limite la query à quelques termes, avec un certain offset
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
        if ( "sort" in req.query) {  // sort , on établit une requete à travers un sort qui nous permet d'ajouter des WHERE ou des and, c'est à dire des conditions
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
        if ( "limit" in req.query) {  // limit, on limite la query à quelques termes, avec un certain offset
            query += " LIMIT " + req.query[ "limit" ];
            if ( "offset" in req.query) {
                query += " OFFSET " + req.query[ "offset" ];
            }
        }
        db.query(query,function(err,result,fields){// Requete envoyée
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
        if ( "sort" in req.query) {  // sort , on établit une requete à travers un sort qui nous permet d'ajouter des WHERE ou des and, c'est à dire des conditions
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
        if ( "limit" in req.query) {  // limit, on limite la query à quelques termes, avec un certain offset
            query += " LIMIT " + req.query[ "limit" ];
            if ( "offset" in req.query) {
                query += " OFFSET " + req.query[ "offset" ];
            }
        }

        db.query(query,function(err,result,fields){ // Requete envoyée
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
        if ( "sort" in req.query) {  // sort , on établit une requete à travers un sort qui nous permet d'ajouter des WHERE ou des and, c'est à dire des conditions
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
        if ( "limit" in req.query) {  // limit, on limite la query à quelques termes, avec un certain offset
            query += " LIMIT " + req.query[ "limit" ];
            if ( "offset" in req.query) {
                query += " OFFSET " + req.query[ "offset" ];
            }
        }

        db.query(query,function(err,result,fields){ // Requete envoyée
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
        if ( "sort" in req.query) {  // sort , on établit une requete à travers un sort qui nous permet d'ajouter des WHERE ou des and, c'est à dire des conditions
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
        if ( "limit" in req.query) {  // limit, on limite la query à quelques termes, avec un certain offset
            query += " LIMIT " + req.query[ "limit" ];
            if ( "offset" in req.query) {
                query += " OFFSET " + req.query[ "offset" ];
            }
        }
        db.query(query,function(err,result,fields){ // Requete envoyée
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
        if ( "sort" in req.query) {  // sort , on établit une requete à travers un sort qui nous permet d'ajouter des WHERE ou des and, c'est à dire des conditions
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
        if ( "limit" in req.query) {  // limit, on limite la query à quelques termes, avec un certain offset
            query += " LIMIT " + req.query[ "limit" ];
            if ( "offset" in req.query) {
                query += " OFFSET " + req.query[ "offset" ];
            }
        }
        db.query(query,function(err,result,fields){ // Requete envoyée
            if(err) throw err;
            res.send(JSON.stringify(result));
        });
    });

    ///////////Statistiques//////////
    /*app.get('/food-stats', function(rep, res){   // FOOD STATS SIMPLE AVEC UNIQUEMENT LES CRITERES QUI NOUS INTERESSENT 
    	var query = "SELECT a.breed, (npj.Tquantity/a.Tfood_per_day) FROM (SELECT id, sum(quantity) AS 'Tquantity', name FROM food GROUP BY name) npj INNER JOIN (SELECT sum(food_per_day) AS 'Tfood_per_day', breed, id FROM animals GROUP BY breed) a ON a.id = npj.id ";
        db.query(query,function(err,result,fields){
            if(err) throw err;
            res.send(JSON.stringify(result));
        });
    });*/
    app.get('/food-stats', function(rep, res){  // FOOD STATS AVANCE AVEC BLINDAGE DES NULL AVEC LA FONCTION IF
        var query = "SELECT Q2.id, if(food_per_day = 0,0,Q1.quantity/Q2.food_per_day) as days_left FROM (SELECT quantity, id_animal, name FROM food GROUP BY name) as Q1 INNER JOIN (SELECT food_per_day, name, id FROM animals GROUP BY id) as Q2 ON Q2.id = Q1.id_animal;";
        db.query(query,function(err,result,fields){ // Requete envoyée
            if(err) throw err;
            res.send(JSON.stringify(result));
        });
    });


    //////////Relations//////////
    ///cages
    app.get('/animals/:id/cages', function(req, res){ //Toutes les données
        var id = req.params.id;
    	var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;
        var conditions = ["name", "description","area"];

        if ( "fields" in req.query) {
             tableauelem= req.query["fields"];
            
            // Si ce n'est pas un tableau
            if(!Array.isArray(tableauelem))
            {  
                // On ajoute le nom de la table au champ
                tableauelem = "cages"+"."+tableauelem;


            }
            else{

                // une boucle qui parcourt les elements
                for(var i=0; i<tableauelem.length; i++)
                {
                    
                    tableauelem[i] = "cages"+"."+tableauelem[i];
                }
            }
            query = query.replace( "cages.*" , tableauelem);
        }
          for (var index in conditions) {  // sort , on établit une requete à travers un sort qui nous permet d'ajouter des WHERE ou des and, c'est à dire des conditions
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

        if ("limit" in req.query) {  // limit, on limite la query à quelques termes, avec un certain offset
            query += " LIMIT " + req.query["limit"];
            if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
            }
        }
        db.query(query, function (err, result, fields) { // Requete envoyée
            if (err) throw err;
            res.send( JSON .stringify(result));
        });
    });

    app.get('/animals/:id/cages/:cid', function(req, res) { //Une donnée
        var AID = req.params.id;
        var CID = req.params.cid;
        var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + AID + " AND cages.id=" + CID;
        var conditions = ["name", "description","area"];
        if ( "fields" in req.query) {
            tableauelem= req.query["fields"];
            
            // Si ce n'est pas un tableau
            if(!Array.isArray(tableauelem))
            {  
                // On ajoute le nom de la table au champ
                tableauelem = "cages"+"."+tableauelem;


            }
            else{

                // une boucle qui parcourt les elements
                for(var i=0; i<tableauelem.length; i++)
                {
                    
                    tableauelem[i] = "cages"+"."+tableauelem[i];
                }
            }
               query = query.replace( "cages.*" , tableauelem);
           
        }
          for (var index in conditions) {  // sort , on établit une requete à travers un sort qui nous permet d'ajouter des WHERE ou des and, c'est à dire des conditions
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

        if ("limit" in req.query) {  // limit, on limite la query à quelques termes, avec un certain offset
    query += " LIMIT " + req.query["limit"];
    if ("offset" in req.query) {
    query += " OFFSET " + req.query["offset"];
    }
    }
     
        db.query(query, function(err, result, fields) { // Requete envoyée
            if (err) throw err;
            res.send(JSON.stringify(result));
        });
     });

    app.get('/cages/:id/animals', function(req, res){ //Other direction
        var id = req.params.id;
        var query = "SELECT animals.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id=" + id;
        var conditions = ["name", "breed","food_per_day", "birthday", "entry_date", "id_cage"];
        if ( "fields" in req.query) {
             tableauelem= req.query["fields"];
            
            // Si ce n'est pas un tableau
            if(!Array.isArray(tableauelem))
            {  
                // On ajoute le nom de la table au champ
                tableauelem = "animals"+"."+tableauelem;


            }
            else{

                // une boucle qui parcourt les elements
                for(var i=0; i<tableauelem.length; i++)
                {
                    
                    tableauelem[i] = "animals"+"."+tableauelem[i];
                }
            }

            query = query.replace( "animals.*" , tableauelem);
        }
          for (var index in conditions) {  // sort , on établit une requete à travers un sort qui nous permet d'ajouter des WHERE ou des and, c'est à dire des conditions
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

        if ("limit" in req.query) {  // limit, on limite la query à quelques termes, avec un certain offset
            query += " LIMIT " + req.query["limit"];
            if ("offset" in req.query) {
                query += " OFFSET " + req.query["offset"];
            }
        }
        db.query(query, function (err, result, fields) { // Requete envoyée
            if (err) throw err;
            res.send( JSON .stringify(result));
        });
    });

    ///Food
    app.get('/food/:id/animals', function(req, res){ //Toutes les données
        var id = req.params.id;
        var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + id;
        var conditions = ["name", "breed","food_per_day", "birthday", "entry_date", "id_cage"];
        if ( "fields" in req.query) {
              tableauelem= req.query["fields"];
            
            // Si ce n'est pas un tableau
            if(!Array.isArray(tableauelem))
            {  
                // On ajoute le nom de la table au champ
                tableauelem = "animals"+"."+tableauelem;


            }
            else{

                // une boucle qui parcourt les elements
                for(var i=0; i<tableauelem.length; i++)
                {
                    
                    tableauelem[i] = "animals"+"."+tableauelem[i];
                }
            }
            query = query.replace( "animals.*" , tableauelem);
        }
          for (var index in conditions) {  // sort , on établit une requete à travers un sort qui nous permet d'ajouter des WHERE ou des and, c'est à dire des conditions
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

        if ("limit" in req.query) {  // limit, on limite la query à quelques termes, avec un certain offset
    query += " LIMIT " + req.query["limit"];
    if ("offset" in req.query) {
    query += " OFFSET " + req.query["offset"];
    }
    }
        db.query(query, function (err, result, fields) { // Requete envoyée
            if (err) throw err;
            res.send( JSON .stringify(result));
        });
    });

    app.get('/food/:idf/animals/:ida', function(req, res){ //Dans l'autre sens
        var idF = req.params.idf;
        var idA = req.params.ida;
        var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + idF + " AND animals.id = " +idA;
        var conditions = ["name", "breed","food_per_day", "birthday", "entry_date", "id_cage"];
        if ( "fields" in req.query) {
             tableauelem= req.query["fields"];
            
            // Si ce n'est pas un tableau
            if(!Array.isArray(tableauelem))
            {  
                // On ajoute le nom de la table au champ
                tableauelem = "animals"+"."+tableauelem;


            }
            else{

                // une boucle qui parcourt les elements
                for(var i=0; i<tableauelem.length; i++)
                {
                    
                    tableauelem[i] = "animals"+"."+tableauelem[i];
                }
            }
            query = query.replace( "animals.*" , tableauelem);
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

        if ("limit" in req.query) {  // limit, on limite la query à quelques termes, avec un certain offset
            query += " LIMIT " + req.query["limit"];
            if ("offset" in req.query) {
                query += " OFFSET " + req.query["offset"];
            }
        }
        db.query(query, function (err, result, fields) { // Requete envoyée
            if (err) throw err;
            res.send( JSON .stringify(result));
        });
    });

    app.get('/animals/:id/food', function(req, res){ //Other direction
        var id = req.params.id;
        var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;
        var conditions = ["name", "quantity","id_animal"];
        if ( "fields" in req.query) {  //fields : 1er filtre on vérifie que les fields sont bons en utilisant un filtre
             tableauelem= req.query["fields"];
            
            // Si ce n'est pas un tableau
            if(!Array.isArray(tableauelem))
            {  
                // On ajoute le nom de la table au champ
                tableauelem = "food"+"."+tableauelem;


            }
            else{

                // une boucle qui parcourt les elements
                for(var i=0; i<tableauelem.length; i++)
                {
                    
                    tableauelem[i] = "food"+"."+tableauelem[i];
                }
            }
            query = query.replace( "food.*" , tableauelem);
        }
          for (var index in conditions) {   // sort , on établit une requete à travers un sort qui nous permet d'ajouter des WHERE ou des and, c'est à dire des conditions
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

        if ("limit" in req.query) {                     // limit, on limite la query à quelques termes, avec un certain offset
            query += " LIMIT " + req.query["limit"];
            if ("offset" in req.query) {
                query += " OFFSET " + req.query["offset"];
            }
        }
        db.query(query, function (err, result, fields) {  // On envoie la query à la database
            if (err) throw err;
            res.send( JSON .stringify(result));
        });
    });

    ///////////DELETE//////////
    app.delete('/animals',function(req,res) {
        var query = "DELETE FROM animals";
        db.query(query,function(err,result,fields) { // Requete envoyée
            if (err) throw err;
            res.send(JSON.stringify("Success"));
        });
    });
    app.delete('/cages',function(req,res) {
        var query = "DELETE FROM cages";
        db.query(query,function(err,result,fields) {// Requete envoyée
            if (err) throw err;
            res.send(JSON.stringify("Success"));
        });
    });
    app.delete('/food',function(req,res) {
        var query = "DELETE FROM food";
        db.query(query,function(err,result,fields) {// Requete envoyée
            if (err) throw err;
            res.send(JSON.stringify("Success"));
        });
    });
    app.delete('/staff',function(req,res) {
        var query = "DELETE FROM staff" ;
        db.query(query,function(err,result,fields) {// Requete envoyée
            if (err) throw err;
            res.send(JSON.stringify("Success"));
        });
    });

    app.delete('/animals/:id',function(req,res) {
        var id = req.params.id ;
        var query = "DELETE FROM animals WHERE id=" + id;
        db.query(query,function(err,result,fields) {// Requete envoyée
            if (err) throw err;
            res.send(JSON.stringify("Success"));
        });
    });
    app.delete('/cages/:id',function(req,res) {
        var id = req.params.id ;
        var query = "DELETE FROM cages WHERE id=" + id;
        db.query(query,function(err,result,fields) {// Requete envoyée
            if (err) throw err;
            res.send(JSON.stringify("Success"));
        });
    });
    app.delete('/food/:id',function(req,res) {
        var id = req.params.id ;
        var query = "DELETE FROM food WHERE id=" + id;
        db.query(query,function(err,result,fields) {// Requete envoyée
            if (err) throw err;
            res.send(JSON.stringify("Success"));
        });
    });
    app.delete('/staff/:id',function(req,res) {
        var id = req.params.id ;
        var query = "DELETE FROM staff WHERE id="+ id ;
        db.query(query,function(err,result,fields) {// Requete envoyée
            if (err) throw err;
            res.send(JSON.stringify("Success"));
        });
    });

    app.listen(3000,function() {
        db.connect(function(err) { // Connexion au port 3000
            if(err) throw err;
            console.log('example app listening on port 3000');
        } );
    });
