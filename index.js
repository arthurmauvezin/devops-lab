//run 'node index.js' in the terminal AND use Postman to check the routes 

//import library
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

//use the body-parser library in our application
app.use(bodyParser.urlencoded({extended: true}));

//connection to the database 
var database = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "root",
    database : "project",
    port : "8889"
});

//firewall
app.use(function(req, res, next){
    if ("key" in req.query){
        var key = req.query["key"];
        var query = "SELECT apikey FROM users WHERE apikey = '"+key+"'";
        database.query(query, function(err, result, fields){
            if (err) throw err;
            if (result.length > 0){
                next();
            }else{
                res.status(403).send();
            }
        });
    }else{
        res.status(403).send();
    }
});

//function
function selection(query, conditions, parameters)
{
    for(var index in conditions){
        if(conditions[index] in parameters){
            if(query.indexOf("WHERE")<0){
                query += " WHERE";
            }else{
                query += " AND";
            }

            query += " "+conditions[index]+" = '"+parameters[conditions[index]]+"'";
        }
    }

    return query;
}

function selectionRelation(query, conditions, parameters, table)
{
    for(var index in conditions){
        if(conditions[index] in parameters){
            if(query.indexOf("WHERE")<0){
                query += " WHERE";
            }else{
                query += " AND";
            }

            query += " "+table+"."+conditions[index]+" = '"+parameters[conditions[index]]+"'";
        }
    }

    return query;
}

function selectionPut(query, conditions, body, id)
{
    for(var index in conditions){
        if(conditions[index] in body){
            if(query.indexOf("SET")<0){
                query += " SET";
            }else{
                query += ", ";
            }

            query += " "+conditions[index]+" = '"+body[conditions[index]]+"'";
        }
    }

    query += " WHERE id = '"+id+"'";

    return query;
}

function sorting(query, parameters)
{
    if("sort" in parameters){
        var sort = parameters["sort"].split(",");
        query += " ORDER BY";

        for (var index in sort){
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);

            query += " " + field;

            if(direction == "-")
            query += " DESC,";
            else
            query += " ASC,"
        }

        query = query.slice(0, -1);
    }

    return query;
}

function filtering(query, parameters)
{
    if("fields" in parameters){
        query=query.replace("*", parameters["fields"]);
    }

    return query;
}

function pagination(query, parameters)
{
    if ("limit" in parameters){
        query += " LIMIT " + parameters["limit"];
        if ("offset" in parameters){
            query += " OFFSET " + parameters["offset"];
        }
    }

    return query;
}

//== Animals ==
//Delete all data...
app.delete('/animals', function(req, res){
    var query = "DELETE FROM animals";

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Create data
app.post('/animals', function(req, res) {
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;
    var query = "INSERT INTO animals(name, breed, food_per_day, birthday, entry_date, id_cage) values('"+name+"', '"+breed+"', '"+food_per_day+"', '"+birthday+"', '"+entry_date+"', '"+id_cage+"')";

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Read all data...
app.get('/animals', function(req, res){
    var query = "SELECT * FROM animals";
    var parameters = req.query;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    query = selection(query, conditions, parameters);

    query = sorting(query, parameters);

    query = filtering(query, parameters);

    query = pagination(query, parameters);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Read data...
app.get('/animals/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id ='"+id+"'";
    var parameters = req.query;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    query = selection(query, conditions, parameters);

    query = sorting(query, parameters);

    query = filtering(query, parameters);

    query = pagination(query, parameters);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//UPDATE data...
app.put('/animals/:id', function(req, res) {
    var query = "UPDATE animals";
    var id = req.params.id;
    var body = req.body;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    query = selectionPut(query, conditions, body, id);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Delete data...
app.delete('/animals/:id', function(req, res) {
    var id = req.params.id;

    var query = "DELETE FROM animals WHERE id ="+id;
    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//== Cages ==
//Delete all data...
app.delete('/cages', function(req, res){
    var query = "DELETE FROM cages";

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Create data
app.post('/cages', function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    var query = "INSERT INTO cages(name, description, area) values('"+name+"', '"+description+"', '"+area+"')";

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Read all data...
app.get('/cages', function(req, res){
    var query = "SELECT * FROM cages";
    var parameters = req.query;
    var conditions = ["name", "description", "area"];

    query = selection(query, conditions, parameters);

    query = sorting(query, parameters);

    query = filtering(query, parameters);

    query = pagination(query, parameters);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Read data...
app.get('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id ='"+id+"'";
    var parameters = req.query;
    var conditions = ["name", "description", "area"];

    query = selection(query, conditions, parameters);

    query = sorting(query, parameters);

    query = filtering(query, parameters);

    query = pagination(query, parameters);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//UPDATE data...
app.put('/cages/:id', function(req, res) {
    var query = "UPDATE cages";
    var id = req.params.id;
    var body = req.body;
    var conditions = ["name", "description", "area"];

    query = selectionPut(query, conditions, body, id);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Delete data...
app.delete('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM cages WHERE id ='"+id+"'";

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//== Food ==
//Delete all data...
app.delete('/food', function(req, res){
    var query = "DELETE FROM food";

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Create data
app.post('/food', function(req, res) {
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    var query = "INSERT INTO food(name, quantity, id_animal) values('"+name+"', '"+quantity+"', '"+id_animal+"')";

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Read all data...
app.get('/food', function(req, res){
    var query = "SELECT * FROM food";
    var parameters = req.query;
    var conditions = ["name", "quantity", "id_animal"];

    query = selection(query, conditions, parameters);

    query = sorting(query, parameters);

    query = filtering(query, parameters);

    query = pagination(query, parameters);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Read data...
app.get('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id ='"+id+"'";
    var parameters = req.query;
    var conditions = ["name", "quantity", "id_animal"];

    query = selection(query, conditions, parameters);

    query = sorting(query, parameters);

    query = filtering(query, parameters);

    query = pagination(query, parameters);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//UPDATE data...
app.put('/food/:id', function(req, res) {
    var query = "UPDATE food";
    var id = req.params.id;
    var body = req.body;
    var conditions = ["name", "quantity", "id_animal"];

    query = selectionPut(query, conditions, body, id);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Delete data...
app.delete('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM food WHERE id ='"+id+"'";

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//== Staff ==
//Delete all data...
app.delete('/staff', function(req, res){
    var query = "DELETE FROM staff";

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Create data
app.post('/staff', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    var query = "INSERT INTO staff(firstname, lastname, wage) values('"+firstname+"', '"+lastname+"', '"+wage+"')";

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Read all data...
app.get('/staff', function(req, res){
    var query = "SELECT * FROM staff";
    var parameters = req.query;
    var conditions = ["firstname", "lastname", "wage"];

    query = selection(query, conditions, parameters);

    query = sorting(query, parameters);

    query = filtering(query, parameters);

    query = pagination(query, parameters);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Read data...
app.get('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id ='"+id+"'";
    var parameters = req.query;
    var conditions = ["firstname", "lastname", "wage"];

    query = selection(query, conditions, parameters);

    query = sorting(query, parameters);

    query = filtering(query, parameters);

    query = pagination(query, parameters);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//UPDATE data...
app.put('/staff/:id', function(req, res) {
    var query = "UPDATE staff";
    var id = req.params.id;
    var body = req.body;
    var conditions = ["firstname", "lastname", "wage"];

    query = selectionPut(query, conditions, body, id);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Delete data...
app.delete('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM staff WHERE id ='"+id+"'";

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//== Relationship ==
//Animals/Cages
app.get('/animals/:id/cages', function(req, res) {
    var id = req.params.id;
    var table = "cages";
    var query = "SELECT cages.* FROM animals JOIN cages ON cages.id = animals.id_cage WHERE animals.id='"+id+"'";
    var parameters = req.query;
    var conditions = ["name", "description", "area"];

    query = selectionRelation(query, conditions, parameters, table);

    query = filtering(query, parameters);

    query = pagination(query, parameters);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:aid/cages/:cid', function(req, res) {
    var aid = req.params.aid;
    var cid = req.params.cid;
    var table = "cages";
    var query = "SELECT cages.* FROM animals JOIN cages ON cages.id = animals.id_cage WHERE animals.id= '"+aid+"' AND cages.id= '"+cid+"'";
    var parameters = req.query;
    var conditions = ["name", "description", "area"];

    query = selectionRelation(query, conditions, parameters, table);

    query = filtering(query, parameters);

    query = pagination(query, parameters);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages/:id/animals', function(req, res) {
    var id = req.params.id;
    var table = "animals";
    var query = "SELECT animals.* FROM cages JOIN animals ON animals.id_cage=cages.id WHERE cages.id= '"+id+"'";
    var parameters = req.query;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    query = selectionRelation(query, conditions, parameters, table);

    query = filtering(query, parameters);

    query = pagination(query, parameters);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Food/Animals
app.get('/food/:id/animals', function(req, res) {
    var id = req.params.id;
    var table = "animals";
    var query = "SELECT animals.* FROM food JOIN animals ON food.id_animal = animals.id WHERE food.id= '"+id+"'";
    var parameters = req.query;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    query = selectionRelation(query, conditions, parameters, table);

    query = filtering(query, parameters);

    query = pagination(query, parameters);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food/:fid/animals/:aid', function(req, res) {
    var fid = req.params.fid;
    var aid = req.params.aid;
    var table = "animals";
    var query = "SELECT animals.* FROM food JOIN animals ON food.id_animal = animals.id WHERE food.id= '"+fid+"' AND animals.id= '"+aid+"'";
    var parameters = req.query;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    query = selectionRelation(query, conditions, parameters, table);

    query = filtering(query, parameters);

    query = pagination(query, parameters);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id/food', function(req, res) {
    var id = req.params.id;
    var table = "food";
    var query = "SELECT food.* FROM animals JOIN food ON animals.id = food.id_animal WHERE animals.id= '"+id+"'";
    var parameters = req.query;
    var conditions = ["name", "quantity", "id_animal"];

    query = selectionRelation(query, conditions, parameters, table);

    query = filtering(query, parameters);

    query = pagination(query, parameters);

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//== food-stats ==
//simple&complex
app.get('/food-stats', function(req, res) {
    var query = "SELECT a.id as 'id', COALESCE(floor(f.quantity / NULLIF(a.food_per_day, 0)), 0) as 'days_left' FROM animals a JOIN food f ON a.id = f.id_animal";

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Run the application
app.listen(3000, function(){
    /*database.connect(function(err) {
        if(err) throw err;
        console.log('Connexion Successful');
    });*/
    console.log('App listening on port 3000');
});