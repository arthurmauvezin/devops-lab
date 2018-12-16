//**************SERVICE WEB PERMETTANT LA GESTION D'UN ZOO (Matthieu Colin de Verdière SI2)*********
//PS: Comme demandé, pour la route /food-stats (ligne 358), j'ai effectué le calcul de days_left 
//en Javasript, mais j'ai laissé en commentaire la requête SQL qui calculait directement le quotient.
//**************************************************************************************************

//On ajoute les différentes librairies (frameworks)
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const
app.use(bodyParser.urlencoded({extended:true}));

const mhost = process.environment.MYQL_HOST;
const mport = process.environment.MYQL_PORT;
const mdatabase = process.environment.MYQL_DATABASE;
const muser = process.environment.MYQL_LOGIN;
const mpassword = process.environment.MYQL_PASSORD;

//Paramètres de connexion à la base de données
var db = mysql.createConnection({
	host: mhost,
	user: muser,
	password: mpassword,
	database: mdatabase,
	port: mport
})

//********************************CREATION D'UN PARE-FEU****************************
app.use(function(req, res, next)
{
	if ("key" in req.query) 
	{         
		var key = req.query["key"];         
		var query = "SELECT * FROM users WHERE apikey='" + key + "'"; 
        db.query(query, function(err, result, fields)
        {             
	    	if (err) throw err; 
	        if (result.length > 0){next();}             
			else {res.status(403).send("Access denied: incorrect token");} //CHANGER L'ERREUR      
   		});     
    } 
    else {res.status(403).send("Access denied: incorrect token");}
});
//********************************FILTRES******************************************
//Filtre pour les requêtes de lecture (SELECT)
function filtresLecture(req, res, query, conditions)
{
	//Filtre de condition
	for (var index in conditions) 
	{         
		if (conditions[index] in req.query)
		{            
			if (query.indexOf("WHERE") < 0) {query += " WHERE";} 
			else{query += " AND";} 
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
				if (direction == "-"){query += " DESC,";}            
				else query += " ASC,";         
			} 
		query = query.slice(0, -1);     
	} 

	//Filtre des champs
 	if("fields" in req.query) 
	{
		query = query.replace("*", req.query["fields"]);
	}

  	//Filtre par pagination

	if ("limit" in req.query) 
	{
	query += " LIMIT " + req.query["limit"]; 
	if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];        
		}     
	}
    //Envoi du résultat de la requête au client
    db.query(query, function(err, result, fields){
    	if(err) throw err;
    	res.send(JSON.stringify(result));
    });
}
//Filtre pour les requêtes de mise à jour (UPDATE)
function filtresUpdate(req, res, query, elemUpdate, id)
{
	//Filtre des champs à update
 	for (var index in elemUpdate) 
	{         
		if (elemUpdate[index] in req.body)
		{          
			if (query.indexOf("SET") < 0) {query += " SET";} 
			else{query += ",";} 
			query += " " + elemUpdate[index] + "='" + req.body[elemUpdate[index]] + "'";
		}      
	} 
	query+=" WHERE id="+id;
	  //Envoi du résultat de la requête au client
    db.query(query, function(err, result, fields){
    	if(err) throw err;
    	res.send(JSON.stringify(result));
    });
}


//Création d'un CRUD pour les différentes tables de la base de données.

//********************************ANIMALS******************************************
//CREATE
app.post('/animals', function(req, res){
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;

	var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('" + name +"','"+breed+"','"+food_per_day+"','"+birthday+"', '"+entry_date+"','"+id_cage+"')";
	db.query(query, function(err, result, fields){
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//READ
app.get('/animals', function(req, res) { //Fonction permettant de lire les objets avec des filtres
    var query = "SELECT * FROM animals";
    //Filtre par condition
    var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"]; 
	//On appelle la méthode permettant d'ajouter tous les filtres dans la requête SQL.
	filtresLecture(req, res, query, conditions);
});
app.get('/animals/:id', function(req, res) { //Une fonction de callback est appelée lorsque qqn demande cette route.
    	var id = req.params.id;
    	var query = "SELECT * FROM animals WHERE id= "+id;
		if("fields" in req.query) 
		{
			query = query.replace("*", req.query["fields"]);
		}
        db.query(query, function(err, result, fields){
    	if(err) throw err;
    	res.send(JSON.stringify(result));
    });
});

//MISE EN PLACE DE LA RELATION ENTRE animals ET id_cages
//Accès aux objets id_cages d'un objet animals grâce à une requête de jointure.
app.get('/animals/:id/cages', function(req, res) { //Une fonction de callback est appelée lorsque qqn demande cette route.
		var id = req.params.id;
    	var query = "SELECT cages.* FROM animals inner join cages on animals.id_cage=cages.id WHERE animals.id= "+id;
    	//var query = "SELECT * FROM animals inner join cages on animals.id_cage=cages.id WHERE animals.id="+id;
        var conditions = ["id","name","description","area"]; 
        filtresLecture(req, res, query, conditions);
});

app.get('/animals/:id_animal/cages/:id_cage', function(req, res) { //Une fonction de callback est appelée lorsque qqn demande cette route.
		var id_animal = req.params.id_animal;
		var id_cage = req.params.id_cage;
        var query = "SELECT cages.* FROM animals inner join cages on animals.id_cage=cages.id WHERE animals.id="+id_animal+" AND cages.id="+id_cage;
        var conditions = ["id","name","description","area"]; 
        filtresLecture(req, res, query, conditions);
});

//MISE EN PLACE DE LA RELATION ENTRE animals et food.
app.get('/animals/:id/food', function(req, res) { //Une fonction de callback est appelée lorsque qqn demande cette route.
		var id = req.params.id;
        var query = "SELECT food.* FROM food inner join animals on animals.id=food.id_animal WHERE animals.id="+id;
        var conditions = ["id","name","id_animal","quantity"]; 
        filtresLecture(req, res, query, conditions);
});

app.get('/animals/:id_animal/food/:id_food', function(req, res) { //Une fonction de callback est appelée lorsque qqn demande cette route.
		var id_animal = req.params.id_animal;
		var id_food = req.params.id_food;
        //var query = "SELECT food.id, food.name, food.quantity, food.id_animal FROM food inner join animals on animals.id=food.id_animal WHERE animals.id= "+id;
        var query = "SELECT food.* FROM food inner join animals on animals.id=food.id_animal WHERE animals.id="+id_animal+" AND food.id="+id_food;
        var conditions = ["id","name","id_animal","quantity"];  
        filtresLecture(req, res, query, conditions);
});


//PUT
app.put('/animals/:id(\\d+)', function(req, res){
	var id = req.params.id;
	var query = "UPDATE animals";
	var elemUpdate = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"]; 
	filtresUpdate(req, res, query, elemUpdate, id);
});


//DELETE
app.delete('/animals', function(req, res){
	var query = "DELETE FROM animals";
	db.query(query, function(err, result, fields){
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/animals/:id(\\d+)', function(req, res){
	var id = req.params.id;
	var query = "DELETE FROM animals WHERE id="+id;
	db.query(query, function(err, result, fields){
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//********************************CAGES******************************************
//CREATE
app.post('/cages', function(req, res){
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;

	var query = "INSERT INTO cages (name, description, area) VALUES ('"+name+"','"+description+"','"+area+"')";
	db.query(query, function(err, result, fields){
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//READ
app.get('/cages', function(req, res) //Fonction permettant de lire les objets avec des filtres
{
    var query = "SELECT * FROM cages";  
	var conditions = ["id", "name","description","area"];  
	filtresLecture(req, res, query, conditions);
});

app.get('/cages/:id', function(req, res) { //Une fonction de callback est appelée lorsque qqn demande cette route.
    	var id = req.params.id;
    	var query = "SELECT * FROM cages WHERE id= "+id;
		var conditions = ["id", "name","description","area"];
		filtresLecture(req, res, query, conditions);  
});


//MISE EN PLACE DE LA RELATION ENTRE cages et animals
app.get('/cages/:id/animals', function(req, res) { //Une fonction de callback est appelée lorsque qqn demande cette route.
		var id = req.params.id;
		var query = "SELECT animals.* FROM cages inner join animals on animals.id_cage=cages.id WHERE cages.id="+id;
        var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"]; 
        filtresLecture(req, res, query, conditions);
});

app.get('/cages/:id_cage/animals/:id_animal', function(req, res) { //Une fonction de callback est appelée lorsque qqn demande cette route.
	var id_cage = req.params.id_cage;
	var id_animal = req.params.id_animal;
	var query = "SELECT animals.* FROM cages inner join animals on animals.id_cage=cages.id WHERE cages.id="+id+" AND animals.id="+id_animal;
	var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"]; 
	filtresLecture(req, res, query, conditions);
});

//PUT
app.put('/cages/:id(\\d+)', function(req, res){
	var id = req.params.id;
	var query = "UPDATE cages";
	var elemUpdate = ["id", "name","description","area"]; 
	filtresUpdate(req, res, query, elemUpdate, id);
});

//DELETE
app.delete('/cages', function(req, res){
	var query = "DELETE FROM cages";
	db.query(query, function(err, result, fields){
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/cages/:id(\\d+)', function(req, res){
	var id = req.params.id;
	var query = "DELETE FROM cages WHERE id= "+id;
	db.query(query, function(err, result, fields){
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//********************************NOURRITURE******************************************
//CREATE
app.post('/food', function(req, res){
	var name = req.body.name;
	var id_animal = req.body.id_animal;
	var quantity = req.body.quantity;
	var query = "INSERT INTO food (name, id_animal, quantity) VALUES ('"+name+"','"+id_animal+"','"+quantity+"')";
	db.query(query, function(err, result, fields){
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//READ
app.get('/food', function(req, res) //Fonction permettant de lire les objets avec des filtres
{
    var query = "SELECT * FROM food";  
	var conditions = ["id","name","quantity","id_animal"];  
	filtresLecture(req, res, query, conditions);
});

app.get('/food/:id', function(req, res) { //Une fonction de callback est appelée lorsque qqn demande cette route.
    	var id = req.params.id;
    	var query = "SELECT * FROM food WHERE id= "+id;
        var conditions = ["id","name","quantity","id_animal"];  
	    filtresLecture(req, res, query, conditions);
});


//MISE EN PLACE DE LA RELATION ENTRE NOURRITURE ET animals
app.get('/food/:id/animals', function(req, res) { //Une fonction de callback est appelée lorsque qqn demande cette route.
		var id = req.params.id;
        var query = "SELECT animals.* FROM food inner join animals on food.id_animal=animals.id WHERE food.id="+id;
        var conditions = ["id","name","breed","food_per_day","birthday","entry_date","id_cage"]; 
        filtresLecture(req, res, query, conditions);
});

app.get('/food/:id_food/animals/:id_animal', function(req, res) { //Une fonction de callback est appelée lorsque qqn demande cette route.
		var id_food = req.params.id_food;
		var id_animal = req.params.id_animal;
        var query = "SELECT animals.* FROM food inner join animals on food.id_animal=animals.id WHERE food.id="+id_food+" AND animals.id="+id_animal;
        var conditions = ["id","name","breed","food_per_day","birthday","entry_date","id_cage"]; 
        filtresLecture(req, res, query, conditions);
});

//PUT
app.put('/food/:id(\\d+)', function(req, res){
	var id = req.params.id;
	var query = "UPDATE food";
	var elemUpdate = ["id", "name","quantity", "id_animal"]; 
	filtresUpdate(req, res, query, elemUpdate, id);
});

//DELETE

app.delete('/food', function(req, res){
	var query = "DELETE FROM food";
	db.query(query, function(err, result, fields){
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/food/:id(\\d+)', function(req, res){
	var id = req.params.id;
	var query = "DELETE FROM food WHERE id= "+id;
	db.query(query, function(err, result, fields){
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//Route en lecture affichant le temps restant avant l'épuisement du stock de nourriture pour chaque animals.
app.get('/food-stats', function(req, res) 
{
 	//***************PREMIERE ALTERNATIVE: CALCUL DU QUOTIENT DIRECTEMENT DANS LA REQUETE SQL (CODE EN COMMENTAIRE CI-DESSOUS)
 	//db.query("SELECT animals.id AS id, COALESCE(food.quantity/animals.food_per_day,0) AS days_left FROM animals, food GROUP BY animals.id", function(err, result, fields)
 	//***************
 	//***************DEUXIEME ALTERNATIVE: CALCUL DU QUOTIENT EN JAVASCRIPT (CODE UTILISE)
 	db.query("SELECT animals.id AS id, COALESCE(food.quantity,0) AS quantity,  COALESCE(animals.food_per_day,0) AS food_per_day FROM animals, food GROUP BY animals.id", function(err, result, fields)
 	{
 		//Affichage du resultat final
 		for(i=0; i< result.length; i++)
 		{
 			//On effectue le quotient uniquement si l'attribut food_per_day est non null.
 			if(result[i].food_per_day!=0)
 			{
 				result[i].days_left=result[i].quantity/result[i].food_per_day; //On stocke le quotient dans un nouvel attribut du tableau que l'on nomme days_left.
 			}
 			//Si l'attribut food_per_day est null, l'attribut days_left prend la valeur 0.
 			else{result[i].days_left=0;}
 		}
 		if(err) throw err;
 		//res.send(JSON.stringify(result));
 		res.send(JSON.stringify(result,['id','days_left']));
 	});
});

//********************************STAFF******************************************
//CREATE
app.post('/staff', function(req, res){
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('"+firstname+"','"+lastname+"','"+wage+"')";
	db.query(query, function(err, result, fields){
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//READ 
app.get('/staff', function(req, res) //Fonction permettant de lire les objets avec des filtres
{
    var query = "SELECT * FROM staff";  
	var conditions = ["id", "firstname","lastname","wage"];
	//On appelle la méthode permettant d'ajouter tous les filtres dans la requête SQL.
	filtresLecture(req, res, query, conditions);
});

app.get('/staff/:id', function(req, res) { //Une fonction de callback est appelée lorsque qqn demande cette route.
	var id = req.params.id;
	var query = "SELECT * FROM staff WHERE id= "+id;
	if("fields" in req.query) 
	{
		query = query.replace("*", req.query["fields"]);
	}
	db.query(query, function(err, result, fields){
		if(err) throw err;
		res.send(JSON.stringify(result));
	});
});

//PUT
app.put('/staff/:id(\\d+)', function(req, res){
	var id = req.params.id;
	var query = "UPDATE staff";
	var elemUpdate = ["id", "firstname","lastname", "wage"]; 
	filtresUpdate(req, res, query, elemUpdate, id);
});

//DELETE

app.delete('/staff', function(req, res){
	var query = "DELETE FROM staff";
	db.query(query, function(err, result, fields){
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/staff/:id(\\d+)', function(req, res){
	var id = req.params.id;
	var query = "DELETE FROM staff WHERE id= "+id;
	db.query(query, function(err, result, fields){
		if(err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//L'application web écoute sur le port 3000.
app.listen(3000, function(){
	console.log('Example app listening on port 3000!');
});
