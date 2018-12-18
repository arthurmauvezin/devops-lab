const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: proces.nv.MYSQL_LOGIN,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	port: process.env.MYSQL_PORT
});



/***********************************
FIRWALL
************************************/

app.use(function(req, res, next) {

	if ("key" in req.query) 
	{

	var key = req.query["key"];
	var query = "SELECT * FROM users WHERE apikey='" + key + "'";

	db.query(query, function(err, result, fields) {

			if (err) throw err;
			if (result.length > 0) 
			{
				next();
			}

			else 
			{
				//res.send("Access denied, could not verify token value",403);
				res.status(403).send("Access denied, could not verify token value");
			}

		});
	} 

	else 
	{
		//res.send("Access denied could not verify token value",403);
		res.status(403).send("Access denied, could not verify token value");
	}

});



/***********************************
Fonction Filtres 
************************************/


function mesFiltres(req,res,query,conditions)
{
	for (var index in conditions) {

		if (conditions[index] in req.query) {

			if (query.indexOf("WHERE") < 0) {
				query += " WHERE";

			} else {
				query += " AND";
			}

			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}


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



	if ("fields" in req.query) {

		query = query.replace("*", req.query["fields"]);
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

}

function partialUpdate(req,res,query,conditions,id)
{

	for (var index in conditions) 
	{
		if (conditions[index] in req.body) 
		{
			if (query.indexOf( "SET" ) < 0 ) 
			{
				query+=" SET";
			} 

			else 
			{
				query+=",";
			}

			query+= " " + conditions[index] + "='" + req.body[conditions[index]] +"'";
		}
	}

	query+= " WHERE id="+id;

	console.log(query);
	db.query(query, function (err, result, fields) {
		if (err) throw err;
			res.send( JSON .stringify("Success"));
	});
}

/**********************************************************
ANIMALS
**********************************************************/
app.post('/animals', function(req, res) {

	//on définit les variables
	var nom = req.body.name;
	var race = req.body.breed;
	var nourriture = req.body.food_per_day;
	var dateN = req.body.birthday;
	var dateEZ = req.body.entry_date;
	var cage = req.body.id_cage;

	var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('"+nom+"', '" +race + "', '"+nourriture+"', '"+dateN+"', '"+dateEZ+"','"+cage+"')";

	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});


//get all animals with and without filters
app.get('/animals', function(req, res) {

	var query = "SELECT * FROM animals";
	var conditions = ["id","name","breed","food_per_day","birthday","entry_date","id_cage"];

	mesFiltres(req,res,query,conditions);

});


//get an animal using its id 
app.get('/animals/:id(\\d+)', function(req, res) {

	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id=" + id;

	//filters
	if ("fields" in req.query) 
	{ 
		// le paramètre * sera remplcé par les colonnes à afficher
		query = query.replace("*", req.query["fields"]); 
	}

	query += ";";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});


//update an animal (full update)
app.put('/animals/:id(\\d+)', function(req, res) {

	var id = req.params.id;

	//var query = "UPDATE animals SET (nom, race, nourriture, date_naissance, date_entree_zoo, cage) = '"+nom+"', '" +race + "', '"+nourriture+"', '"+dateN+"', '"+dateEZ+"','"+cage+"' WHERE id=" + id;
	var query = "UPDATE animals";
	var conditions = ["id","name","breed","food_per_day","birthday","entry_date","id_cage"];
	partialUpdate(req,res,query,conditions,id);

});


app.delete('/animals', function(req, res) {

	var query = "DELETE FROM animals";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});


app.delete('/animals/:id(\\d+)', function(req, res) {

	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id=" + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});



/**********************************************************
CAGE			
**********************************************************/

//create some cages 
app.post('/cages', function(req, res) {

	//on définit les variables
	var nom = req.body.name;
	var description= req.body.description;
	var taille= req.body.area;

	var query = "INSERT INTO cages (name, description, area) VALUES ('"+nom+"', '" +description+ "', '"+taille+"')";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});


//get all cages (with and without filters)
app.get('/cages', function(req, res) {

	var query = "SELECT * FROM cages";
	var conditions = ["id","name","description","area"];

	mesFiltres(req,res,query,conditions);

});

//get an cage using its id 
app.get('/cages/:id(\\d+)', function(req, res) {

	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;

	//filters
	if ("fields" in req.query) 
	{ 
		// le paramètre * sera remplcé par les colonnes à afficher
		query = query.replace("*", req.query["fields"]); 
	}

	query += ";";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});


//update a cages (full and partial update)
app.put('/cages/:id(\\d+)', function(req, res) {

	var id = req.params.id;

	//var query = "UPDATE animals SET (nom, race, nourriture, date_naissance, date_entree_zoo, cage) = '"+nom+"', '" +race + "', '"+nourriture+"', '"+dateN+"', '"+dateEZ+"','"+cage+"' WHERE id=" + id;
	var query = "UPDATE cages";
	var conditions = ["id","name","description","area"];
	partialUpdate(req,res,query,conditions,id);

});


app.delete('/cages', function(req, res) {

	var query = "DELETE FROM cages";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});


app.delete('/cages/:id(\\d+)', function(req, res) {

	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id=" + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});



/**********************************************************
NOURRITURE			
**********************************************************/

//create some food
app.post('/food', function(req, res) {

	//on définit les variables
	var nom = req.body.name;
	var animal = req.body.id_animal;
	var quantite = req.body.quantity;

	var query = "INSERT INTO food (name, quantity, id_animal) VALUES ('"+nom+"', '" +quantite+ "', '"+animal+"')";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});


//get all food (with and without filters)
app.get('/food', function(req, res) {

	var query = "SELECT * FROM food";
	var conditions = ["id","name","quantity","id_animal"];

	mesFiltres(req,res,query,conditions);

});



//get food using its id 
app.get('/food/:id(\\d+)', function(req, res) {

	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id=" + id;

	//filters
	if ("fields" in req.query) 
	{ 
		// le paramètre * sera remplcé par les colonnes à afficher
		query = query.replace("*", req.query["fields"]); 
	}

	query += ";";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});



//update food (full and partial update)
app.put('/food/:id(\\d+)', function(req, res) {

	var id = req.params.id;

	//var query = "UPDATE animals SET (nom, race, nourriture, date_naissance, date_entree_zoo, cage) = '"+nom+"', '" +race + "', '"+nourriture+"', '"+dateN+"', '"+dateEZ+"','"+cage+"' WHERE id=" + id;
	var query = "UPDATE food";
	var conditions = ["id","name","quantity","id_animal"];
	partialUpdate(req,res,query,conditions,id);

});



app.delete('/food', function(req, res) {

	var query = "DELETE FROM food";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});


app.delete('/food/:id(\\d+)', function(req, res) {

	var id = req.params.id;
	var query = "DELETE FROM food WHERE id=" + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});


/**********************************************************
PERSONNEL		
**********************************************************/

//create staff
app.post('/staff', function(req, res) {

	//on définit les variables
	var prenom = req.body.firstname;
	var nom = req.body.lastname;
	var salaire = req.body.wage;

	var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('"+prenom+"', '" +nom+ "', '"+salaire+"')";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});


//get all staff (with and without filters)
app.get('/staff', function(req, res) {

	var query = "SELECT * FROM staff";
	var conditions = ["id","firstname","lastname","wage"];

	mesFiltres(req,res,query,conditions);

});

//get staff using its id 
app.get('/staff/:id(\\d+)', function(req, res) {

	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id=" + id;

	//filters
	if ("fields" in req.query) 
	{ 
		// le paramètre * sera remplcé par les colonnes à afficher
		query = query.replace("*", req.query["fields"]); 
	}

	query += ";";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});


//update staff (full and partial update)
app.put('/staff/:id(\\d+)', function(req, res) {

	var id = req.params.id;

	//var query = "UPDATE animals SET (nom, race, nourriture, date_naissance, date_entree_zoo, cage) = '"+nom+"', '" +race + "', '"+nourriture+"', '"+dateN+"', '"+dateEZ+"','"+cage+"' WHERE id=" + id;
	var query = "UPDATE staff";
	var conditions = ["id","firstname","lastname","wage"];
	partialUpdate(req,res,query,conditions,id);

});



app.delete('/staff', function(req, res) {

	var query = "DELETE FROM staff";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});


app.delete('/staff/:id(\\d+)', function(req, res) {

	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id=" + id;

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});




/************************
on crée une route capable d'afficher toutes les informations de la cage si on entre l'id de l'animal
on crée une deuxième route capable d'afficher toutes les informations sur la nourriture si on entre l'id de l'animal
on crée une troisième route capable d'afficher toutes les infos de l'animal si on entre l'id de la cage 
on crée une quatrième route capable d'afficher toutes les infos sur l'animal avec l'id de la nourriture 
************************/



/************************
on crée une route capable d'afficher toutes les informations de la cage si on entre l'id de l'animal
************************/

app.get('/animals/:id/cages', function(req, res) {

	var id = req.params.id;
	var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;
	var conditions = ["id","name","description","area"];

	mesFiltres(req,res,query,conditions);

});


app.get('/animals/:id/cages/:id_data', function(req, res) {
	
	var id_user = req.params.id;
	var id_data = req.params.id_data;

	var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_user + " AND cages.id=" +id_data;
	var conditions = ["id","name","description","area"];

	mesFiltres(req,res,query,conditions);

});



/************************
on crée une deuxième route capable d'afficher toutes les informations sur la nourriture si on entre l'id de l'animal
************************/

app.get('/animals/:id/food', function(req, res) {

	var id = req.params.id;
	var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;

	var conditions = ["id","name","quantity","id_animal"];

	mesFiltres(req,res,query,conditions);

});

app.get('/animals/:id/food/:id_data', function(req, res) {
	
	var id_user = req.params.id;
	var id_data = req.params.id_data;

	var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id_user + " AND food.id=" +id_data;

	var conditions = ["id","name","quantity","id_animal"];

	mesFiltres(req,res,query,conditions);

});


/************************
on crée une troisième route capable d'afficher toutes les infos de l'animal si on entre l'id de la cage 
************************/

app.get('/cages/:id/animals', function(req, res) {

	var id = req.params.id;
	var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id;

	var conditions = ["id","name","breed","food_per_day", "birthday","entry_date","id_cage"];

	mesFiltres(req,res,query,conditions);

});

app.get('/cages/:id/animals/:id_data', function(req, res) {
	
	var id_user = req.params.id;
	var id_data = req.params.id_data;

	var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id_user + " AND animals.id=" +id_data;

	var conditions = ["id","name","breed","food_per_day", "birthday","entry_date","id_cage"];

	mesFiltres(req,res,query,conditions);

});


/************************
on crée une quatrième route capable d'afficher toutes les infos sur l'animal avec l'id de la nourriture 
************************/

app.get('/food/:id/animals', function(req, res) {

	var id = req.params.id;
	var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id=" + id;

	var conditions = ["id","name","breed","food_per_day", "birthday","entry_date","id_cage"];

	mesFiltres(req,res,query,conditions);

});

app.get('/food/:id/animals/:id_data', function(req, res) {
	
	var id_user = req.params.id;
	var id_data = req.params.id_data;

	var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id=" + id_user + " AND animals.id=" +id_data;

	var conditions = ["id","name","breed","food_per_day", "birthday","entry_date","id_cage"];

	mesFiltres(req,res,query,conditions);

});


/****************************************
FOOD PER DAY 
*******************************************/
app.get('/food-stats', function(req, res) {

	
	//var query = "SELECT animals.id as id, IFNULL(food.quantity/animals.food_per_day,0) as days_left FROM food INNER JOIN animals ON food.id_animal = animals.id";

	var query = "SELECT animals.id as id, COALESCE(food.quantity/animals.food_per_day,0) as days_left FROM food INNER JOIN animals ON food.id_animal = animals.id";
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});



app.listen(3000, function() {

	db.connect(function(err) {

		if (err) throw err;
			console.log('Connection to database successful!');
	});

	console.log('Example app listening on port 3000!');
});