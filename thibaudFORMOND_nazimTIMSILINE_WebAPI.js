const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true })); // librairie bodyParser

// /d+ blinde pour avoir un id avec au moins un chiffre 

//////////////////////////////////////////////////////////////app listen



app.listen(3000, function() {
	db.connect(function(err) {
		if (err) throw err;
		console.log('Connection to database successful!');
	});
	console.log('Example app listening on port 3000!');
});

//Création de la database 
var db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "zoo2",
	port: "3306"
});


/////////////////////////////////////////////////////////app use 

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

 				res.send("Access denied");
 			}
 		});
 	} else {

 		res.send("Access denied");
 	}
 })

//////////////////////////////////////////////////////Animals

//Route create (pas besoin de parametres)
app.post('/animals', function(req, res) {
	var nom = req.body.name;
	var race = req.body.breed;
	var nourriture_par_jour = req.body.food_per_day;
	var date_de_naissance = req.body.birthday;
	var date_d_entree_zoo = req.body.entry_date;
	var cage = req.body.id_cage;
	var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" + nom + "','" + race + "','" + nourriture_par_jour + "','" + date_de_naissance + "','" + date_d_entree_zoo + "','" + cage +"')";
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Successfully created"));
	});
});

//Route read avec parametres
app.get('/animals/:id(\\d+)', function(req, res) {
	
	var id = req.params.id;
	var query = "SELECT * FROM animals WHERE id="+ id;// INNER JOIN cages ON animals.id_cage=cages.id ;
	
	///FILTRE PAR CONDITION
	var conditions =["name","breed","food_per_day","birthday","entry_date","id_cage"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}

	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});

//Route read avec parametres
app.get('/animals', function(req, res) {
	
	var query = "SELECT * FROM animals";
	
	///FILTRE PAR CONDITION
	var conditions =["name","breed","food_per_day","birthday","entry_date","id_cage"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});

//Route relation animal cage
app.get('/animals/:id/cages',function(req,res){
	var id=req.params.id;
	var query="SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage=cages.id WHERE animals.id='"+id+"'";
	
	///FILTRE PAR CONDITION
	var conditions =["name","breed","food_per_day","birthday","entry_date","id_cage","description","area" ];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err,result, fields){
		if(err) throw err;
		res.send(JSON.stringify(result));
	});
});
/*
app.get('/animals/cages',function(req,res){
	var query="SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage=cages.id"
	
	///FILTRE PAR CONDITION
	var conditions =["name","breed","food_per_day","birthday","entry_date","id_cage"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	console.log(query);
	
	
	db.query(query, function(err,result, fields){
		if(err) throw err;
		res.send(JSON.stringify(result));
	});
});*/

app.get('/animals/:id/cages/:id2',function(req,res){
	var id=req.params.id;
	var id2=req.params.id2;
	var query="SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage=cages.id WHERE animals.id='"+id+"' AND cages.id='"+id2+"'";
	
	///FILTRE PAR CONDITION
	var conditions =["name","breed","food_per_day","birthday","entry_date","id_cage","description","area"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err,result, fields){
		if(err) throw err;
		res.send(JSON.stringify(result));
	});
});


//Route relation animal food
app.get('/animals/:id/food',function(req,res){
	var id=req.params.id;
	var query="SELECT food.* FROM animals INNER JOIN food ON animals.id=food.id_animal WHERE animals.id='"+id+"'";
	
	///FILTRE PAR CONDITION
	var conditions =["name","breed","food_per_day","birthday","entry_date","id_cage","quantity","id_animal"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err,result, fields){
		if(err) throw err;
		res.send(JSON.stringify(result));
	});
});

//Relation animal food
app.get('/animals/:id/food/:id2',function(req,res){
	var id=req.params.id;
	var id2=req.params.id2;
	var query="SELECT food.* FROM animals INNER JOIN food ON animals.id=food.id_animal WHERE animals.id='"+id+"' AND food.id='"+id2+"'";
	
	///FILTRE PAR CONDITION
	var conditions =["name","breed","food_per_day","birthday","entry_date","id_cage","quantity","id_animal"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err,result, fields){
		if(err) throw err;
		res.send(JSON.stringify(result));
	});
});

/*
app.get('/animals/:id/food/:id2',function(req,res){
	var query="SELECT * FROM animals INNER JOIN food ON animals.id=food.id_animal WHERE animals.id="+id+" AND food.id="+id2;
	
	///FILTRE PAR CONDITION
	var conditions =["name","breed","food_per_day","birthday","entry_date","id_cage"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err,result, fields){
		if(err) throw err;
		res.send(JSON.stringify(result));
	});
});
*/

//Route update 
/*
app.put('/animals/:id', function(req, res) {
	
	var id = req.params.id;
	var nom = req.body.name;
	var race = req.body.breed;
	var nourriture_par_jour = req.body.food_per_day;
	var date_de_naissance = req.body.birthday;
	var date_d_entree_zoo = req.body.entry_date;
	var cage = req.body.id_cage;
	
	var query = "UPDATE animals SET name = '" + nom + "', breed='" + race + "', food_per_day='" + nourriture_par_jour + "', birthday='" + date_de_naissance + "', entry_date='" + date_d_entree_zoo + "', id_cage='" + cage + "' WHERE id="+ id; 
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});
*/
app.put('/animals/:id(\\d+)', function(req, res) {
	
	var id = req.params.id;
	var nom = req.body.name;
	var race = req.body.breed;
	var nourriture_par_jour = req.body.food_per_day;
	var date_de_naissance = req.body.birthday;
	var date_d_entree_zoo = req.body.entry_date;
	var cage = req.body.id_cage;

	var conditions =["name","breed","food_per_day","birthday","entry_date","id_cage"];

	var query="UPDATE animals SET ";

	var body =req.body;
	var compteur=0;

	for(var index in conditions){
		if(conditions[index] in req.body){

			
			query+= conditions[index] + "='"+req.body[conditions[index]]+"'";

			if(Object.keys(req.body).length-1!=compteur)
			{	
				compteur++;
				query+=",";
			}
		}
	}
	query+=" WHERE id="+ id;

	console.log(Object.keys(req.body).length-1);
	console.log(compteur);

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});

//Route delete (parametres facultatifs) NON 
app.delete('/animals', function(req, res) {
	
	var query = "DELETE FROM animals";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});
//Route delete (parametres facultatifs) OUI
app.delete('/animals/:id(\\d+)', function(req, res) {
	
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});
///////////////////////////////////////////////////cage


//Route create (pas besoin de parametres)
app.post('/cages', function(req, res) {
	var nom = req.body.name;
	var description =req.body.description;
	var taille_m2 =req.body.area;
	var query = "INSERT INTO cages (name,description,area) VALUES ('" + nom + "','" + description + "','" + taille_m2 + "')";
	//res.send(JSON.stringify("Create"));
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Successfully created"));
	});
});
//Route read sans parametres
app.get('/cages', function(req, res) {
	
	var query = "SELECT * FROM cages"
	
	///FILTRE PAR CONDITION
	var conditions =["name","description","area"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
//Route read avec parametres
app.get('/cages/:id(\\d+)', function(req, res) {
	
	var cage_id=req.params.id;
	var query = "SELECT * FROM cages WHERE id="+ cage_id + "";
	
	///FILTRE PAR CONDITION
	var conditions =["name","description","area"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});

/*
app.get('cages/animals', function(req,res) {
	
	var query="SELECT animals.* FROM cages INNER JOIN animals on cages.id=animals.id_cage";
	
	///FILTRE PAR CONDITION
	var conditions =["name","description","area"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});*/

//Route relation cage in animal
app.get('/cages/:id/animals', function(req,res) {
	var id=req.params.id;
	
	var query="SELECT animals.* FROM cages INNER JOIN animals ON cages.id=animals.id_cage WHERE cages.id='"+id+"'";
	
	///FILTRE PAR CONDITION
	var conditions =["name","description","area","breed","food_per_day","birthday","entry_date","id_cage"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});
	

app.get('/cages/:id/animals/:id2', function(req,res) {
	var id=req.params.id;
	var id2=req.params.id2;
	var query="SELECT animals.* FROM cages INNER JOIN animals ON cages.id=animals.id_cage WHERE cages.id='"+id+"'"+" AND animals.id='"+id2+"'";
	
	///FILTRE PAR CONDITION
	var conditions =["name","description","area","breed","food_per_day","birthday","entry_date","id_cage"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});
	



//Route update 
app.put('/cages/:id(\\d+)', function(req, res) {
	
	var cage_id = req.params.id;
	
	//var query = "UPDATE cages SET name = '" + nom + "', description='" + description + "', area='" + taille_m2 + "' WHERE id=" + cage_id;

	var conditions=["name","description","area"];

	var query="UPDATE cages SET ";

	var body =req.body;
	var compteur=0;

	for(var index in conditions){
		if(conditions[index] in req.body){

			
			query+= conditions[index] + "='"+req.body[conditions[index]]+"'";


			if(Object.keys(req.body).length-1!=compteur)
			{	
				compteur++;
				query+=",";
			}
		}
	}
	query+=" WHERE id="+ cage_id;

	console.log(Object.keys(req.body).length-1);
	console.log(compteur);
	console.log(query);



	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});
//Route delete (parametres facultatifs) NON 
app.delete('/cages', function(req, res) {
	
	var query = "DELETE FROM cages";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});
//Route delete (parametres facultatifs) OUI
app.delete('/cages/:id(\\d+)', function(req, res) {
	
	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//////////////////////////////////////////////////////////////// nourriture 








//Route create (pas besoin de parametres)
app.post('/food', function(req, res) {
	
	var nom = req.body.name;
	var animal = req.body.id_animal;
	var quantite_kg = req.body.quantity;
	var query = "INSERT INTO food (name,id_animal,quantity) VALUES ('" + nom + "','" + animal + "','"+ quantite_kg + "')";
	//res.send(JSON.stringify("Create"));
	console.log(query);
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Successfully created"));
	});
});
//Route read sans parametres
app.get('/food', function(req, res) {
	
	var query = "SELECT * FROM food"
	
	///FILTRE PAR CONDITION
	var conditions =["name","quantity","id_animal"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//Route read avec parametres
app.get('/food/:id(\\d+)', function(req, res) {
	
	var id = req.params.id;
	var query = "SELECT * FROM food WHERE id="+id;
	
	///FILTRE PAR CONDITION
	var conditions =["name","id_animal","quantity"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});

//Route relation food animal
app.get('/food/:id_animal/animals', function(req, res) {
	
	var id_animal=req.params.id_animal;
	var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal=animals.id WHERE food.id='"+id_animal+"'";
	
	///FILTRE PAR CONDITION
	var conditions =["name","quantity","id_animal","breed","food_per_day","birthday","entry_date","id_cage"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.get('/food/:id/animals/:id2', function(req, res) {
	
	var id=req.params.id;
	var id2=req.params.id2;
	var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal=animals.id WHERE food.id='"+id+"'"+" AND animals.id='"+id2+"'";
	
	///FILTRE PAR CONDITION
	var conditions =["name","quantity","id_animal","breed","food_per_day","birthday","entry_date","id_cage"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});



//Route update 
app.put('/food/:id(\\d+)', function(req, res) {
	var id = req.params.id;
	
	//var query = "UPDATE food SET name = '" + nom + "', id_animal='" + animal + "', quantity='" + quantite_kg + "' WHERE id="+ id;
var conditions=["name","quantity","id_animal"];

	var query="UPDATE food SET ";

	var body =req.body;
	var compteur=0;

	for(var index in conditions){
		if(conditions[index] in req.body){

			
			query+= conditions[index] + "='"+req.body[conditions[index]]+"'";


			if(Object.keys(req.body).length-1!=compteur)
			{	
				compteur++;
				query+=",";
			}
		}
	}
	query+=" WHERE id="+ id;

	console.log(Object.keys(req.body).length-1);
	console.log(compteur);
	console.log(query);

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});
//Route delete (parametres facultatifs) NON 
app.delete('/food', function(req, res) {
	
	var query = "DELETE FROM food";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});
//Route delete (parametres facultatifs) OUI
app.delete('/food/:id(\\d+)', function(req, res) {
	
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});









/////////////////////////////////////////////////////////// personnel




//Route create (pas besoin de parametres)
app.post('/staff', function(req, res) {
	var nom = req.body.lastname;
	var prenom = req.body.firstname;
	var salaire = req.body.wage;
	var query = "INSERT INTO staff (lastname,firstname,wage) VALUES ('" + nom + "','" + prenom + "','"+ salaire + "')";
	//res.send(JSON.stringify("Create"));
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Successfully created"));
	});
});
//Route read sans parametres
app.get('/staff', function(req, res) {
	
	var query = "SELECT * FROM staff"
	
	///FILTRE PAR CONDITION
	var conditions =["firstname","lastname","wage"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
//Route read avec parametres
app.get('/staff/:id(\\d+)', function(req, res) {
	
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id="+id;
	
	///FILTRE PAR CONDITION 
	var conditions =["firstname","lastname","wage"];
	
	for(var index in conditions){
		if(conditions[index] in req.query){
			if(query.indexOf("WHERE")<0)
			{	
				query+=" WHERE";
			}
			else
			{
				query+=" AND";
			}
			query+=" " +conditions[index] + "='"+req.query[conditions[index]]+"'";
		}
	}
	
	///FILTRE D'ORDRE 
	
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

	
	///FILTRE PAR PAGINATION
	if ("limit" in req.query) {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	///FILTRE DES CHAMPS 
	if ("fields" in req.query) {
		query = query.replace("*", req.query["fields"]);
	}
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});

});
//Route update 
app.put('/staff/:id(\\d+)', function(req, res) {
	var id = req.params.id;
	
	//var query = "UPDATE staff SET lastname = '" + nom + "', firstname='" + prenom + "', wage='" + salaire + "' WHERE id="+ id;

	var conditions =["lastname","firstname","wage"];

	var query="UPDATE staff SET ";

	var body =req.body;
	var compteur=0;

	for(var index in conditions){
		if(conditions[index] in req.body){

			
			query+= conditions[index] + "='"+req.body[conditions[index]]+"'";

			if(Object.keys(req.body).length-1!=compteur)
			{	
				compteur++;
				query+=",";
			}
		}
	}
	console.log(Object.keys(req.body).length-1);
	console.log(compteur);

	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});
//Route delete (parametres facultatifs) NON 
app.delete('/staff', function(req, res) {
	
	var query = "DELETE FROM staff";
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});
//Route delete (parametres facultatifs) OUI
app.delete('/staff/:id(\\d+)', function(req, res) {
	
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id=" + id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
/////////////////////////////////food-stats
/*
//Route read avec parametres
app.get('/food-stats/:id(\\d+)', function(req, res) {
	
	var id = req.params.id;
	var query = "SELECT quantity FROM food WHERE id_animal="+id;
	var query2 = "SELECT food_per_day FROM animals WHERE id="+id;
	
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		
		db.query(query2, function(err, result2, fields) {
			if (err) throw err;
			res.send(JSON.stringify(result/result2));
		});
	});

	
});*/

app.get('/food-stats/', function(req, res) {
	
	var query = "SELECT id_animal, quantity FROM food ORDER BY id_animal ASC";
	var query2 = "SELECT id, food_per_day FROM animals ORDER BY id ASC";
	//var query3 = "SELECT Quantite_kg, Nourriture_par_jour FROM nourriture INNER JOIN animal ON animal.ID=nourriture.Animal";
	//res.send(JSON.stringify("Read"));
	
	var table_quan = new Array();
	var table_nour = new Array();
	var table_final = new Array();
	
	table_final[0]=new Array();
	table_final[1]=new Array();
	///table_quan
	db.query(query, function(err, rows) {
		if (err) throw err;
		
		for (var i = 0; i < rows.length ; i++)
		{
			table_quan[i]=rows[i].quantity;
		}
			///table_nour
			db.query(query2, function(err, rows) {
				if (err) throw err;

			//////// division 
			
			for (var i = 0; i < rows.length ; i++)
			{	
				
				table_nour[i]=rows[i].food_per_day;
				table_final[0][i]=rows[i].id;
				if(table_nour[i]!=0)
				{
					table_final[1][i]=table_quan[i]/table_nour[i];
				}	
				else
				{
					table_final[1][i]=null;

						//animal est mort 
						var id = req.params.id;
						var query = "DELETE FROM animals WHERE id=" + i;
						db.query(query, function(err, result, fields) {
							if (err) throw err;
							res.send(JSON.stringify("Success"));
						});

					
				}

			}
			
			console.log(table_quan);
			console.log(table_nour);
			console.log(table_final);
			
			
			res.send(JSON.stringify(table_final));
		});
		});
});

//Users\ntims\Desktop\ing 4 2018-2019\Web\Microservices backend\Projet\WebService_AutoCorrectionSoftware\windows>