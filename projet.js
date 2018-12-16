const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var db = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database: "projet",
port: "3306"
});

// Pare-feu
// il faut ajouter ?key=ceciestmonjeton à la suite de l'url

app.use(function(req, res, next) {
  if ("key" in req.query) {
    var key = req.query["key"];
    var query = "SELECT * FROM users WHERE apikey='" + key + "'";
    db.query(query, function(err, result, fields) {
      if (err) throw err;
      if (result.length > 0) {
        next();
      }
      else {
        // erreur HTTP 403
        res.status(403).send("Accès refusé");
      }
    });
  } else {
    // erreur HTTP 403
    res.status(403).send("Accès refusé");
  }
});

// Fonction pour les filtres pour réduire la taille du code

function filtres(req,res,conditions,query){

//filtre condition

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


  //filtre ordre

if("sort" in req.query){
  var sort = req.query["sort"].split(",");
  query += " ORDER BY";

  for(var index in sort){
    var direction = sort[index].substr(0,1);
    var field = sort[index].substr(1);

    query += " " + field;

    if (direction == "-")
    query += " DESC,";
    else
    query += " ASC,";
    }
    query = query.slice(0, -1);
  }

//filtre champs

if("fields" in req.query) {
  query = query.replace("*", req.query["fields"]);
}

//filtre pagination

if("limit" in  req.query) {
  query += " LIMIT " + req.query["limit"];
  if("offset" in req.query) {
    query += " OFFSET " + req.query["offset"];
  }
}

db.query(query, function(err, result, fields) {
  if(err) throw err;
  res.send(JSON.stringify(result));
});

}

// ANIMALS

// Lire tous les animaux
app.get('/animals', function(req, res) {
  var query = "SELECT * FROM animals";
	var conditions = ["id","name","breed","food_per_day","birthday","entry_date","id_cage"];
  // appel de la fonction qui s'occupe des filtres
  filtres(req,res,conditions,query);

 });

//lire 1 animal
app.get('/animals/:id', function(req, res) {
  var id = req.params.id;
  var query = "SELECT * FROM animals where id = "+ id;
  var conditions = ["id","name","breed","food_per_day","birthday","entry_date","id_cage"];
  // appel de la fonction qui s'occupe des filtres
  filtres(req,res,conditions,query);

 });

//ajouter 1 animal
app.post('/animals', function(req, res) {
  var name = req.body.name;
  var breed = req.body.breed;
  var food_per_day = req.body.food_per_day;
  var birthday = req.body.birthday;
  var entry_date = req.body.entry_date;
  var id_cage = req.body.id_cage;
  var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) values ('"+name+"','"+breed+"','"+food_per_day+"','"+birthday+"','"+entry_date+"',"+id_cage+")";

  //execution de la requête
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Animal bien ajouté"));
	});

 });

//mise à jour d'un animal (d'un ou plusieurs de ces paramètres)
app.put('/animals/:id', function(req, res) {
  var id = req.params.id;
  var query = "UPDATE animals SET ";
  var champs = [];
  for(let i=0; i < Object.keys(req.body).length; i++){
    	champs[i]=(Object.keys(req.body)[i]+"="+"'"+Object.values(req.body)[i]+"'");
    }
    query += champs.join();
    query += " WHERE id="+id;

//execution de la requête
	db.query(query, function(err, result, fields) {
		if(err) throw err;
    res.send(JSON.stringify("Mise à jour réussie"));
	});

 });


//Supprimer 1 animal
app.delete('/animals/:id', function(req, res) {
  var id = req.params.id;
  var query = "DELETE FROM animals where id =" + id;

  //execution de la requête
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Animal supprimé"));
	});

 });


//Supprimer tous les animaux
app.delete('/animals', function(req, res) {
  var query = "DELETE FROM animals";

//execution de la requête
	db.query(query, function(err, result, fields) {
		if(err) throw err;
    res.send(JSON.stringify("Tous les animaux ont été supprimés"));
	});

 });


//Relation entre animals et cages
app.get('/animals/:id/cages', function(req, res) {
  var id = req.params.id;
  var query = "SELECT cages.id, cages.name FROM animals INNER JOIN cages ON animals.id_cage=cages.id WHERE animals.id ="+id;
  var conditions = ["animals.id","animals.name","breed","food_per_day","birthday","entry_date","id_cage","cages.id","cages.name","description","area"];
  filtres(req,res,conditions,query);
 });

app.get('/animals/:id_animal/cages/:id_cage', function(req, res) {
  var id_cage = req.params.id_cage;
  var id_animal = req.params.id_animal;
  var query = "SELECT cages.id, cages.name FROM animals INNER JOIN cages ON animals.id_cage=cages.id WHERE animals.id ="+id_animal+" AND cages.id="+id_cage;
  var conditions = ["animals.id","animals.name","breed","food_per_day","birthday","entry_date","id_cage","cages.id","cages.name","description","area"];
  filtres(req,res,conditions,query);
 });


//Relation entre animals et food
app.get('/animals/:id/food', function(req, res) {
  var id = req.params.id;
  var query = "SELECT food.id, food.name FROM animals INNER JOIN food ON animals.id=food.id_animal WHERE animals.id = "+id;
  var conditions = ["animals.id","animals.name","breed","food_per_day","birthday","entry_date","id_cage","food.id","food.name","quantity","id_animal"];
  filtres(req,res,conditions,query);
  });

app.get('/animals/:id_animal/food/:id_food', function(req, res) {
  var id_food = req.params.id_food;
  var id_animal = req.params.id_animal;
  var query = "SELECT food.id, food.name FROM animals INNER JOIN food ON animals.id=food.id_animal WHERE animals.id="+id_animal+" AND food.id="+id_food;
  var conditions = ["animals.id","animals.name","breed","food_per_day","birthday","entry_date","id_cage","food.id","food.name","quantity","id_animal"];
  filtres(req,res,conditions,query);
  });

// CAGES

// Lire toutes les CAGES
app.get('/cages', function(req, res) {
  var query = "SELECT * FROM cages";
	var conditions = ["id","name","description","area"];
  filtres(req,res,conditions,query);
 });

//lire 1 cage
app.get('/cages/:id', function(req, res) {
  var id = req.params.id;
  var query = "SELECT * FROM cages where id = "+ id;
  var conditions = ["id","name","description","area"];
  filtres(req,res,conditions,query);
 });

//ajouter 1 cage
app.post('/cages', function(req, res) {
  var name = req.body.name;
  var description = req.body.description;
  var area = req.body.area;
  var query = "INSERT INTO cages (name,description,area) values ('"+name+"','"+description+"','"+area+"')";

//execution de la requête
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Cage bien ajouté"));
	});

 });

//mise à jour d'une cage (d'un ou plusieurs de ces paramètres)
app.put('/cages/:id', function(req, res) {
  var id = req.params.id;
  var query = "UPDATE cages SET ";
  var champs = [];

  for(let i=0; i < Object.keys(req.body).length; i++){
    	champs[i]=(Object.keys(req.body)[i]+"="+"'"+Object.values(req.body)[i]+"'");
    }

    query += champs.join();
    query += " WHERE id="+id;

//execution de la requête
	db.query(query, function(err, result, fields) {
		if(err) throw err;
    res.send(JSON.stringify("Mise à jour réussie"));
	});

 });


//Supprimer 1 cage
app.delete('/cages/:id', function(req, res) {
  var id = req.params.id;
  var query = "DELETE FROM cages where id =" + id;
  //execution de la requête
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Cage supprimée"));
	});

 });


//Supprimer toutes les cages
app.delete('/cages', function(req, res) {
  var query = "DELETE FROM cages";

  //execution de la requête
	db.query(query, function(err, result, fields) {
		if(err) throw err;
    res.send(JSON.stringify("Toutes les cages ont été supprimées"));
	});

 });

 //Relation entre cages et animals
 app.get('/cages/:id/animals', function(req, res) {
  var id = req.params.id;
  var query = "SELECT animals.id,animals.name FROM cages INNER JOIN animals ON cages.id=animals.id_cage WHERE cages.id ="+id;
  var conditions = ["cages.id","cages.name","description","area","animals.id","animals.name","breed","food_per_day","birthday","entry_date","id_cage"];
  filtres(req,res,conditions,query);
 });

app.get('/cages/:id_cage/animals/:id_animal', function(req, res) {
  var id_cage = req.params.id_cage;
  var id_animal = req.params.id_animal;
  var query = "SELECT animals.id,animals.name FROM cages INNER JOIN animals ON cages.id=animals.id_cage WHERE cages.id ="+id_cage+" AND animals.id="+id_animal;
  var conditions = ["cages.id","cages.name","description","area","animals.id","animals.name","breed","food_per_day","birthday","entry_date","id_cage"];
  filtres(req,res,conditions,query);
 });


// FOOD

// Lire tous les food
app.get('/food', function(req, res) {
  var query = "SELECT * FROM food";
 	var conditions = ["id","name","quantity","id_animal"];
  filtres(req,res,conditions,query);
  });

 //lire 1 food
 app.get('/food/:id', function(req, res) {
  var id = req.params.id;
  var query = "SELECT * FROM food where id = "+ id;
  var conditions = ["id","name","quantity","id_animal"];
  filtres(req,res,conditions,query);
  });

//ajouter 1 food
app.post('/food', function(req, res) {
  var name = req.body.name;
  var quantity = req.body.quantity;
  var id_animal = req.body.id_animal;
  var query = "INSERT INTO food (name,quantity,id_animal) values ('"+name+"','"+quantity+"','"+id_animal+"')";

 //execution de la requête
 	db.query(query, function(err, result, fields) {
 		if(err) throw err;
 		res.send(JSON.stringify("Food bien ajouté"));
 	});

});

 //mise à jour d'un food (d'un ou plusieurs de ces paramètres)
 app.put('/food/:id', function(req, res) {
   var id = req.params.id;
   var query = "UPDATE food SET ";
   var champs = [];

     for(let i=0; i < Object.keys(req.body).length; i++){
     	champs[i]=(Object.keys(req.body)[i]+"="+"'"+Object.values(req.body)[i]+"'");
     }

     query += champs.join();
     query += " WHERE id="+id;

 //execution de la requête
  db.query(query, function(err, result, fields) {
 	if(err) throw err;
     res.send(JSON.stringify("Mise à jour réussie"));
 	});

  });


//Supprimer 1 food
app.delete('/food/:id', function(req, res) {
  var id = req.params.id;
  var query = "DELETE FROM food where id =" + id;

  //execution de la requête
 	db.query(query, function(err, result, fields) {
 		if(err) throw err;
 		res.send(JSON.stringify("Food supprimé"));
 	});

});


//Supprimer tous les food
app.delete('/food', function(req, res) {
  var query = "DELETE FROM food";

 //execution de la requête
 	db.query(query, function(err, result, fields) {
 		if(err) throw err;
     res.send(JSON.stringify("Touts les food ont été supprimés"));
 	});

});

//Relation entre food et animals
app.get('/food/:id/animals', function(req, res) {
  var id = req.params.id;
  var query = "SELECT animals.id, animals.name FROM food INNER JOIN animals ON food.id_animal=animals.id WHERE food.id = "+id;
  var conditions = ["food.id","food.name","quantity","id_animal","animals.id","animals.name","breed","food_per_day","birthday","entry_date","id_cage"];
  filtres(req,res,conditions,query);
 });

app.get('/food/:id_food/animals/:id_animal', function(req, res) {
  var id_food = req.params.id_food;
  var id_animal = req.params.id_animal;
  var query = "SELECT animals.id, animals.name FROM food INNER JOIN animals ON food.id_animal=animals.id WHERE food.id = "+id_food+" AND animals.id="+id_animal;
  var conditions = ["food.id","food.name","quantity","id_animal","animals.id","animals.name","breed","food_per_day","birthday","entry_date","id_cage"];
  filtres(req,res,conditions,query);
 });

 //food-stats
 app.get('/food-stats', function(req, res) {
  // le coalesce permet de renvoyer la valeur 0 et non nulle
  var query = "SELECT animals.id, coalesce((food.quantity/animals.food_per_day),0) days_left FROM food JOIN animals ON animals.id=food.id_animal";

  //execution de la requête
 	db.query(query, function(err, result, fields) {
 		if(err) throw err;
 		res.send(JSON.stringify(result));
 	});

});

// STAFF

// Lire tous les staff
app.get('/staff', function(req, res) {
  var query = "SELECT * FROM staff";
  var conditions = ["id","firstname","lastname","wage"];
  filtres(req,res,conditions,query);
});

//lire 1 staff
app.get('/staff/:id', function(req, res) {
  var id = req.params.id;
  var query = "SELECT * FROM staff where id = "+ id;
  var conditions = ["id","firstname","lastname","wage"];
  filtres(req,res,conditions,query);
});

//ajouter 1 staff
app.post('/staff', function(req, res) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var wage = req.body.wage;
  var query = "INSERT INTO staff (firstname,lastname,wage) values ('"+firstname+"','"+lastname+"','"+wage+"')";

  //execution de la requête
  db.query(query, function(err, result, fields) {
    if(err) throw err;
    res.send(JSON.stringify("Staff bien ajouté"));
  });

});

//mise à jour d'un staff (d'un ou plusieurs de ces paramètres)
app.put('/staff/:id', function(req, res) {
  var id = req.params.id;
  var query = "UPDATE staff SET ";
  var champs = [];

  for(let i=0; i < Object.keys(req.body).length; i++){
    champs[i]=(Object.keys(req.body)[i]+"="+"'"+Object.values(req.body)[i]+"'");
  }

  query += champs.join();
  query += " WHERE id="+id;

  //execution de la requête
  db.query(query, function(err, result, fields) {
    if(err) throw err;
    res.send(JSON.stringify("Mise à jour réussie"));
  });

});


//Supprimer 1 satff
app.delete('/staff/:id', function(req, res) {
  var id = req.params.id;
  var query = "DELETE FROM staff where id =" + id;
  //execution de la requête
  db.query(query, function(err, result, fields) {
    if(err) throw err;
    res.send(JSON.stringify("Staff supprimé"));
  });

});


//Supprimer tous les staff
app.delete('/staff', function(req, res) {
  var query = "DELETE FROM staff";

  //execution de la requête
  db.query(query, function(err, result, fields) {
    if(err) throw err;
    res.send(JSON.stringify("Touts les staff ont été supprimés"));
  });

});

//fonction d'écoute
app.listen(3000, function() {
  db.connect(function(err) {
    if(err) throw err;
    console.log('connexion réussie');
  });

  console.log('app listening port 3000');
});
