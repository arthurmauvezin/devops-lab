//TP1
const express = require('express'); // Chargement des librairies
const mysql = require('mysql');
const app = express();

//TP2
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// CONNECTION
var db = mysql.createConnection({
	host: "localhost" ,
	user: "root" ,
	password: "root" ,
	database: "project" ,
	port: "3306"
});


// FIREWALL
app.use( function (req, res, next) {  
    if  ( "key"   in  req.query) {
        var  key = req.query[ "key" ];
        var  query =  "SELECT * FROM users WHERE apikey='"  + key +  "'" ;//Requête SQL table Direction valeur de l'apikey :ceciestmonjeton
        db.query(query,  function (err, result, fields) {  
            if  (err)  throw  err;
            if  (result.length >  0 ) { 
                next();
            }  
            else  {
                res.sendStatus(403); // Erreur 403 si la clé différente de ceciestmonjeton
            } 
         }); 
    }  
    else  {
      res.sendStatus(403); 
    }
});


app.listen(3000, function() {
    db.connect(function(err) {
    //if (err) throw err;
     console.log('Connection to database successful!');
    });
    console.log('Example app listening on port 3000!');
});



app.delete( '/animals' , function (req, res) {
    
	var query = "DELETE FROM animals" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});

app.delete( '/cages' , function (req, res) {
	var query = "DELETE FROM cages" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});
app.delete( '/food' , function (req, res) {
	var query = "DELETE FROM food" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});
app.delete( '/staff' , function (req, res) {
	var query = "DELETE FROM staff" ;
	db.query(query, function (err, result, fields) {
	if (err) throw err;
	res.send( JSON .stringify( "Success" ));
	});
});




//CREAT
app.post( '/animals' , function (req, res){ 
    
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;
	var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('" + name + "','" + breed + "','" + food_per_day + "','" + birthday + "','" + entry_date + "','" + id_cage +"')" ;
    // Affichage de la réussite de la requête
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});
app.post( '/cages' , function (req, res){ 
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	var query = "INSERT INTO cages (name, description, area) VALUES ('" + name + "','" + description + "','" + area + "')" ;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});
app.post( '/food' , function (req, res){ 
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;
	var query = "INSERT INTO food (name, quantity, id_animal) VALUES ('" + name + "','" + quantity + "','" + id_animal +"')" ;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});
app.post( '/staff' , function (req, res){ 
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('" + firstname + "','" + lastname + "','" + wage +"')" ;
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
	});
});














//READ
app.get( '/staff' , function (req, res) {
    
// FILTRE CONDITION
	var query = "SELECT * FROM staff" ;
	var conditions = [ "id","firstname", "lastname", "wage" ];
    
    // Parcours du tableau des éléments récupérés dans la requête
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
            
            // 1ère condition
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} 
            
            // 2ème condition
            else {
				query += " AND" ;
			}
            
            // Concaténation des conditions
			query += " " + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
    
// FILTRE D'ORDRE
    // Tri des champs selon le paramètre saisi en url
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1); // On enlève le dernier élément que l'on a rentré
			var field = sort[index].substr(1); 
			query += " " + field;
				if (direction == "-")
				query += " DESC,"; // Décroissant
				else
				query += " ASC,"; // Croissant
		}
	query = query.slice(0, -1);

	}    
    
// FILTRE DES CHAMPS
    //Si les champs que l'on veut sont remplis dans l'url
    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); }
    //localhost:3000/staff/?key=ceciestmonjeton&fields=Nom
    
// FILTRE PAR PAGINATION
    // Limit = nbe de filtres que l'on veut afficher
	if ( "limit" in req.query) {
        
        // Concaténation de la requête en fonction du nbe de filtres que l'on veut afficher
		query += " LIMIT " + req.query[ "limit" ];
        
        // Décalage
		if ( "offset" in req.query) {
             // Concaténation de la requête en fonction du décalage que l'on veut afficher
			query += " OFFSET " + req.query[ "offset" ];
		}
	}
    
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
    
});



//READ ALL DATA
app.get( '/animals' , function (req, res) {
    
// FILTRE CONDITION
	var query = "SELECT * FROM animals" ;
	var conditions = [ "id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
            
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} 
            
            else {
				query += " AND" ;
			}
            
			query += " " + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
    
// FILTRE D'ORDRE
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1); 
			var field = sort[index].substr(1); 
			query += " " + field;
				if (direction == "-")
				query += " DESC,"; 
				else
				query += " ASC,"; 
		}
	query = query.slice(0, -1);

	}    
    
// FILTRE DES CHAMPS
    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); }
    
// FILTRE PAR PAGINATION
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


//READ ALL DATA
app.get( '/cages' , function (req, res) {
    
// FILTRE CONDITION
	var query = "SELECT * FROM cages" ;
	var conditions = [ "id", "name", "description", "area" ];
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
            
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} 
            
            else {
				query += " AND" ;
			}
            
			query += " " + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
    
// FILTRE D'ORDRE
    // Tri des champs selon le paramètre saisi en url
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1); 
			var field = sort[index].substr(1); 
			query += " " + field;
				if (direction == "-")
				query += " DESC,"; 
				else
				query += " ASC,"; 
		}
	query = query.slice(0, -1);

	}    
    
// FILTRE DES CHAMPS
    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); }
    
// FILTRE PAR PAGINATION
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

//READ ALL DATA
app.get( '/food' , function (req, res) {
    
// FILTRE CONDITION
	var query = "SELECT * FROM food" ;
	var conditions = [ "id", "name", "quantity", "id_animal" ];
    
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
            
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} 
            
            else {
				query += " AND" ;
			}
			query += " " + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
    
// FILTRE D'ORDRE
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1); 
			var field = sort[index].substr(1); 
			query += " " + field;
				if (direction == "-")
				query += " DESC,"; 
				else
				query += " ASC,";
		}
	query = query.slice(0, -1);

	}    
    
// FILTRE DES CHAMPS
    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); }
    
// FILTRE PAR PAGINATION
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










//READ
app.get( '/animals/:id' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id=" + id;

    if ("fields" in req.query) { 
		query = query.replace("*", req.query["fields"]); 
	}

	query += ";";
    
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});

app.get( '/staff/:id' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id=" + id;
    
    if ("fields" in req.query) { 
		query = query.replace("*", req.query["fields"]); 
	}
	query += ";";
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});
app.get( '/cages/:id' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;
    
    if ("fields" in req.query) { 
		query = query.replace("*", req.query["fields"]); 
	}
	query += ";";
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});
app.get( '/food/:id' , function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id=" + id;
    
    if ("fields" in req.query) { 
		query = query.replace("*", req.query["fields"]); 
	}
	query += ";";
	db.query(query, function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify(result));
	});
});










//UPDATE
app.put( '/animals/:id' , function (req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;

	var query = "UPDATE animals SET " 
	+ "name = (CASE WHEN ? IS NULL THEN name ELSE ? END), " 
	+ "breed = (CASE WHEN ? IS NULL THEN breed ELSE ? END), "
	+ "food_per_day = (CASE WHEN ? IS NULL THEN food_per_day ELSE ? END), "
	+ "birthday = (CASE WHEN ? IS NULL THEN birthday ELSE ? END), "
	+ "entry_date = (CASE WHEN ? IS NULL THEN entry_date ELSE ? END), "
	+ "id_cage = (CASE WHEN ? IS NULL THEN id_cage ELSE ? END) "
	+ "WHERE id=" + id;
	db.query(query, [name, name, breed, breed, food_per_day, food_per_day, birthday, birthday, entry_date, entry_date, id_cage, id_cage], function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
		});
	});

app.put( '/cages/:id' , function (req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;

	var query = "UPDATE cages SET " 
	+ "name = (CASE WHEN ? IS NULL THEN name ELSE ? END), " 
	+ "description = (CASE WHEN ? IS NULL THEN description ELSE ? END), "
	+ "area = (CASE WHEN ? IS NULL THEN area ELSE ? END) "
	+ "WHERE id=" + id;
	db.query(query, [name, name, description, description, area, area], function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
		});
	});

app.put( '/food/:id' , function (req, res) {
	var id = req.params.id;
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;

	var query = "UPDATE food SET " 
	+ "name = (CASE WHEN ? IS NULL THEN name ELSE ? END), " 
	+ "quantity = (CASE WHEN ? IS NULL THEN quantity ELSE ? END), "
	+ "id_animal = (CASE WHEN ? IS NULL THEN id_animal ELSE ? END) "
	+ "WHERE id=" + id;
	db.query(query, [name, name, quantity, quantity, id_animal, id_animal], function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
		});
	});

app.put( '/staff/:id' , function (req, res) {
	var id = req.params.id;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;

	var query = "UPDATE staff SET " 
	+ "firstname = (CASE WHEN ? IS NULL THEN firstname ELSE ? END), " 
	+ "lastname = (CASE WHEN ? IS NULL THEN lastname ELSE ? END), "
	+ "wage = (CASE WHEN ? IS NULL THEN wage ELSE ? END) "
	+ "WHERE id=" + id;
	db.query(query, [firstname, firstname, lastname, lastname, wage, wage], function (err, result, fields) {
		if (err) throw err;
		res.send( JSON .stringify( "Success" ));
		});
	});






// Delete an animal with the id in the route
app.delete( '/animals/:id' , function (req, res) {
    
    // Get the id of the animal
	var id = req.params.id;

	var query = "DELETE FROM animals WHERE id=" + id;
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
app.delete( '/food/:id' , function (req, res) {
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id=" + id;
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











//RELATION ANIMAL IN CAGES : ALL

//READ JOINTURE
app.get('/cages/:idca/animals', function(req, res) {
	var idca = req.params.idca;
// FILTRE CONDITION
	var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + idca;
	//var conditions = [ "animals.id", "animals.name", "animals.breed", "animals.food_per_day", "animals.birthday", "animals.entry_date", "animals.id_cage", "cages.id", "cages.name", "cages.description", "cages.area" ];
    var conditions = [ "id", "name", "breed", "food_per_day", "birthday", "entry_date" ];
    //var conditions = [ "animals.id", "animals.name", "animals.breed", "animals.food_per_day", "animals.birthday", "animals.entry_date", "cages.id", "cages.name", "cages.description", "cages.area" ];
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} 
            else {
				query += " AND" ;
			}
			query += " animals." + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
// FILTRE D'ORDRE
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1); 
			var field = sort[index].substr(1); 
			query += " " + field;
				if (direction == "-")
				query += " DESC,"; 
				else
				query += " ASC,"; 
		}
	query = query.slice(0, -1);
	}    
    
// FILTRE DES CHAMPS
    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); }
    
// FILTRE PAR PAGINATION
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


//RELATION ANIMAL IN CAGES : ONE

//READ JOINTURE
app.get('/cages/:idca/animals/:idan', function(req, res) {
	var idca = req.params.idca;
	var idan = req.params.idan;
// FILTRE CONDITION
	var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + idca + " AND animals.id=" +idan;
	var conditions = [ "id", "name", "breed", "food_per_day", "birthday", "entry_date" ];
    
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} 
            else {
				query += " AND" ;
			}
			query += " animals." + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
    
// FILTRE D'ORDRE
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1); 
			var field = sort[index].substr(1); 
			query += " " + field;
				if (direction == "-")
				query += " DESC,"; 
				else
				query += " ASC,"; 
		}
	query = query.slice(0, -1);

	}    
    
// FILTRE DES CHAMPS
    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); }
    
// FILTRE PAR PAGINATION
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




 
//RELATION CAGES IN ANIMALS : ALL

//READ JOINTURE
app.get('/animals/:idan/cages', function(req, res) {
	var idan = req.params.idan;
// FILTRE CONDITION
	var query = "SELECT cages.* FROM animals INNER JOIN cages ON cages.id = animals.id_cage WHERE animals.id=" + idan;
	var conditions = [ "id", "name", "description", "area" ];
    
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} 
            else {
				query += " AND" ;
			}
			query += " cages." + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
    
// FILTRE D'ORDRE
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1); 
			var field = sort[index].substr(1); 
			query += " " + field;
				if (direction == "-")
				query += " DESC,"; 
				else
				query += " ASC,"; 
		}
	query = query.slice(0, -1);

	}    
    
// FILTRE DES CHAMPS
    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); }
    
// FILTRE PAR PAGINATION
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



//RELATION CAGES IN ANIMALS : ONE

//READ JOINTURE
app.get('/animals/:idan/cages/:idca', function(req, res) {
	var idca = req.params.idca;
	var idan = req.params.idan;
// FILTRE CONDITION
	var query = "SELECT cages.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + idca + " AND animals.id=" +idan;
	var conditions = [ "id", "name", "description", "area" ];
    
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} 
            else {
				query += " AND" ;
			}
			query += " cages." + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
    
// FILTRE D'ORDRE
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1); 
			var field = sort[index].substr(1); 
			query += " " + field;
				if (direction == "-")
				query += " DESC,"; 
				else
				query += " ASC,"; 
		}
	query = query.slice(0, -1);

	}    
    
// FILTRE DES CHAMPS
    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); }
    
// FILTRE PAR PAGINATION
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




//RELATION ANIMAL IN FOOD : ALL

//READ JOINTURE
app.get('/food/:id/animals', function(req, res) {
    var id = req.params.id;
// FILTRE CONDITION
	var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + id;
	var conditions = [ "id", "name", "breed", "food_per_day", "birthday", "entry_date" ];
    
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} 
            else {
				query += " AND" ;
			}
			query += " animals." + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
// FILTRE D'ORDRE
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1); 
			var field = sort[index].substr(1); 
			query += " " + field;
				if (direction == "-")
				query += " DESC,"; 
				else
				query += " ASC,"; 
		}
	query = query.slice(0, -1);
	}    
// FILTRE DES CHAMPS
    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); }
// FILTRE PAR PAGINATION
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


//RELATION ANIMAL IN FOOD : ONE

//READ JOINTURE
app.get('/food/:id_food/animals/:id_animal', function(req, res) {
    var id_animal = req.params.id_animal;
    var id_food = req.params.id_food;
// FILTRE CONDITION
	var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id_animal + " AND food.id=" +id_food;
	var conditions = [ "id", "name", "breed", "food_per_day", "birthday", "entry_date" ];
    
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} 
            else {
				query += " AND" ;
			}
			query += " animals." + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
// FILTRE D'ORDRE
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1); 
			var field = sort[index].substr(1); 
			query += " " + field;
				if (direction == "-")
				query += " DESC,"; 
				else
				query += " ASC,"; 
		}
	query = query.slice(0, -1);
	}    
// FILTRE DES CHAMPS
    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); }
// FILTRE PAR PAGINATION
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



  
//RELATION FOOD IN ANIMAL : ALL

//READ JOINTURE
app.get('/animals/:id/food', function(req, res) {
    var id = req.params.id;
// FILTRE CONDITION
	var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id; 
	var conditions = [ "id", "name", "quantity" ];
    
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} 
            else {
				query += " AND" ;
			}
			query += " food." + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
// FILTRE D'ORDRE
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1); 
			var field = sort[index].substr(1); 
			query += " " + field;
				if (direction == "-")
				query += " DESC,"; 
				else
				query += " ASC,"; 
		}
	query = query.slice(0, -1);
	}    
// FILTRE DES CHAMPS
    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); }
// FILTRE PAR PAGINATION
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

//RELATION FOOD IN ANIMAL : ONE

//READ JOINTURE
app.get('/animals/:id_animal/food/:id_food', function(req, res) {
    var id_animal = req.params.id_animal;
    var id_food = req.params.id_food;
// FILTRE CONDITION
	var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id_animal + " AND food.id=" +id_food;
	var conditions = [ "id", "name", "quantity" ];
    
	for ( var index in conditions) {
		if (conditions[index] in req.query) {
			if (query.indexOf( "WHERE" ) < 0 ) {
				query += " WHERE" ;
			} 
            else {
				query += " AND" ;
			}
			query += " food." + conditions[index] + "='" +
			req.query[conditions[index]] + "'" ;
		}
	}
// FILTRE D'ORDRE
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			var direction = sort[index].substr(0, 1); 
			var field = sort[index].substr(1); 
			query += " " + field;
				if (direction == "-")
				query += " DESC,"; 
				else
				query += " ASC,"; 
		}
	query = query.slice(0, -1);
	}    
// FILTRE DES CHAMPS
    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); }
// FILTRE PAR PAGINATION
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





// FOOD STATS 
app.get('/food-stats',function(req, res) { 
  	
  	var query = "SELECT animals.id AS id, CASE WHEN (food.quantity / animals.food_per_day) IS NULL THEN 0 ELSE (food.quantity / animals.food_per_day) END AS days_left FROM animals JOIN food ON animals.id=food.id_animal";
    db.query(query , function(err, result, fields) {
    if (err) throw err;
 
       res.send(JSON.stringify(result)); 
   });
   }); 
