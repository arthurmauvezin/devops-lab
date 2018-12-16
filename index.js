const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');

var db = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database: "project",
port: "3306"
});

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
res.send("ERROR", 403);
}
});
} else {
res.send("ERROR", 403);
}
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/animals', function(req, res) {
var query = "SELECT * FROM animals";
var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
    
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
    
});

app.get('/animals/:id', function(req, res) {
    var id = req.params.id;
var query = "SELECT * FROM animals WHERE id="+id;
var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
    
    
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
    
});



app.put('/animals/:id', function(req,res) {
     var nom = req.body.name;
    var race = req.body.breed;
    var repas_par_jour = req.body.food_per_day;
    var anniversaire = req.body.birthday;
    var date_entree = req.body.entry_date;
    var id_cage = req.body.id_cage;
    var id = req.params.id;
    
    
    var query = "UPDATE animals SET ";
    
    if(nom!== undefined) query+=" name='"+nom+"',";
    if(race!== undefined) query+=" breed='"+race+"',";
    if(repas_par_jour!== undefined) query+=" food_per_day='"+repas_par_jour+"',";
    if(anniversaire!== undefined) query+=" birthday='"+anniversaire+"',";
    if(date_entree!== undefined) query+=" entry_date='"+date_entree+"',";
    if(id_cage!== undefined) query+=" id_cage='"+id_cage+"',";
    
    query=query.slice(0,-1);
    
    query+= " WHERE id=" + id;
    db.query(query, function(err, result, fields) {

res.send(JSON.stringify("Success"));
});
});


app.post('/animals', function(req, res) {
    
    var nom = req.body.name;
    var race = req.body.breed;
    var repas_par_jour = req.body.food_per_day;
    var anniversaire = req.body.birthday;
    var date_entree = req.body.entry_date;
    var id_cage = req.body.id_cage;
    var query = "INSERT INTO animals(name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ( '" + nom + "', '" + race + "', '" + repas_par_jour + "', '" + anniversaire + "', '" + date_entree + "', '" + id_cage + "')";
    
    
    db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});

app.delete('/animals', function(req, res) {
var query = "DELETE animals.* FROM animals";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});


app.delete('/animals/:id', function(req, res) {
var id = req.params.id;
var query = "DELETE animals.* FROM animals WHERE id=" + id;
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});


app.get('/cages', function(req, res) {
var query = "SELECT * FROM cages";
var conditions = ["id", "name", "description","area"];
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
});


app.get('/cages/:id', function(req, res) {
    var id = req.params.id;
var query = "SELECT * FROM cages WHERE id="+id;
var conditions = ["id", "name", "description","area"];
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
});





app.put('/cages/:id', function(req,res) {
    
    var id = req.params.id;
    var nom = req.body.name;
    var description = req.body.description;
    var zone = req.body.area;
    var query = "UPDATE cages SET ";
    
    if(nom!== undefined) query+=" name='"+nom+"',";
    if(description!== undefined) query+=" description='"+description+"',";
    if(zone!== undefined) query+=" area='"+zone+"',";
    query=query.slice(0,-1);
    query+= " WHERE id=" + id;
    
    
    
    
    db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});


app.post('/cages', function(req, res) {
    var nom = req.body.name;
    var description = req.body.description;
    var zone = req.body.area;
    var query = "INSERT INTO cages(name, description, area) VALUES ('" + nom + "', '" + description + "', '" + zone + "')";
    
    db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});


app.delete('/cages', function(req, res) {
var query = "DELETE cages.* FROM cages";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});



app.delete('/cages/:id', function(req, res) {
var id = req.params.id;
var query = "DELETE cages.* FROM cages WHERE id=" + id;
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});


app.get('/food', function(req, res) {
var query = "SELECT * FROM food";
var conditions = ["id", "name","id_animal", "quantity"];
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
});


app.get('/food/:id', function(req, res) {
    var id = req.params.id;
var query = "SELECT * FROM food WHERE id="+id;
var conditions = ["id", "name","id_animal", "quantity"];
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
});




app.put('/food/:id', function(req,res) {
    
    var id = req.params.id;
    var nom = req.body.name;
    var id_animal = req.body.id_animal;
    var quantite = req.body.quantity;
    
    var query = "UPDATE food SET ";
    
    if(nom!== undefined) query+=" name='"+nom+"',";
    if(id_animal!== undefined) query+=" id_animal='"+id_animal+"',";
    if(quantite!== undefined) query+=" quantity='"+quantite+"',";
    query=query.slice(0,-1);
    query+= " WHERE id=" + id;
    
    db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});

app.post('/food', function(req, res) {
    
    var nom = req.body.name;
    var id_animal = req.body.id_animal;
    var quantite = req.body.quantity;
    var query = "INSERT INTO food(name, quantity, id_animal) VALUES ('" + nom + "', '" + quantite + "', '" + id_animal + "')";
    
    db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});



app.delete('/food', function(req, res) {
var query = "DELETE food.* FROM food";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});



app.delete('/food/:id', function(req, res) {
var id = req.params.id;
var query = "DELETE food.* FROM food WHERE id=" + id;
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});



 


app.get('/staff', function(req, res) {
var query = "SELECT * FROM staff";
var conditions = ["id", "firstname","lastname","wage"];
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
});





app.get('/staff/:id', function(req, res) {
    
var id = req.params.id;
var query = "SELECT * FROM staff WHERE id="+id;
var conditions = ["id", "firstname","lastname","wage"];
    
    
    
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
});




app.put('/staff/:id', function(req,res) {
    
    
    
    var id = req.params.id;
    var prenom = req.body.firstname;
    var nom_famille = req.body.lastname;
    var salaire = req.body.wage;
    var query = "UPDATE staff SET ";
    
    if(prenom!== undefined) query+=" firstname='"+prenom+"',";
    if(nom_famille!== undefined) query+=" lastname='"+nom_famille+"',";
    if(salaire!== undefined) query+=" wage='"+salaire+"',";
    query=query.slice(0,-1);
    query+= " WHERE id=" + id;
    
    db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});

app.post('/staff', function(req, res) {
    
    
    
    var prenom = req.body.firstname;
    var nom_famille = req.body.lastname;
    var salaire = req.body.wage;
    var query = "INSERT INTO staff(firstname, lastname, wage) VALUES ('" + prenom + "', '" + nom_famille + "', '" + salaire + "')";
    
    db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});


app.delete('/staff', function(req, res) {
var query = "DELETE staff.* FROM staff";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});


app.delete('/staff/:id', function(req, res) {
var id = req.params.id;
var query = "DELETE staff.* FROM staff WHERE id=" + id;
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});












app.get('/food/:id/animals', function(req, res) {
    
    
var id = req.params.id;
var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE food.id=" + id;
    
var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
for (var index in conditions) {
if (conditions[index] in req.query) {
if (query.indexOf("WHERE") < 0) {
query += " WHERE";
} else {
query += " AND";
}
query += " animals." + conditions[index] + "='" +
req.query[conditions[index]] + "'";
}
}
    

    
    if ("fields" in req.query) {
query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", req.query["fields"]);
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





app.get('/food/:id_food/animals/:id_animal', function(req, res) {
var id_nourriture = req.params.id_food;
var id_animal = req.params.id_animal;
var query = "SELECT animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE food.id=" + id_nourriture + " AND  animals.id=" +id_animal;
    
    
    var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
for (var index in conditions) {
if (conditions[index] in req.query) {
if (query.indexOf("WHERE") < 0) {
query += " WHERE";
} else {
query += " AND";
}
query += " animals." + conditions[index] + "='" +
req.query[conditions[index]] + "'";
}
}
    if ("fields" in req.query) {
query = query.replace("animals.id, animals.name, animals.breed, animals.food_per_day, animals.birthday, animals.entry_date, animals.id_cage", req.query["fields"]);
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


app.get('/animals/:id/food', function(req, res) {
var id = req.params.id;
var query = "SELECT food.id,food.name,food.quantity,food.id_animal FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE animals.id=" + id;
    
var conditions = ["id", "name","quantity","id_animal"];
for (var index in conditions) {
if (conditions[index] in req.query) {
if (query.indexOf("WHERE") < 0) {
query += " WHERE";
} else {
query += " AND";
}
query += " food." + conditions[index] + "='" +
req.query[conditions[index]] + "'";
}
}
    

    
    if ("fields" in req.query) {
query = query.replace("food.id,food.name,food.quantity,food.id_animal", req.query["fields"]);
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

app.get('/food/:id_food/animals/:id_animal', function(req, res) {
var id_nourriture = req.params.id_food;
var id_animal = req.params.id_animal;
var query = "SELECT food.id,food.name,food.quantity,food.id_animal FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE food.id=" + id_nourriture + " AND  animals.id=" +id_animal;
    
    
var conditions = ["id", "name","quantity","id_animal"];
for (var index in conditions) {
if (conditions[index] in req.query) {
if (query.indexOf("WHERE") < 0) {
query += " WHERE";
} else {
query += " AND";
}
query += " food." + conditions[index] + "='" +
req.query[conditions[index]] + "'";
}
}
    

    
    if ("fields" in req.query) {
query = query.replace("food.id,food.name,food.quantity,food.id_animal", req.query["fields"]);
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



app.get('/cages/:id/animals', function(req, res) {
var id = req.params.id;
    
var query = "SELECT animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date,animals.id_cage FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id=" + id;

var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
    
for (var index in conditions) {
if (conditions[index] in req.query) {
if (query.indexOf("WHERE") < 0) {
query += " WHERE";
} else {
query += " AND";
}
query += " animals." + conditions[index] + "='" +
req.query[conditions[index]] + "'";
}
}

    
    
        if ("fields" in req.query) {
query = query.replace("animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date,animals.id_cage", req.query["fields"]);
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

    
app.get('/cages/:id_cage/animals/:id_animal', function(req, res) {
    
var id_animal = req.params.id_animal;
var id_cage = req.params.id_cage;
    
var query = "SELECT animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date,animals.id_cage FROM animals FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animal + " AND cages.id=" + id_cage;
    
var conditions = ["id", "name","breed","food_per_day","birthday","entry_date","id_cage"];
for (var index in conditions) {
if (conditions[index] in req.query) {
if (query.indexOf("WHERE") < 0) {
query += " WHERE";
} else {
query += " AND";
}
query += " animals." + conditions[index] + "='" +
req.query[conditions[index]] + "'";
}
}

    
    
    if ("fields" in req.query) {
query = query.replace("animals.id,animals.name,animals.breed,animals.food_per_day,animals.birthday,animals.entry_date,animals.id_cage", req.query["fields"]);
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

    
    
app.get('/animals/:id/cages', function(req, res) {
    
    
var id = req.params.id;
    
var query = "SELECT cages.id,cages.name,cages.description,cages.area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;

var conditions = ["id", "name", "description","area"];
    
for (var index in conditions) {
if (conditions[index] in req.query) {
if (query.indexOf("WHERE") < 0) {
query += " WHERE";
} else {
query += " AND";
}
query += " cages." + conditions[index] + "='" +
req.query[conditions[index]] + "'";
}
}    
    

    
        if ("fields" in req.query) {
query = query.replace("cages.id,cages.name,cages.description,cages.area", req.query["fields"]);
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

app.get('/animals/:id_animal/cages/:id_cage', function(req, res) {
var id_animal = req.params.id_animal;
var id_cage = req.params.id_cage;
    
var query = "SELECT cages.id,cages.name,cages.description,cages.area FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animal + " AND cages.id=" + id_cage;
    
var conditions = ["id", "name", "description","area"];
for (var index in conditions) {
if (conditions[index] in req.query) {
if (query.indexOf("WHERE") < 0) {
query += " WHERE";
} else {
query += " AND";
}
query += " cages." + conditions[index] + "='" +
req.query[conditions[index]] + "'";
}
}
    
    
    
    

    
    
    if ("fields" in req.query) {
query = query.replace("cages.id,cages.name,cages.description,cages.area", req.query["fields"]);
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



app.get('/food-stats', function(req,res) {
    
    var query ="SELECT animals.id, CASE WHEN animals.food_per_day=0 THEN 0 ELSE food.quantity/animals.food_per_day END as days_left FROM food INNER JOIN animals ON food.id_animal=animals.id";
    
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