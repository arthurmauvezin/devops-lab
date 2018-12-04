//adding the proper libraries
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webproject',
    port: '3306'
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////******************Firewall implementation***********************///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//middleware to set up a firewall that will check the apikey of a user
app.use(function (req, res, next) {
    //checks if the user provided his apikey as a parameter

    console.log(req.originalUrl);
    console.log(req.body);

    if ("key" in req.query) {
        var query = "SELECT * from users where apikey='" + req.query["key"] + "'";

        db.query(query, function (err, result, fields) {
            if (err) throw err;

            if (result.length > 0) {
                //we got a result for the apikey
                next();
            } else {
                //no results, token was invalid or did not match any user
                res.status(403).send("access denied");
            }
        });
    } else {
        //no token provided in query
        res.status(403).send("access denied");
        //res.send("acess denied, user did not provide a key");
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////********************FILTERING******************///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//function to do all our filtering and save some code lines :) 
function filterForAll(columns, query, req, table) {
    //we start with the selection/projection
    if ("fields" in req.query) {
        //here we assume that inside the link, the fields are seperated by commas
        if (table == "") {
            //we dont have a specific table join
            query = query.replace("*", req.query["fields"]);
        } else {
            //we split the fields by a comma separator
            var fields = req.query.fields.split(",");
            var newfields = "";
            for (var i = 0; i < fields.length; i++) {
                //we add the table.field,
                newfields += table + "." + fields[i] + ",";
            }
            newfields = newfields.slice(0, -1); //remove last comma
            query = query.replace(table + ".*", newfields);
        }


    }

    //now we add filtering
    for (var index in columns) {
        if (columns[index] in req.query) {
            //now we can add a filter in our query

            //we start by checking if the added the WHERE
            if (query.indexOf("WHERE") < 0) {
                query += " WHERE ";
            } else {
                query += " AND ";
            }
            //if we had a join we need to add the table.field
            if (table == "") {
                query += " " + columns[index] + "='" + req.query[columns[index]] + "' ";
            } else {
                query += " " + table + "." + columns[index] + "='" + req.query[columns[index]] + "' ";
            }

        }
    }

    //then sorting
    //sorting by certain fields
    if ("sort" in req.query) {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY ";
        //for each sort parameters
        for (var s in sort) {
            var dir = sort[s].substr(0, 1);
            var field = sort[s].substr(1);

            if (table == "") {
                query += " " + field + " ";

            } else {
                query += " " + table + "." + field + " ";

            }

            if (dir == '-') {
                query += " DESC,";
            } else {
                query += " ASC,";
            }
        }
        //remove last comma
        query = query.slice(0, -1);
    }

    //finally we include pagination
    if ("limit" in req.query) {
        query += " LIMIT " + req.query["limit"];

        if ("offset" in req.query) {
            query += " OFFSET " + req.query["offset"];
        }
    }

    //now we simply return the modified query, this function should work for all tables 
    console.log(query);
    return query;
}

//contains all of the required stuff that was asked for the project
//this includes routes, CRUD and filters + auth all condensed and treated dynamicaly based on user input

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////*******************CRUD OPERATIONS*******************//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////******************************////////////////////////////////
///////////////////////////////////////////////////////for ANIMALS table///////////////////////////////////////////
////////////////////////////////////////////////////*******************************///////////////////////////////



//*******************************************************CREATE***********************************************************// 

app.post('/animals/', function (req, res) {

    var name = req.body.name;
    var breed = req.body.breed;
    var dailyfood = req.body.food_per_day;
    var birthday = req.body.birthday;
    var dateofentry = req.body.entry_date;
    var cage = req.body.id_cage;

    var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) values('" + name + "','" + breed + "','" + dailyfood + "','" + birthday + "','" + dateofentry + "','" + cage + "')";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("inserted into table animals new tuple"));
    });
});

//*************************************************************READ**************************************************//

app.get('/animals/', function (req, res) {

    //array with the name of column fields for the table
    var columns = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    var query = "SELECT * FROM animals";

    //function that handles all the filtering in order to save code lines
    query = filterForAll(columns, query, req, "");


    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id', function (req, res) {
    var id = req.params.id; //we get the id of the animal we want to read
    var query = "SELECT * FROM animals WHERE id='" + id + "'";
    var columns = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    query = filterForAll(columns, query, req, "");

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//**********************************************************UPDATE********************************************************//


//update,requires and id to be added to know which element to modify
//update paremeters are checked dynamically based on the body parameters provided
app.put('/animals/:id', function (req, res) {
    var id = req.params.id;
    //liste des champs possibles a update
    var query = "UPDATE animals SET ";
    var fields = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    //on itere sur les possibles champs du body et on choisi celle qui est specifie
    for (var index in fields) {
        if (fields[index] in req.body) {
            query += " " + fields[index] + "='" + req.body[fields[index]] + "' ,";
        }
        //Sinon on fait rien parceque on va update un seul champ par requete
    }
    //pour enlever la derniere virgule dans la query, après le dernier champs (parceque si on veut changer plusiseurs champs, il faut mettre une virgule entre chaque champs)
    query = query.slice(0, -1);

    query += " WHERE id=" + id;

    console.log(query);

    db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Success"));
    });
});

//***************************************************************DELETE*********************************************************//
//delete all
app.delete('/animals/', function (req, res) {
    var query = "DELETE FROM animals";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("deleted all animals from animal table"));
    });
});
//delete by id
app.delete('/animals/:id', function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM animals where id=" + id;

    db.query(query, function (err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("deleted animal from database with id " + id));
    });
});

/////////////////////////////////////////////////////******************************////////////////////////////////
///for STAFF table///
////////////////////////////////////////////////////*******************************///////////////////////////////



//*****************************************************CREATE*************************************************//

app.post('/staff/', function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;

    var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('" + firstname + "','" + lastname + "','" + wage + "')";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("inserted into table staff new tuple"));
    });
});

//*******************************************************READ********************************************//

app.get('/staff/', function (req, res) {
    var columns = ["id", "firstname", "lastname", "wage"];
    var query = "SELECT * FROM staff";

    query = filterForAll(columns, query, req, "");

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//read by id
app.get('/staff/:id/', function (req, res) {
    var id = req.params.id;
    var columns = ["id", "firstname", "lastname", "wage"];
    var query = "SELECT * FROM staff WHERE id=" + id;

    query = filterForAll(columns, query, req, "");

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//******************************************************UPDATE*****************************************//
//update
//update paremeters are checked dynamically based on the body parameters provided
app.put('/staff/:id/', function (req, res) {
    var id = req.params.id;
    //liste des champs possibles a update
    var query = "UPDATE staff SET ";
    var fields = ["firstname", "lastname", "wage"];

    //on itere sur les possibles champs du body et on choisi celle qui est specifie
    for (var index in fields) {
        if (fields[index] in req.body) {
            query += " " + fields[index] + "='" + req.body[fields[index]] + "' ,";
        }
        //Sinon on fait rien parceque on va update un seul champ par requete
    }
    //pour enlever la derniere virgule dans la query, après le dernier champs (parceque si on veut changer plusiseurs champs, il faut mettre une virgule entre chaque champs)
    query = query.slice(0, -1);

    query += " WHERE id=" + id;

    //console.log(query);
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//********************************************************DELETE******************************************//
//delete all
app.delete('/staff/', function (req, res) {
    var query = "DELETE FROM staff";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("deleted all staff members from staff table"));
    });
});
//delete by id
app.delete('/staff/:id/', function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM staff where id=" + id;

    db.query(query, function (err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("deleted staff from table with id " + id));
    });
});

/////////////////////////////////////////////////////******************************////////////////////////////////
///for CAGES table///
////////////////////////////////////////////////////*******************************///////////////////////////////



//******************************************************CREATE************************************************************//
app.post('/cages/', function (req, res) {

    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;

    var query = "INSERT INTO cages (name,description,area) values('" + name + "','" + description + "','" + area + "')";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("inserted into table cage new tuple"));
    });
});

//********************************************************READ******************************************************//

app.get('/cages/', function (req, res) {
    var column = ["id", "name", "description", "area"];
    var query = "SELECT * FROM cages";

    query = filterForAll(column, query, req, "");

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


app.get('/cages/:id', function (req, res) {
    var id = req.params.id; //we get the id of the cage we want to read
    var column = ["id", "name", "description", "area"];
    var query = "SELECT * FROM cages WHERE id='" + id + "'";

    query = filterForAll(column, query, req, "");

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


//***********************************************************UPDATE********************************************************//

app.put('/cages/:id', function (req, res) {
    var id = req.params.id;
    //list of all possible fields to update
    var query = "UPDATE cages SET ";
    var fields = ["name", "description", "area"];

    //Itere on all possible body fields and choose the one specified
    for (var index in fields) {
        if (fields[index] in req.body) {
            query += " " + fields[index] + "='" + req.body[fields[index]] + "' ,";
        }
        //Otherwise it does nothing because it updates only one field by query
    }
    //To erase the last coma ',' in the query after the last field (because if we want to update many fields, we have to put a coma between each field) 
    query = query.slice(0, -1);

    query += " WHERE id=" + id;

    console.log(query);

    db.query(query, function (err, result, fields) {
        if (err) throw err;

        res.send(JSON.stringify("Success"));
    });
});



//********************************************************DELETE****************************************************//

app.delete('/cages/', function (req, res) {
    var query = "DELETE FROM cages";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("deleted all cages from cages table"));
    });
});
//delete by id
app.delete('/cages/:id/', function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM cages where id=" + id;

    db.query(query, function (err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("deleted cages from database with id " + id));
    });
});


/////////////////////////////////////////////////////******************************////////////////////////////////
///for FOOD table///
////////////////////////////////////////////////////*******************************///////////////////////////////


//******************************************************************CREATE***************************************************//

app.post('/food/', function (req, res) {
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;

    var query = "INSERT INTO food (name,quantity,id_animal) VALUES ('" + name + "','" + quantity + "','" + id_animal + "')";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("inserted into table staff new tuple"));
    });
});

//**************************************************************READ*************************************************//

app.get('/food/', function (req, res) {
    var query = "SELECT * FROM food";
    var columns = ["id", "name", "quantity", "id_animal"];

    //general filter function
    query = filterForAll(columns, query, req, "");

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//read by id
app.get('/food/:id/', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;
    var columns = ["id", "name", "quantity", "id_animal"];

    //general filter function
    query = filterForAll(columns, query, req, "");

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//************************************************************UPDATE********************************************//

//update
//update paremeters are checked dynamically based on the body parameters provided
app.put('/food/:id/', function (req, res) {
    var id = req.params.id;
    //liste des champs possibles a update
    var query = "UPDATE food SET ";
    var fields = ["name", "quantity", "id_animal"];

    //on itere sur les possibles champs du body et on choisi celle qui est specifie
    for (var index in fields) {
        if (fields[index] in req.body) {
            query += " " + fields[index] + "='" + req.body[fields[index]] + "' ,";
        }
        //Sinon on fait rien parceque on va update un seul champ par requete
    }
    //pour enlever la derniere virgule dans la query, après le dernier champs (parceque si on veut changer plusiseurs champs, il faut mettre une virgule entre chaque champs)
    query = query.slice(0, -1);

    query += " WHERE id=" + id;

    //console.log(query);
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//*************************************************************DELETE***************************************************//
//delete all
app.delete('/food/', function (req, res) {
    var query = "DELETE FROM food";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("deleted all food items from food table"));
    });
});
//delete by id
app.delete('/food/:id/', function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM food where id=" + id;

    db.query(query, function (err, result, field) {
        if (err) throw err;
        res.send(JSON.stringify("deleted food from table with id " + id));
    });
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////************************RELATIONSHIPS******************////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//***************************************between animals and cages*********************************************//

app.get('/animals/:id/cages/', function (req, res) {
    var id = req.params.id;
    var columns = ["id", "name", "description", "area"];
    var query = "SELECT cages.* FROM animals INNER JOIN cages on cages.id = animals.id_cage  WHERE animals.id =" + id;

    query = filterForAll(columns, query, req, "cages");

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//read one
app.get('/animals/:id/cages/:id2', function (req, res) {
    var id = req.params.id;
    var id2 = req.params.id2;

    var columns = ["id", "name", "description", "area"];
    var query = "SELECT cages.* FROM animals INNER JOIN cages on cages.id = animals.id_cage  WHERE animals.id =" + id + " AND cages.id=" + id2;

    query = filterForAll(columns, query, req, "cages");

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
//**************************************between cages and animals***********************************************//

app.get('/cages/:id/animals/', function (req, res) {
    var id = req.params.id;
    var columns = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
    var query = "SELECT animals.* FROM cages INNER JOIN animals on  animals.id_cage = cages.id  WHERE cages.id =" + id;

    query = filterForAll(columns, query, req, "animals");
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


//**********************************************between food and animals*************************************************//
app.get('/food/:id/animals/', function (req, res) {
    var id = req.params.id;
    var columns = ["id", "name", "breed", "food_per_day", "brithday", "entry_date", "id_cage"];
    var query = "SELECT animals.* FROM food INNER JOIN animals on  animals.id = food.id_animal WHERE food.id =" + id;

    query = filterForAll(columns, query, req, "animals");


    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/food/:id/animals/:id2', function (req, res) {
    var id = req.params.id;
    var id2 = req.params.id2;
    var columns = ["id", "name", "breed", "food_per_day", "brithday", "entry_date", "id_cage"];
    var query = "SELECT animals.* FROM food INNER JOIN animals on  animals.id = food.id_animal WHERE food.id =" + id + " AND animals.id=" + id2;

    query = filterForAll(columns, query, req, "animals");

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//***********************************************between animals and food******************************************//
app.get('/animals/:id/food/', function (req, res) {
    var id = req.params.id;
    var columns = ["id", "name", "quantity", "id_animal"];
    var query = "SELECT food.* FROM animals INNER JOIN food on food.id_animal = animals.id   WHERE animals.id =" + id;

    query = filterForAll(columns, query, req, "food");

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//**************************************************FOOD-STATS***************************************** *///

app.get('/food-stats/', function (req, res) {
    var query = "SELECT animals.id,  IF(animals.food_per_day=0,0,food.quantity/animals.food_per_day) AS days_left  from animals INNER JOIN food ON food.id_animal=animals.id";

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.listen(3000, function () {
    db.connect(function (err) {
        if (err) throw err;
        console.log("connection to the db was successful");
    })
    console.log("listening on port 3000");
});