const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser'); //TP2
const app = express();

app.use(bodyParser.urlencoded({ extended: true })); //TP2

var db = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database: "zoo",
port: "3306"
});
//_________________________________________________________
app.post('/animals', function(req, res) {
//var id = req.body.id;
var name = req.body.name;
var breed = req.body.breed;
var food_per_day = req.body.food_per_day;
var birthday = req.body.birthday;
var entry_date = req.body.entry_date;
var id_cage = req.body.id_cage;
var query = "INSERT INTO animals ( name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('" + name + "','" + breed + "'," + food_per_day + ",'" + birthday + "','" + entry_date + "'," + id_cage + ")";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success post animals"));
});
});

app.get('/animals', function(req, res) {
var query = "SELECT * FROM animals";
    //CONDITIONS
var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
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
 //ORDRE
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
    //CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
    //PAGINATION
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
var query = "SELECT * FROM animals WHERE id=" + id;
 //CONDITIONS
var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
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
 //ORDRE
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
    //CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
    //PAGINATION
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
var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;
/*var query = "SELECT * FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;*/
   //CONDITIONS
var conditions = ["name", "description", "area"];
for (var index in conditions) {
    if (conditions[index] in req.query) {
        query += " AND cages." + conditions[index] + "='" +
        req.query[conditions[index]] + "'";
        }
    }
 //ORDRE
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
    //CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
    //PAGINATION
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
    
app.get('/animals/:id_animals/cages/:id_cages', function(req, res) {
var id_animals = req.params.id_animals;
var id_cages = req.params.id_cages;
var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animals + " AND cages.id=" + id_cages ;
   //CONDITIONS
var conditions = ["name", "description", "area"];
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
 //ORDRE
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
    //CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
    //PAGINATION
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
var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id=food.id_animal WHERE animals.id=" + id;
///CONDITIONS
var conditions = ["name", "quantity", "id_animal"];
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
 ///ORDRE
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
    ///CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
    ///PAGINATION
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
/*
app.get('/animals/:id_animals/food/:id_food', function(req, res) {
var id_animals = req.params.id_animals;
var id_food = req.params.id_food;
var query = "SELECT * FROM animals INNER JOIN food ON animals.id=food.id_animal WHERE animals.id=" + id_animals + " AND food.id=" + id_food;
///CONDITIONS
var conditions = ["name", "quantity", "id_animal"];
for (var index in conditions) {
    if (conditions[index] in req.query) {
        
        query += " AND food." + conditions[index] + "='" +
        req.query[conditions[index]] + "'";
        }
    }
 ///ORDRE
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
    ///CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
    ///PAGINATION
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
*/
app.put('/animals/:id', function(req, res) {
var id = req.params.id;
var query = "UPDATE animals SET ";
if (req.body.name!=null)
{
    var name = req.body.name;
    query += " name = '" + name + "' ";
}
if (req.body.breed!=null)
{
    if (req.body.name!=null) {query += ", ";}
    var breed = req.body.breed;
    query += " breed = '" + breed + "' ";
}
if (req.body.birthday!=null)
{
    if ((req.body.name!=null)||(req.body.breed!=null)) {query += ", ";}
    var birthday = req.body.birthday;
    query += " birthday = '" + birthday + "' ";
}
if (req.body.food_per_day!=null)
{
    if ((req.body.name!=null)||(req.body.breed!=null)||(req.body.birthday!=null)) {query += ", ";}
    var food_per_day = req.body.food_per_day;
    query += " food_per_day = '" + food_per_day + "' ";
}
if (req.body.entry_date!=null)
{
    if ((req.body.name!=null)||(req.body.breed!=null)||(req.body.birthday!=null)||(req.body.food_per_day!=null)) {query += ", ";}
    var entry_date = req.body.entry_date;
    query += " entry_date = '" + entry_date + "' ";
}
if (req.body.id_cage!=null)
{
    if ((req.body.name!=null)||(req.body.breed!=null)||(req.body.birthday!=null)||(req.body.food_per_day!=null)||(req.body.entry_date!=null)) {query += ", ";}
    var id_cage = req.body.id_cage;
    query += " id_cage = " + id_cage ;
}
query += " WHERE id=" + id; 
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success update animals"));
});
});

app.delete('/animals', function(req, res) {
var query = "DELETE FROM animals";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success delete animals"));
});
});

app.delete('/animals/:id', function(req, res) {
var id = req.params.id;
var query = "DELETE FROM animals WHERE id=" + id;
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success delete animals with id"));
});
});
//___________________________________________________________
app.post('/cages', function(req, res) {
//var id = req.body.id;
var name = req.body.name;
var description = req.body.description;
var area = req.body.area;
var query = "INSERT INTO cages (name, description, area) VALUES ('" + name + "','" + description + "'," + area  + ")";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success cages"));
});
});

app.get('/cages', function(req, res) {
var query = "SELECT * FROM cages";
    //CONDITIONS
var conditions = ["name", "description", "area"];
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
 //ORDRE
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
    //CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
    //PAGINATION
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
var query = "SELECT * FROM cages WHERE id=" + id;
   //CONDITIONS
var conditions = ["name", "description", "area"];
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
 //ORDRE
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
    //CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
    //PAGINATION
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
    /*SELECT cages.id, animals.id_cage*/
var query = "SELECT animals.* FROM cages INNER JOIN animals ON animals.id_cage = cages.id WHERE cages.id=" + id;
 //CONDITIONS
var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
for (var index in conditions) {
    if (conditions[index] in req.query) {
        query += " AND animals." + conditions[index] + "='" +
        req.query[conditions[index]] + "'";
        }
    }
 //ORDRE
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
    //CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
    //PAGINATION
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

app.put('/cages/:id', function(req, res) {
var id = req.params.id;
var query = "UPDATE cages SET ";
if (req.body.name!=null)
{
    var name = req.body.name;
    query += " name = '" + name + "' ";
}
if (req.body.description)
{
    if (req.body.name!=null) {query += ", ";}
    var description = req.body.description;
    query += " description = '" + description + "' ";
}
if (req.body.area)
{
    if ((req.body.name!=null)||(req.body.description!=null)) {query += ", ";}
    var area = req.body.area;
    query += " area = " + area ;
}
var area = req.body.area;
query += " WHERE id=" + id; 
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success update cage"));
});
});

app.delete('/cages', function(req, res) {
var query = "DELETE FROM cages";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success delete cages"));
});
});

app.delete('/cages/:id', function(req, res) {
var id = req.params.id;
var query = "DELETE FROM cages WHERE id=" + id;
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success delete cages with id"));
});
});

//___________________________________________________________
app.post('/food', function(req, res) {
//var id = req.body.id;
var name = req.body.name;
var quantity = req.body.quantity;
var id_animal = req.body.id_animal;
var query = "INSERT INTO food (name, quantity, id_animal) VALUES ('" + name + "'," + quantity + "," + id_animal + ")";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success food"));
});
});

app.get('/food', function(req, res) {
var query = "SELECT * FROM food";
    ///CONDITIONS
var conditions = ["name", "quantity", "id_animal"];
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
 ///ORDRE
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
    ///CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
    ///PAGINATION
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
var query = "SELECT * FROM food WHERE id=" + id;
///CONDITIONS
var conditions = ["name", "quantity", "id_animal"];
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
 ///ORDRE
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
    ///CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
    ///PAGINATION
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

app.get('/food/:id/animals', function(req, res) {
var id = req.params.id;
var query = "SELECT animals.* FROM food INNER JOIN animals ON animals.id = food.id_animal WHERE food.id=" + id;
 //CONDITIONS
var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
for (var index in conditions) {
    if (conditions[index] in req.query) {
        query += " AND animals." + conditions[index] + "='" +
        req.query[conditions[index]] + "'";
        }
    }
 //ORDRE
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
    //CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
    //PAGINATION
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

app.get('/food/:id_food/animals/:id_animals', function(req, res) {
var id_food = req.params.id_food;
var id_animals = req.params.id_animals;
var query = "SELECT animals.* FROM food INNER JOIN animals ON animals.id = food.id_animal WHERE food.id=" + id_food + " AND animals.id=" + id_animals;
 //CONDITIONS
var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
for (var index in conditions) {
    if (conditions[index] in req.query) {
        query += " AND animals." + conditions[index] + "='" +
        req.query[conditions[index]] + "'";
        }
    }
 //ORDRE
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
    //CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
    //PAGINATION
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

app.get('/food-stats', function(req, res) {
var query = "SELECT animals.id,(quantity/food_per_day) AS days_left FROM animals INNER JOIN food ON animals.id=food.id_animal";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});

/*app.get('/food-stats', function(req, res) {
    var query = "SELECT animals.id as id, coalesce((quantity/food_per_day),0) as days_left FROM animals inner join food on animals.id=food.id_animal";
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
}); */

app.put('/food/:id', function(req, res) {
var id = req.params.id;
var query = "UPDATE food SET "
if (req.body.name!=null)
{
    var name = req.body.name;
    query += "name = '" + name +"' "; 
}
if (req.body.quantity!=null)
{
    if (req.body.name!=null) {query += ", ";}
    var quantity = req.body.quantity;
    query += "quantity = " + quantity ;
}
if (req.body.id_animal!=null)
{
    if ((req.body.name!=null)||(req.body.quantity!=null)) {query += ", ";}
    var id_animal = req.body.id_animal;
    query += "id_animal = " + id_animal ;
}
query += " WHERE id=" + id; 
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success update food"));
});
});

app.delete('/food', function(req, res) {
var query = "DELETE FROM food";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success delete food"));
});
});

app.delete('/food/:id', function(req, res) {
var id = req.params.id;
var query = "DELETE FROM food WHERE id=" + id;
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success delete food whith id"));
});
});

//___________________________________________________________
app.post('/staff', function(req, res) {
//var id = req.body.id;
var firstname = req.body.firstname;
var lastname = req.body.lastname;
var wage = req.body.wage;
var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('" + firstname + "','" + lastname + "'," + wage + ")";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success staff"));
});
});

app.get('/staff', function(req, res) {
var query = "SELECT * FROM staff";
    ///CONDITIONS
var conditions = ["firstname", "lastname", "wage"];
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
    ///ORDRE
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
    ///CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
    ///PAGINATION
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
var query = "SELECT * FROM staff WHERE id=" + id;
    ///CONDITIONS
var conditions = ["firstname", "lastname", "wage"];
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
    ///ORDRE
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
    ///CHAMPS
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
    ///PAGINATION
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

app.put('/staff/:id', function(req, res) {
var id = req.params.id;
var query = "UPDATE staff SET "
if (req.body.firstname!=null)
{
    var firstname = req.body.firstname;
    query += "firstname = '" + firstname +"' "; 
}
if (req.body.lastname!=null)
{
    if (req.body.firstname!=null) { query += ",";}
    var lastname = req.body.lastname;
    query += "lastname = '" + lastname + "' ";
}
if (req.body.wage!=null)
{
    if ((req.body.firstname!=null)||(req.body.lastname!=null)) { query += ",";}
    var wage = req.body.wage;
    query += "wage = " + wage;
}
query += " WHERE id=" + id; 
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success update staff"));
});
});

app.delete('/staff', function(req, res) {
var query = "DELETE FROM staff";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success delete staff"));
});
});

app.delete('/staff/:id', function(req, res) {
var id = req.params.id;
var query = "DELETE FROM staff WHERE id=" + id;
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success delete staff id"));
});
});

/////////////////////////////////////////////////////////////////////
app.listen(3000, function() {
db.connect(function(err) {
    if (err) throw err;
    console.log('Connection to database successful!');
});
console.log('Example app listening on port 3000!');
});