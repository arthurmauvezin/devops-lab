/*

Code réalisé par Nicolas GUILLOT et Alizée FERRANDIS
INGE 4 SI2 (section FR)

*/



const  express =  require ( 'express' ); 
const  mysql =  require ( 'mysql' ); 
const  app = express();

const bodyParser = require ('body-parser'); 
app.use(bodyParser.urlencoded({extended:true})); 

var  db = mysql.createConnection({ 
	host:  "localhost" ,
	user:  "root" ,
	password:  "root" ,
	database:  "projet" ,
	port:  "3306" 
});


//PARE-FEU
app.use( function (req, res, next) {  
    if  ( "key"   in  req.query) {
        var  key = req.query[ "key" ];
        var  query =  "SELECT * FROM users WHERE apikey='"  + key +  "'" ;
        db.query(query,  function (err, result, fields) {  
            if  (err)  throw  err;
            if  (result.length >  0 ) { 
                next();
            }  
            else  {
                res.sendStatus(403); // Erreur 403(Forbidden)
            } 
         }); 
    }  
    else  {
      res.sendStatus(403); 
    }
});


/**********************ANIMALS**********************/
//READ ALL DATA
app.get('/animals' ,  function (req, res) {
    var query = "SELECT * FROM animals" ;

    //filtrage
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    query = filtres(query,conditions,req); 

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
 });

//READ DATA BY ID
app.get('/animals/:id' ,  function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id=" + id;

	//filtrage
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    query = filtres(query,conditions,req); 


	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//RELATIONS CAGE IN ANIMALS READ ALL
app.get('/animals/:id/cages', function(req, res) {
	var id = req.params.id;
	var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage=cages.id WHERE animals.id= " + id;

    //filtrage
    var conditions = ["name", "description", "area"];
    query = filtres(query,conditions,req); 

	db.query(query,function(err,result,fileds){
		if(err) throw err;
		res.send(JSON.stringify(result));
	});
});

//RELATION CAGE IN ANIMALS READ ONE 
app.get('/animals/:id_animal/cages/:id_cage', function(req, res) {
    var id_animal = req.params.id_animal;
    var id_cage = req.params.id_cage;

    var query = "SELECT cages.* FROM animals INNER JOIN cages on cages.id = animals.id_cage WHERE animals.id = " + id_animal + " AND cages.id = " + id_cage;

    //filtrage 
    var conditions = ["name", "description", "area"];
    var query = filtres(query, conditions, req);

    db.query(query, function(err, result, fields) {
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

//RELATIONS FOOD IN ANIMALS READ ALL 
app.get('/animals/:id/food', function(req, res) {
	var id = req.params.id;
	var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id=food.id_animal WHERE animals.id= " + id;

    //filtrage
    var conditions = ["name", "quantity", "id_animal" ];
    query = filtres(query, conditions, req); 

	db.query(query,function(err,result,fileds){
		if(err) throw err;
		res.send(JSON.stringify(result));
	});
});

//CREATE DATA
app.post('/animals', function (req, res) {
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;

    var query = "INSERT INTO animals (id, name, breed, food_per_day, birthday, entry_date, id_cage) VALUES (NULL, '" + name + "', '" + breed + "', '" + food_per_day + "', '" + birthday + "', '" + entry_date + "', '" + id_cage + "'); ";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//UPDATE DATA (PARTIAL OR FULL)
app.put('/animals/:id', function (req, res) {
    var id = req.params.id;
    var query = "UPDATE animals SET * WHERE animals.id="+ id;
    

    let string = "";
    for(let key in req.body){
        string += key + "= '" + req.body[key] + "',";
    }
    string = string.substr(0, string.length-1); 
    query = query.replace("*", string);

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//DELETE DATA
app.delete('/animals/:id', function (req, res) {
	var id = req.params.id;
    var query = "DELETE FROM animals WHERE animals.id = " + id;

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//DELETE ALL DATA
app.delete('/animals', function (req, res) {
    var query = "DELETE FROM animals" ;
    
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});




/**********************CAGES**********************/
//READ ALL DATA 
app.get( '/cages' ,  function (req, res) {
    var query = "SELECT * FROM cages" ;
    
    //filtrage
    var conditions = ["name", "description", "area" ];
    query = filtres(query, conditions, req);
    
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//READ DATA BY ID
app.get( '/cages/:id' ,  function (req, res) {
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;

    //filtrage
    var conditions = ["name", "description", "area" ];
    query = filtres(query, conditions, req);

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//RELATIONS ANIMALS IN CAGES READ ALL
app.get('/cages/:id/animals', function(req, res) {
	var id = req.params.id;
	var query = "SELECT animals.* FROM animals INNER JOIN cages ON animals.id_cage=cages.id WHERE cages.id= " + id;

    //filtrage
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    query = filtres(query, conditions, req); 

	db.query(query,function(err,result,fileds){
		if(err) throw err;
		res.send(JSON.stringify(result));
	});
});

//CREATE DATA 
app.post('/cages',function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area; 

    var query = "INSERT INTO cages (id, name , description, area) VALUES (NULL, '"+ name +"','"+ description +"','" + area + "')";
        db.query(query,function(err, result, fields) {
                if(err) throw err;
                res.send(JSON.stringify("Success"));
        });
});

//UPDATE DATA (PARTIAL OR FULL)
app.put('/cages/:id', function (req, res) {
    var id = req.params.id;
    var query = "UPDATE cages SET * WHERE cages.id="+ id;
    
    let string = "";
    for(let key in req.body){
        string += key + "= '" + req.body[key] + "',";
    }
    string = string.substr(0, string.length-1); 
    query = query.replace("*", string);

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//DELETE DATA 
app.delete('/cages/:id', function (req, res) {
	var id = req.params.id;
    var query = "DELETE FROM cages WHERE cages.id = " + id;

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//DELETE ALL DATA 
app.delete('/cages', function (req, res) {
    var query = "DELETE FROM cages";
    
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});




/**********************FOOD**********************/
//READ ALL DATA 
app.get('/food', function (req, res) {
    var query = "SELECT * FROM food" ;

    //filtrage
    var conditions = [ "name", "quantity", "id_animal" ];
	query = filtres(query, conditions, req);
    
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
 });

//READ DATA BY ID 
app.get( '/food/:id' ,  function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;

    //filtrage
    var conditions = [ "name", "quantity", "id_animal" ];
	query = filtres(query, conditions, req);

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//RELATIONS ANIMALS IN FOOD READ ALL
app.get('/food/:id/animals', function(req, res) {
	var id = req.params.id;
	var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id=food.id_animal WHERE food.id= " + id;

    //filtrage
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    query = filtres(query, conditions, req); 

	db.query(query,function(err,result,fileds){
		if(err) throw err;
		res.send(JSON.stringify(result));
	});
});

//RELATIONS ANIMALS IN FOOD READ ONE 
app.get('/food/:id_food/animals/:id_animal', function(req,res){
	var id_food = req.params.id_food;
	var id_animal = req.params.id_animal;
	var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id=food.id_animal WHERE food.id= " + id_food + " AND animals.id = " + id_animal;

    //filtrage
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    query = filtres(query, conditions, req); 

	db.query(query, function(err, result, fields){
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//CREATE DATA
app.post('/food',function(req, res) {
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal; 

    var query = "INSERT INTO food (id, name , quantity, id_animal) VALUES (NULL, '"+ name +"','"+ quantity +"','" + id_animal + "');";
        db.query(query,function(err, result, fields) {
                if(err) throw err;
                res.send(JSON.stringify("Success"));
        });
});

//UPDATE DATA (PARTIAL OR FULL)
app.put('/food/:id', function (req, res) {
    var id = req.params.id;

    var query = "UPDATE food SET * WHERE food.id="+ id;
    
    let string = "";
    for(let key in req.body){
        string += key + "= '" + req.body[key] + "',";
    }
    string = string.substr(0, string.length-1); 

    query = query.replace("*", string);

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//DELETE DATA 
app.delete('/food/:id', function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM food WHERE food.id = " + id;

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//DELETE ALL DATA 
app.delete('/food', function (req, res) {
    var query = "DELETE FROM food";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});




/**********************STAFF**********************/
//READ ALL DATA
app.get('/staff',  function (req, res) {
    var query = "SELECT * FROM staff" ;
    
    //filtrage
    var conditions = ["firstname", "lastname", "wage" ];
	query = filtres(query, conditions, req);
    
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
 });

//READ DATA BY ID
app.get('/staff/:id',  function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id;

    //filtrage
    var conditions = ["firstname", "lastname", "wage" ];
	query = filtres(query, conditions, req);
	

    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//CREATE DATA
app.post('/staff',function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage; 

    var query = "INSERT INTO staff (id, firstname , lastname, wage) VALUES (NULL, '"+ firstname +"','"+ lastname +"','" + wage + "')";
        db.query(query,function(err, result, fields) {
                if(err) throw err;
                res.send(JSON.stringify("Success"));
        });
});

//UPDATE DATA (PARTIAL OR FULL)
app.put('/staff/:id', function (req, res) {
    var id = req.params.id;
    var query = "UPDATE staff SET * WHERE staff.id="+ id;
    
    let string = "";
    for(let key in req.body){
        string += key + "= '" + req.body[key] + "',";
    }
    string = string.substr(0, string.length-1); 
    query = query.replace("*", string);

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//DELETE DATA
app.delete('/staff/:id', function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM staff WHERE staff.id = " + id;

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//DELETE ALL DATA
app.delete('/staff', function (req, res) {
    var query = "DELETE FROM staff";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});




/**********************FOOD-STAT**********************/
app.get('/food-stats' , function (req, res) {
    var query = "SELECT animals.id, animals.food_per_day, A.sum FROM animals JOIN (SELECT id_animal, SUM(quantity) as sum FROM food GROUP BY id_animal) A ON A.id_animal=animals.id"; 
    
    db.query(query, function (err, result, fields) {
        if (err) throw err;

        var days_left = new Array;
        var id = new Array;
        var stat = new Array;
        
        // Parcours du résultat de la requête
        for(var i=0; i<result.length;i++){
            
            // Calcul
            if(result[i].food_per_day!=0){
                days_left[i] = Math.round(result[i].sum / result[i].food_per_day);
            } else {
                days_left[i] =0;
            }
            // On récupère l'id de la animal concernée par le calcul
            id[i] = result[i].id;

            stat.push({"id" : id[i], "days_left" : days_left[i]});
        }
        res.send(stat);
    });
});





//FONCTION DE FILTRAGE 
function filtres (query, conditions, req){
    
    //FILTRE CONDITION
    for ( var index in conditions) {
        if (conditions[index] in req.query) {
            
            if (query.indexOf("WHERE") < 0 ) {
                query += " WHERE" ;
            } 
            else {
                query += " AND" ;
            }
            
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'" ;
        }
    }
    
    //FILTRE D'ORDRE
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY ";
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

    //FILTRE DES CHAMPS
    if ("fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }
    
    
    //FILTRE PAR PAGINATION
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        
        //Décalage
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    return query; 
} 

app.listen( 3000 ,  function () { 
	db.connect( function (err) {
 		if (err) throw err;
 		console.log('OK');
	}); 
	console.log('Connection to database successful!' );
});



