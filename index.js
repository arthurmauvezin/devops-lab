const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
var db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "zoo"
});


//-----------------------------------PARE-FEU---------------------------------------------------
app.use(function(req, res, next)
{
	if ("key" in req.query)
	{
		//Variables
		var key = req.query["key"];
		var query = "SELECT * FROM users WHERE apikey='" + key + "'";

		db.query(query, function(err, result, fields)
		{
			if (err) throw err;
			if (result.length > 0)
			{
				next();
			}
			else
			{
				res.sendStatus(403);
			}
		});
	}

	else
	{
		res.sendStatus(403);
	}

});
//----------------------------------------------------------------------------------------------

//------------------------------------ ANIMAL --------------------------------------------------
// Animals POST : Creation
app.post('/animals', function(req, res)
{
	//Variables
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;
	var query = "INSERT INTO animals ( name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" +name+ "','" +breed+ "'," +food_per_day+ ",'"  +birthday+ "','"  +entry_date+ "'," +id_cage+ ")";

	db.query(query, function(err, result, fields)
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


//Animal GET : Lecture (Général) AVEC FILTRES
app.get('/animals', function(req, res)
{
	//Variables
	var query = "SELECT * FROM animals";
	var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

	for (var index in conditions)
	{
		//Filtre par condition
		if (conditions[index] in req.query) {
			if
			(
				query.indexOf("WHERE") < 0) {
				query += " WHERE";
			}
			else
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	//Filtre d'ordre
	if ("sort" in req.query)
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";

		for (var index in sort)
		{
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

	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//Filtre de pagination
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
//------------

//Animal GET : Lecture (Spécifique) AVEC FILTRES
app.get('/animals/:id(\\d+)', function(req, res)
{
	//Variables
	var id = req.params.id;
	var query = "SELECT * FROM ANIMALS WHERE id=" + id;

	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	db.query(query, function(err, result, fields) {
		if (err) throw err;

		res.send(JSON.stringify(result));
	});
});


//Animal PUT : Update
app.put('/animals/:id(\\d+)', function(req, res)
{
	//Variables
	var a_id = req.params.id;
	var a_nom = req.body.name;
	var a_race = req.body.breed;
	var a_food = req.body.food_per_day;
	var a_dateBirth = req.body.birthday;
	var a_dateEntreeZoo = req.body.entry_date;
	var Cage = req.body.id_cage;
	var vide=0;
	var query= "UPDATE Animals SET"

	//Test pour name
	if(a_nom != null)
	{
		query=query+ " name = '" +a_nom+ "' "
		vide=vide+1;
	}

	//Test pour race
	if(a_race != null)
	{
		if(vide != 0) //C'est à dire s'il y a deja quelque chose d'inséré
		{
			//Je mets une virgule
			query=query+","
			query=query+ "breed = '" +a_race+ "' "
		}

		else //Rien d'inséré donc pas de virgule
		{
				query=query+ " breed = '" +a_race+ "' "
				vide=vide+1;
		}
	}

	//Test pour food_per_day
	if(a_food != null)
	{
		if(vide != 0) //C'est à dire s'il y a deja quelque chose d'inséré
	  {
			//Je met une virgule
			query=query+","
			query=query+ "food_per_day = '" +a_food+ "' "
		}

		else //Rien d'inséré donc pas de virgule
		{
				query=query+ " food_per_day = '" +a_food+ "' "
				vide=vide+1;
		}
	}

	//Test pour birthday
	if(a_dateBirth != null)
	{
		if(vide != 0) //C'est à dire s'il y a deja qqchose d'inséré
	 	{
			//Je met une virgule
		 	query=query+","
		 	query=query+ "birthday = '" +a_dateBirth+ "' "
	 	}

		else //Rien d'inséré donc pas de virgule
		{
			query=query+ " birthday = '" +a_dateBirth+ "' "
			vide=vide+1;
		}
	}

	//Test pour entry_date
	if(a_dateEntreeZoo != null)
	{
		if(vide != 0) //C'est à dire s'il y a deja qqchose d'inséré
		{
			//Je met une virgule
			query=query+","
			query=query+ "entry_date = '" +a_dateEntreeZoo+ "' "
		}

		else //Rien d'inséré donc pas de virgule
		{
			query=query+ " entry_date = '" +a_dateEntreeZoo+ "' "
			vide=vide+1;
		}
	}

	//Test pour id_cage
	if(Cage != null)
	{
		if(vide != 0) //C'est à dire s'il y a deja qqchose d'inséré
		{
			//Je met une virgule
			query=query+","
			query=query+ "id_cage = '" +Cage+ "' "
		}

		else //Rien d'inséré donc pas de virgule
		{
				query=query+ " id_cage = '" +Cage+ "' "
				vide=vide+1;
		}
	}

	query=query+"WHERE id = "+ a_id


	db.query(query, function(err, result, fields)
	{
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


//Animal DELETE : Delete (Général)
app.delete('/animals', function(req, res)
{
	var query = "DELETE FROM ANIMALS";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


//Animal DELETE : Delete (Spécifique)
app.delete('/animals/:id(\\d+)', function(req, res)
{
	var a_id = req.params.id;
  var query= "DELETE FROM animals WHERE id =" + a_id ;

	db.query(query, function(err,result,fields){
		if(err) throw err;
		var reponse = {"result" : result};
		res.send(JSON.stringify("Success"));
	});
});



//RELATIONS POUR ANIMAUX

//En spécifiant l'ID de l'animal, on peut récupérer toutes les informations sur sa cage // READ ALL
app.get('/animals/:id(\\d+)/cages', function(req, res)
{
	var a_id = req.params.id;
	var query ="SELECT cages.* FROM animals JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + a_id;

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//Filtre de pagination
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}

	var conditions = ["name", "description", "area"];

	for (var index in conditions)
	{
		//Filtre par condition
		if (conditions[index] in req.query) {
			if
			(
				query.indexOf("WHERE") < 0) {
				query += " WHERE";
			}
			else
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}


	db.query(query, function(err, result, fields){
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});


//En spécifiant l'ID de l'animal, on peut récupérer toutes les informations sur sa cage (donc on spécifie aussi l'ID) // READ ONE
app.get('/animals/:id(\\d+)/cages/:id_cage(\\d+)', function(req, res)
{
	var a_id = req.params.id;
	var a_idC=req.params.id_cage;
	var query ="SELECT cages.* FROM animals JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + a_id + " AND cages.id="+a_idC;

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	db.query(query, function(err, result, fields){
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});


//En spécifiant l'ID de l'animal, on peut récupérer toutes les informations sur sa nourriture
app.get('/animals/:id(\\d+)/food', function(req, res)
{
	var a_id = req.params.id;
	var query ="SELECT food.* FROM animals JOIN food ON animals.id= food.id_animal WHERE animals.id=" + a_id;

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//Filtre de pagination
	if ("limit" in req.query)
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query)
		{
			query += " OFFSET " + req.query["offset"];
		}
	}

	var conditions = ["name", "quantity", "id_animal"];

	for (var index in conditions)
	{
		//Filtre par condition
		if (conditions[index] in req.query)
		{
			if(query.indexOf("WHERE") < 0)
			{
				query += " WHERE";
			}
			else
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}


	db.query(query, function(err, result, fields){
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

});
//------------------------------------------------------------------------------------------

//------------------------------------ CAGE --------------------------------------------------
// Cage POST : Creation
app.post('/cages', function(req, res)
{
	//Variables
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	var query = "INSERT INTO cages (name,description,area) VALUES ('" +name+ "','" +description+ "'," +area+")";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


//Cage GET : Lecture (Général) AVEC FILTRES
app.get('/cages', function(req, res)
{
	//Variables
	var query = "SELECT * FROM cages";
	var conditions = ["id", "name", "description", "area"];

	for (var index in conditions)
	{
		//Filtre par condition
		if (conditions[index] in req.query)
		{
			if(query.indexOf("WHERE") < 0)
			{
				query += " WHERE";
			}

			else
			{
				query += " AND";
			}

			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

  //Filtre d'ordre
	if ("sort" in req.query)
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";

		for (var index in sort)
		{
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

	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//Filtre de pagination
	if ("limit" in req.query)
	{
 		query += " LIMIT " + req.query["limit"];
 		if ("offset" in req.query)
		{
 			query += " OFFSET " + req.query["offset"];
 		}
	}

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


//Cage GET : Lecture (Spécifique) AVEC FILTRES
app.get('/cages/:id(\\d+)', function(req, res)
{
	var id = req.params.id;
	var query = "SELECT * FROM cages WHERE id=" + id;
	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


//Cage PUT : Update
app.put('/cages/:id(\\d+)', function(req, res)
{
	//Variables
	var id = req.params.id;
	var nom = req.body.name;
	var description = req.body.description;
	var taille = req.body.area;
	var vide2=0;
	var query= "UPDATE Cages SET"

	//Test pour name
	if(nom != null)
	{
		query=query+ " name = '" +nom+ "' "
	  vide2=vide2+1;
	}

	//Test pour description
	if(description != null)
	{
		if(vide2 != 0) //C'est à dire s'il y a deja qqchose d'inséré
		{
			//Je met une virgule
			query=query+",";
			query=query+ "description = '" +description+ "' ";
		}

		else //Rien d'inséré donc pas de virgule
		{
			query=query+ " description = '" +description+ "' ";
			vide2=vide2+1;
		}
	}

	//Test pour area
	if(taille != null)
	{
		if(vide2 != 0) //C'est à dire s'il y a deja qqchose d'inséré
		{
			//Je met une virgule
			query=query+",";
			query=query+ "area = '" +taille+ "' ";
		}

		else //Rien d'inséré donc pas de virgule
		{
			query=query+ " area = '" +taille+ "' ";
			vide2=vide2+1;
		}
	}

	query=query+"WHERE id = "+ id;


	db.query(query, function(err, result, fields) {
		if (err) throw err;
  	var response = {"page": "home", "result": result};
  	res.send(JSON.stringify("Sucess"));
	});
});


//Cage DELETE : Delete (Général)
app.delete('/cages', function(req, res)
{
	var query = "DELETE FROM cages";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


//Cage DELETE : Delete (Spécifique)
app.delete('/cages/:id(\\d+)', function(req, res)
{
	var id = req.params.id;
  var query= "DELETE FROM cages WHERE id =" + id ;

	db.query(query, function(err,result,fields){
		if(err) throw err;
		var reponse = {"result" : result};
		res.send(JSON.stringify("Sucess"));
	});
});


//RELATIONS POUR CAGES
//En spécifiant l'ID de la cage, on peut récupérer toutes les informations sur l'animal
app.get('/cages/:id(\\d+)/animals', function(req, res)
{
	var c_id = req.params.id;
	var query ="SELECT animals.* FROM cages JOIN animals ON animals.id_cage = cages.id WHERE cages.id=" + c_id;

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//Filtre de pagination
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}

	var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

	for (var index in conditions)
	{
		//Filtre par condition
		if (conditions[index] in req.query)
		{
			if(query.indexOf("WHERE") < 0)
			{
				query += " WHERE";
			}
			else
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}


	db.query(query, function(err, result, fields){
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});


//------------------------------------------------------------------------------------------------

//-------------------- NOURRITURE -----------------------------------------------------------------


// Nourriture POST : Creation
app.post('/food', function(req, res)
{
	var name = req.body.name;
	var quantity = req.body.quantity;
	var id_animal = req.body.id_animal;
	var query = "INSERT INTO food(name,quantity,id_animal) VALUES ('" +name+ "'," +quantity+ "," +id_animal+")";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


//Nourriture GET : Lecture (Général) AVEC FILTRES
app.get('/food', function(req, res)
{
	var query = "SELECT * FROM food";
	var conditions = ["id", "name", "quantity", "id_animal"];

	for (var index in conditions)
	{
		//Filtre par condition
		if (conditions[index] in req.query)
		{
			if
			(
				query.indexOf("WHERE") < 0) {
				query += " WHERE";
			}
			else
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

  //Filtre d'ordre
	if ("sort" in req.query)
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";

		for (var index in sort)
		{
			var direction = sort[index].substr(0, 1);
			var field = sort[index].substr(1);
			query += " " + field;

			if(direction == "-")
				query += " DESC,";
			else
				query += " ASC,";
		}

		query = query.slice(0, -1);
	}

	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//Filtre de pagination
	if ("limit" in req.query)
	{
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query)
		{
			query += " OFFSET " + req.query["offset"];
		}
	}

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


//Nourriture GET : Lecture (Spécifique) AVEC FILTRES
app.get('/food/:id(\\d+)', function(req, res)
{
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id=" + id;

	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//Nourriture PUT : Update
app.put('/food/:id(\\d+)', function(req, res)
{
	//Variables
	var id = req.params.id;
	var nom = req.body.name;
	var qte = req.body.quantity;
	var animal = req.body.id_animal;
 	var vide3=0;
	var query= "UPDATE food SET"

	//Test pour name
	if(nom != null)
	{
		query=query+ " name = '" +nom+ "' "
		vide3=vide3+1;
	}
	//Test pour quantity
	if(qte != null)
	{
		if(vide3 != 0) //C'est à dire s'il y a deja qqchose d'inséré
		{
			//Je met une virgule
			query=query+","
			query=query+ "quantity = '" +qte+ "' "
		}
		else //Rien d'inséré donc pas de virgule
		{
			query=query+ " quantity = '" +qte+ "' "
			vide3=vide3+1;
		}
	}

	//Test pour food_per_day
	if(animal != null)
	{
		if(vide3 != 0) //C'est à dire s'il y a deja qqchose d'inséré
		{
			//Je met une virgule
			query=query+","
			query=query+ "id_animal = '" +animal+ "' "
		}
		else //Rien d'inséré donc pas de virgule
		{
				query=query+ " id_animal = '" +animal+ "' "
				vide3=vide3+1;
		}
	}

	query=query+"WHERE id = "+ id

	db.query(query, function(err, result, fields) {
		if (err) throw err;
  	var response = {"page": "home", "result": result};
		res.send(JSON.stringify("Success"));
	});
});


//Nourriture DELETE : Delete (Général)
app.delete('/food', function(req, res)
{
	var query = "DELETE FROM food";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//Nourriture DELETE : Delete (Spécifique)
app.delete('/food/:id(\\d+)', function(req, res)
{
	var id = req.params.id;
  var query= "DELETE FROM food WHERE id =" + id ;

	db.query(query, function(err,result,fields){
		if(err) throw err;
		var reponse = {"result" : result};
		res.send(JSON.stringify("Success"));
	});
});

//STATISTIQUES
//Nourriture GET : Statistiques
app.get('/food-stats', function(req, res)
{
	var query = "SELECT animals.id, COALESCE(quantity/food_per_day,0) AS days_left FROM animals, food GROUP BY animals.id";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});


//RELATIONS POUR NOURRITURE
//En spécifiant l'ID de la nourriture, on peut récupérer toutes les informations sur l'animal //READ ALL
app.get('/food/:id(\\d+)/animals', function(req, res)
{
	var id = req.params.id;
	var query ="SELECT animals.* FROM animals JOIN food ON  animals.id = food.id_animal  WHERE food.id=" + id;

	//Filtre de champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//Filtre de pagination
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}

	var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

	for (var index in conditions)
	{
		//Filtre par condition
		if (conditions[index] in req.query)
		{
			if
			(
				query.indexOf("WHERE") < 0) {
				query += " WHERE";
			}
			else
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

	db.query(query, function(err, result, fields){
		if(err) throw err;

		res.send(JSON.stringify(result));
	});

});

//En spécifiant l'ID de la nourriture, on peut récupérer toutes les informations sur l'animal (dont on spécifie également l'ID) //READ ONE
app.get('/food/:id(\\d+)/animals/:id_animal(\\d+)', function(req, res)
{
	var id = req.params.id;
	var id2 = req.params.id_animal;
	var query ="SELECT animals.* FROM animals JOIN food ON  animals.id = food.id_animal  WHERE food.id=" + id + " AND animals.id="+id2;

	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

		db.query(query, function(err, result, fields){
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

});


//------------------------------------------------------------------------------------------------

//------------------------------------------ PERSONNEL --------------------------------------------


// Personnel POST : Creation
app.post('/staff', function(req, res)
{
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var query = "INSERT INTO staff(firstname,lastname,wage) VALUES ('" +firstname+ "','" +lastname+ "'," +wage+")";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


//Personnel GET : Lecture (Général) AVEC FILTRES
app.get('/staff', function(req, res)
{
	var query = "SELECT * FROM staff";
	var conditions = ["id", "firstname", "lastname", "wage"];

	for (var index in conditions)
	{
		//Filtre par condition
		if (conditions[index] in req.query)
		{
			if
			(
				query.indexOf("WHERE") < 0) {
				query += " WHERE";
			}
			else
			{
				query += " AND";
			}
			query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

  //Filtre d'ordre
	if ("sort" in req.query)
	{
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";

		for (var index in sort)
		{
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

	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	//Filtre de pagination
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


//Personnel GET : Lecture (Spécifique) AVEC FILTRES
app.get('/staff/:id(\\d+)', function(req, res)
{
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id=" + id;

	//Filtre des champs
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//Personnel PUT : Update
app.put('/staff/:id(\\d+)', function(req, res)
{
	var id = req.params.id;
	var prenom = req.body.firstname;
	var nom = req.body.lastname;
	var salaire = req.body.wage;
	var vide4=0;
	var query= "UPDATE staff SET"

	//Test pour firstname
	if(prenom != null)
	{
		query=query+ " firstname = '" +prenom+ "' "
		vide4=vide4+1;
	}

	//Test pour lastname
	if(nom != null)
	{
		if(vide4 != 0) //C'est à dire s'il y a deja qqchose d'inséré
		{
			//Je met une virgule
			query=query+","
			query=query+ "lastname = '" +nom+ "' "
		}
		else //Rien d'inséré donc pas de virgule
		{
			query=query+ " lastname = '" +nom+ "' "
			vide4=vide4+1;
		}
	}

	//Test pour wage
	if(salaire != null)
	{
		if(vide4 != 0) //C'est à dire s'il y a deja qqchose d'inséré
		{
			//Je met une virgule
			query=query+","
			query=query+ "wage = '" +salaire+ "' "
		}
		else //Rien d'inséré donc pas de virgule
		{
			query=query+ " wage = '" +salaire+ "' "
			vide4=vide4+1;
		}
	}

	query=query+"WHERE id = "+ id

	db.query(query, function(err, result, fields) {
		if (err) throw err;
   	res.send(JSON.stringify("Success"));
  	var response = {"page": "home", "result": result};
	});
});


//Personnel DELETE : Delete (Général)
app.delete('/staff', function(req, res)
{
	var query = "DELETE FROM staff";

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//Personnel DELETE : Delete (Spécifique)
app.delete('/staff/:id(\\d+)', function(req, res)
{
	var id = req.params.id;
  var query= "DELETE FROM staff WHERE id =" + id ;

	db.query(query, function(err,result,fields){
		if(err) throw err;
		var reponse = {"result" : result};
		res.send(reponse);
	});
});


//--------------------------------------------------------------------------------------------------


app.listen(3000, function()
{
	db.connect(function(err)
	{
		if (err) throw err;
		console.log('Connection to database successful!');
	});
	
	console.log('Example app listening on port 3000!');
});
