const express = require('express'); 
const mysql = require('mysql'); 
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({ 
    host: "localhost", 
    user: "root", 
    password: "root", 
    database: "project", 
    port: "8889"
});



/*--------------------------------------------------------------------------
---------------------------------FIREWALL-----------------------------------
--------------------------------------------------------------------------*/

// This attempt to set up a firewall has failed :(
/*app.use(function(req, res, next) { 
    if ("token" in req.query) { 
        var query = "SELECT * FROM users WHERE apikey='" + req.query["token"] + "'";
        
        db.query(query, function(err, result, fields) { 
            if (err) throw err; 
            if (result.length > 0) { next(); } 
            else { res.status(403).send("403 Error: Access denied (incorrect token)"); } 
        }); 
    } 
    else { res.status(403).send("403 Error: Access denied (no token provided)"); } 
});*/



/*--------------------------------------------------------------------------
-----------------------------------POST-------------------------------------
--------------------------------------------------------------------------*/

app.post('/animals', function(req, res) { //insert new animal
    var name = req.body.name; 
    var breed = req.body.breed; 
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday; 
    var entry_date = req.body.entry_date; 
    var id_cage = req.body.id_cage;
    var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('" + name + "', '" + breed + "', " + food_per_day + ", '" + birthday + "', '" + entry_date + "', " + id_cage + ")";
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify("Animal successfully added to the database")); 
    }); 
});

app.post('/cages', function(req, res) { //insert new cage
    var name = req.body.name; 
    var description = req.body.description; 
    var area = req.body.area;
    var query = "INSERT INTO cages (name, description, area) VALUES ('" + name + "', '" + description + "', " + area + ")";
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify("Cage successfully added to the database")); 
    }); 
});

app.post('/food', function(req, res) { //insert new food
    var name = req.body.name;  
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    var query = "INSERT INTO food (name, quantity, id_animal) VALUES ('" + name + "', " + quantity + ", " + id_animal + ")";
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify("Food successfully added to the database")); 
    }); 
});

app.post('/staff', function(req, res) { //insert new staff
    var firstname = req.body.firstname; 
    var lastname = req.body.lastname; 
    var wage = req.body.wage;
    var query = "INSERT INTO staff (firstname, lastname, Wage) VALUES ('" + firstname + "', '" + lastname + "', " + wage + ")";
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify("Staff successfully added to the database")); 
    }); 
});



/*--------------------------------------------------------------------------
-----------------------------------GET--------------------------------------
--------------------------------------------------------------------------*/

app.get('/animals', function(req, res) { //select all animals
    var query = "SELECT * FROM animals"; 
    var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    
    ///SELECTION
    for (var index in conditions) { 
        if (conditions[index] in req.query) { 
            if (query.indexOf("WHERE") < 0) { 
                query += " WHERE";
            } else { query += " AND"; } 
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'"; 
        } 
    }
    
    ///SORTING
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(","); 
        query += " ORDER BY"; 
        for (var index in sort) {
            var direction = sort[index].substr(0, 1); 
            var field = sort[index].substr(1);
            query += " " + field; 
            if (direction == "-") query += " DESC,"; 
            else query += " ASC,"; 
        } 
        query = query.slice(0, -1); 
    }
    
    ///FILTERING
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]); 
    }
    
    ///PAGINATION
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"]; }
    }
    
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify(result)); 
    }); 
});

app.get('/animals/:id', function(req, res) { //select one specific animal
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id; 
    
    ///FILTERS
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]); 
    }
    
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify(result)); 
    }); 
});



app.get('/cages', function(req, res) { //select all cages
    var query = "SELECT * FROM cages"; 
    var conditions = ["id", "name", "description", "area"];
    
    ///SELECTION
    for (var index in conditions) { 
        if (conditions[index] in req.query) { 
            if (query.indexOf("WHERE") < 0) { 
                query += " WHERE";
            } else { query += " AND"; } 
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'"; 
        } 
    }
    
    ///SORTING
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(","); 
        query += " ORDER BY"; 
        for (var index in sort) {
            var direction = sort[index].substr(0, 1); 
            var field = sort[index].substr(1);
            query += " " + field; 
            if (direction == "-") query += " DESC,"; 
            else query += " ASC,"; 
        } 
        query = query.slice(0, -1); 
    }
    
    ///FILTERING
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]); 
    }
    
    ///PAGINATION
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"]; }
    }
    
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify(result)); 
    }); 
});

app.get('/cages/:id', function(req, res) { //select one specific cage
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + id;
    
    ///FILTERS
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]); 
    }
    
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify(result)); 
    }); 
});



app.get('/food', function(req, res) { //select all the food
    var query = "SELECT * FROM food"; 
    var conditions = ["id", "name", "quantity", "id_animal"];
    
    ///SELECTION
    for (var index in conditions) { 
        if (conditions[index] in req.query) { 
            if (query.indexOf("WHERE") < 0) { 
                query += " WHERE";
            } else { query += " AND"; } 
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'"; 
        } 
    }
    
    ///SORTING
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(","); 
        query += " ORDER BY"; 
        for (var index in sort) {
            var direction = sort[index].substr(0, 1); 
            var field = sort[index].substr(1);
            query += " " + field; 
            if (direction == "-") query += " DESC,"; 
            else query += " ASC,"; 
        } 
        query = query.slice(0, -1); 
    }
    
    ///FILTERING
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]); 
    }
    
    ///PAGINATION
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"]; }
    }
    
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify(result)); 
    }); 
});

app.get('/food/:id', function(req, res) { //select one specific kind of food
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id; 
    
    ///FILTERS
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]); 
    }
    
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify(result)); 
    }); 
});



app.get('/staff', function(req, res) { //select all the staff
    var query = "SELECT * FROM staff"; 
    var conditions = ["id", "firstname", "lastname", "wage"];
    
    ///SELECTION
    for (var index in conditions) { 
        if (conditions[index] in req.query) { 
            if (query.indexOf("WHERE") < 0) { 
                query += " WHERE";
            } else { query += " AND"; } 
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'"; 
        } 
    }
    
    ///SORTING
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(","); 
        query += " ORDER BY"; 
        for (var index in sort) {
            var direction = sort[index].substr(0, 1); 
            var field = sort[index].substr(1);
            query += " " + field; 
            if (direction == "-") query += " DESC,"; 
            else query += " ASC,"; 
        } 
        query = query.slice(0, -1); 
    }
    
    ///FILTERING
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]); 
    }
    
    ///PAGINATION
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"]; }
    }
    
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify(result)); 
    }); 
});

app.get('/staff/:id', function(req, res) { //select one specific staff member
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id; 
    
    ///FILTERS
    if ("fields" in req.query) {
        query = query.replace("*", req.query["fields"]); 
    }
    
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify(result)); 
    }); 
});



///FOOD STATISTICS

app.get('/food-stats', function(req, res) { //display the number of days left before the animals run out of food
    var query = "SELECT animals.id, animals.name, COALESCE(SUM(food.quantity)/animals.food_per_day, 0) FROM animals INNER JOIN food ON animals.id=food.id_animal GROUP BY animals.id";
    var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    
    ///SELECTION
    for (var index in conditions) { 
        if (conditions[index] in req.query) { 
            if (query.indexOf("HAVING") < 0) { 
                query += " HAVING";
            } else { query += " AND"; } 
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'"; 
        } 
    }
    
    ///SORTING
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(","); 
        query += " ORDER BY"; 
        for (var index in sort) {
            var direction = sort[index].substr(0, 1); 
            var field = sort[index].substr(1);
            query += " " + field; 
            if (direction == "-") query += " DESC,"; 
            else query += " ASC,"; 
        } 
        query = query.slice(0, -1); 
    }
    
    ///FILTERING
    if ("fields" in req.query) {
        query = query.replace("animals.id, animals.name", req.query["fields"]); 
    }
    
    ///PAGINATION
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"]; }
    }
    
    db.query(query, function(err, result, fields) {
        if (err) throw err;  
        res.send(JSON.stringify(result)); 
    }); 
});



/*--------------------------------------------------------------------------
-----------------------------------PUT--------------------------------------
--------------------------------------------------------------------------*/

app.put('/animals/:id', function(req, res) { //update animal
    var id = req.params.id; 
    var name = req.body.name; 
    var breed = req.body.breed; 
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday; 
    var entry_date = req.body.entry_date; 
    var id_cage = req.body.id_cage;
    
    var query = "UPDATE animals SET";
    if(name != null) { query += " name = '" + name + "'"; }
    if(breed != null) { 
        if (query.indexOf("=") < 0) { query += ""; } else { query += "," }
        query += " breed = '" + breed + "'"; }
    if(food_per_day != null) { 
        if (query.indexOf("=") < 0) { query += ""; } else { query += "," }
        query += " food_per_day = " + food_per_day; }
    if(birthday != null) { 
        if (query.indexOf("=") < 0) { query += ""; } else { query += "," }
        query += " birthday = '" + birthday + "'"; }
    if(entry_date != null) { 
        if (query.indexOf("=") < 0) { query += ""; } else { query += "," }
        query += " entry_date = '" + entry_date + "'"; }
    if(id_cage != null) { 
        if (query.indexOf("=") < 0) { query += ""; } else { query += "," }
        query += " id_cage = " + id_cage; }
    query += " WHERE id=" + id;
    
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify("Animal succesfully updated")); 
    }); 
});

app.put('/cages/:id', function(req, res) { //update cage
    var id = req.params.id; 
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    
    var query = "UPDATE cages SET";
    if(name != null) { query += " name = '" + name + "'"; }
    if(description != null) { 
        if (query.indexOf("=") < 0) { query += ""; } else { query += "," }
        query += " description = '" + description + "'"; }
    if(area != null) { 
        if (query.indexOf("=") < 0) { query += ""; } else { query += "," }
        query += " area = " + area; }
    query += " WHERE id=" + id;
    
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify("Cage succesfully updated")); 
    }); 
});

app.put('/food/:id', function(req, res) { //update food
    var id = req.params.id; 
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    
    var query = "UPDATE food SET";
    if(name != null) { query += " name = '" + name + "'"; }
    if(quantity != null) { 
        if (query.indexOf("=") < 0) { query += ""; } else { query += "," }
        query += " quantity = " + quantity; }
    if(id_animal != null) { 
        if (query.indexOf("=") < 0) { query += ""; } else { query += "," }
        query += " id_animal = " + id_animal; }
    query += " WHERE id=" + id;
    
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify("Food succesfully updated")); 
    }); 
});

app.put('/staff/:id', function(req, res) { //update staff
    var id = req.params.id; 
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    
    var query = "UPDATE staff SET";
    if(firstname != null) { query += " firstname = '" + firstname + "'"; }
    if(lastname != null) { 
        if (query.indexOf("=") < 0) { query += ""; } else { query += "," }
        query += " lastname = '" + lastname + "'"; }
    if(wage != null) { 
        if (query.indexOf("=") < 0) { query += ""; } else { query += "," }
        query += " wage = " + wage; }
    query += " WHERE id=" + id;
    
    db.query(query, function(err, result, fields) { 
        if (err) throw err; 
        res.send(JSON.stringify("Staff succesfully updated")); 
    }); 
});



/*-----------------------------------------------------------------------
--------------------------------DELETE-----------------------------------
-----------------------------------------------------------------------*/

app.delete('/animals', function(req, res) { //delete all the animals
    var query = "DELETE FROM animals"; 
    db.query(query, function(err, result, fields) {
        if (err) throw err; 
        res.send(JSON.stringify("Animals successfully deleted from the database")); 
    }); 
});

app.delete('/animals/:id', function(req, res) { //delete one specific animal
    var id = req.params.id; 
    var query = "DELETE FROM animals WHERE id=" + id; 
    db.query(query, function(err, result, fields) {
        if (err) throw err; 
        res.send(JSON.stringify("Animal successfully deleted from the database")); 
    }); 
});

app.delete('/cages', function(req, res) { //delete all the cages
    var query = "DELETE FROM cages"; 
    db.query(query, function(err, result, fields) {
        if (err) throw err; 
        res.send(JSON.stringify("Cages successfully deleted from the database")); 
    }); 
});

app.delete('/cages/:id', function(req, res) { //delete one sepecific cage
    var id = req.params.id; 
    var query = "DELETE FROM cages WHERE id=" + id; 
    db.query(query, function(err, result, fields) {
        if (err) throw err; 
        res.send(JSON.stringify("Cage successfully deleted from the database")); 
    }); 
});

app.delete('/food', function(req, res) { //delete all the food
    var query = "DELETE FROM food"; 
    db.query(query, function(err, result, fields) {
        if (err) throw err; 
        res.send(JSON.stringify("Food successfully deleted from the database")); 
    }); 
});

app.delete('/food/:id', function(req, res) { //delete one specific kind of food
    var id = req.params.id; 
    var query = "DELETE FROM food WHERE id=" + id; 
    db.query(query, function(err, result, fields) {
        if (err) throw err; 
        res.send(JSON.stringify("Food successfully deleted from the database")); 
    }); 
});

app.delete('/staff', function(req, res) { //delete all the staff
    var query = "DELETE FROM staff"; 
    db.query(query, function(err, result, fields) {
        if (err) throw err; 
        res.send(JSON.stringify("Staff successfully deleted from the database")); 
    }); 
});

app.delete('/staff/:id', function(req, res) { //delete one specific staff member
    var id = req.params.id; 
    var query = "DELETE FROM staff WHERE id=" + id; 
    db.query(query, function(err, result, fields) {
        if (err) throw err; 
        res.send(JSON.stringify("Staff successfully deleted from the database")); 
    }); 
});



/*--------------------------------------------------------------------------
---------------------------------RELATIONS----------------------------------
--------------------------------------------------------------------------*/

///ANIMALS - CAGES

app.get('/animals/:id/cages', function(req, res) { //get cages from animals
    var id = req.params.id;
    var query = "SELECT cages.id, cages.name FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id; 
    var conditions = ["id", "name", "description", "area"];
    
    ///CONDITIONS
    for (var index in conditions) { 
        if (conditions[index] in req.query) { 
            query += " AND cages." + conditions[index] + "='" + req.query[conditions[index]] + "'"; 
        } 
    }
    
    ///FIELDS
    if ("fields" in req.query) {
        query = query.replace("cages.id, cages.name", req.query["fields"]); 
    }
    
    ///PAGINATION
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"]; }
    }
    
    db.query(query, function(err, result, fields) {
        if (err) throw err; res.send(JSON.stringify(result));
    }); 
});

app.get('/animals/:id_animal/cages/:id_cage', function(req, res) { //get one cage from animals
    var id_animal = req.params.id_animal;
    var id_cage = req.params.id_cage;
    var query = "SELECT cages.id, cages.name FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animal + " AND cages.id=" + id_cage; 
    
    ///FIELDS
    if ("fields" in req.query) {
        query = query.replace("cages.id, cages.name", req.query["fields"]); 
    }
    
    db.query(query, function(err, result, fields) {
        if (err) throw err; res.send(JSON.stringify(result));
    }); 
});

app.get('/cages/:id/animals', function(req, res) { //get animals from cages
    var id = req.params.id;
    var query = "SELECT animals.id, animals.name FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id; 
    var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    
    ///CONDITIONS
    for (var index in conditions) { 
        if (conditions[index] in req.query) { 
            query += " AND animals." + conditions[index] + "='" + req.query[conditions[index]] + "'"; 
        } 
    }
    
    ///FIELDS
    if ("fields" in req.query) {
        query = query.replace("animals.id, animals.name", req.query["fields"]); 
    }
    
    ///PAGINATION
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"]; }
    }
    
    db.query(query, function(err, result, fields) {
        if (err) throw err; res.send(JSON.stringify(result));
    }); 
});

app.get('/cages/:id_cage/animals/:id_animal', function(req, res) { //get one animal from cages
    var id_cage = req.params.id_cage;    
    var id_animal = req.params.id_animal;
    var query = "SELECT animals.id, animals.name FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE animals.id=" + id_animal + " AND cages.id=" + id_cage; 
    
    ///FIELDS
    if ("fields" in req.query) {
        query = query.replace("animals.id, animals.name", req.query["fields"]); 
    }
    
    db.query(query, function(err, result, fields) {
        if (err) throw err; res.send(JSON.stringify(result));
    }); 
});

///ANIMALS - FOOD

app.get('/food/:id/animals', function(req, res) { //get animals from food
    var id = req.params.id;
    var query = "SELECT animals.id, animals.name FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id=" + id; 
    var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    
    ///CONDITIONS
    for (var index in conditions) { 
        if (conditions[index] in req.query) { 
            query += " AND animals." + conditions[index] + "='" + req.query[conditions[index]] + "'"; 
        } 
    }
    
    ///FIELDS
    if ("fields" in req.query) {
        query = query.replace("animals.id, animals.name", req.query["fields"]); 
    }
    
    ///PAGINATION
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"]; }
    }
    
    db.query(query, function(err, result, fields) {
        if (err) throw err; res.send(JSON.stringify(result));
    }); 
});

app.get('/food/:id_food/animals/:id_animal', function(req, res) { //get one animal from food
    var id_food = req.params.id_food;    
    var id_animal = req.params.id_animal;
    var query = "SELECT animals.id, animals.name FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE animals.id=" + id_animal + " AND food.id=" + id_food; 
    
    ///FIELDS
    if ("fields" in req.query) {
        query = query.replace("animals.id, animals.name", req.query["fields"]); 
    }
    
    db.query(query, function(err, result, fields) {
        if (err) throw err; res.send(JSON.stringify(result));
    }); 
});

app.get('/animals/:id/food', function(req, res) { //get food from animals
    var id = req.params.id;
    var query = "SELECT food.id, food.name FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id; 
    var conditions = ["id", "name", "quantity", "id_animal"];
    
    ///CONDITIONS
    for (var index in conditions) { 
        if (conditions[index] in req.query) { 
            query += " AND food." + conditions[index] + "='" + req.query[conditions[index]] + "'"; 
        } 
    }
    
    ///FIELDS
    if ("fields" in req.query) {
        query = query.replace("food.id, food.name", req.query["fields"]); 
    }
    
    ///PAGINATION
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"]; }
    }
    
    db.query(query, function(err, result, fields) {
        if (err) throw err; res.send(JSON.stringify(result));
    }); 
});

app.get('/animals/:id_animal/food/:id_food', function(req, res) { //get one kind of food from animals
    var id_animal = req.params.id_animal;
    var id_food = req.params.id_food;
    var query = "SELECT food.id, food.name FROM animals INNER JOIN food ON animals.id = food.id_animals WHERE animals.id=" + id_animal + " AND food.id=" + id_food; 
    
    ///FIELDS
    if ("fields" in req.query) {
        query = query.replace("food.id, food.name", req.query["fields"]); 
    }
    
    db.query(query, function(err, result, fields) {
        if (err) throw err; res.send(JSON.stringify(result));
    }); 
});





app.listen(3000, function() { 
    db.connect(function(err) { if (err) throw err; }); 
    console.log('Connection to database successful!'); });

