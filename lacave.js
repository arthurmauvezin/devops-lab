const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const dockerhost = process.env.MYSQL_HOST;
const dockerport = process.env.MYSQL_PORT;
const dockerdatabase = process.env.MYSQL_DATABASE;
const dockerlogin = process.env.MYSQL_LOGIN;
const dockerpassword = process.env.MYSQL_PASSWORD;

app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({
host: dockerhost,
user: dockerhost,
password: dockerpassword,
database: dockerdatabase,
port: dockerport
});

////////////////////////////////////
//////// START OF FIREWALL /////////
////////////////////////////////////
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
      res.status(403).send("Access denied");
    }
    });
    } else {
      res.status(403).send("Access denied");
  }
});

////////////////////////////////////
///// routes for animals table /////
////////////////////////////////////

// localhost:3000/animals/?sort=++breed

app.get('/animals', function(req, res) {
var query = "SELECT * FROM animals";
var conditions = ["id", "breed","id_cage","food_per_day","name","birthday","entry_date"];
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
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
if ("sort" in req.query) {
  var sort = req.query["sort"].split(",");
  query += " ORDER BY ";
  for (var index in sort) {
      var direction = sort[index].substr(0, 1);
      var field = sort[index].substr(1);
      query += field;
      if (direction == "-")
      query += " DESC,";
      else
      query += " ASC,";
  }
  query = query.slice(0, -1);
}
if ("limit" in req.query) {
query += " LIMIT " + req.query["limit"];
if ("offset" in req.query) {
query += " OFFSET " + req.query["offset"];
}
}
//res.send(JSON.stringify(query));
db.query(query, function(err, result, fields) {
  if (err) throw err;
  res.send(JSON.stringify(result));
});
});

app.get('/animals/:id', function(req, res) {
var id = req.params.id;
var query = "SELECT * FROM animals where animals.id=" + id;
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});
app.post('/animals/', function(req, res) {
  var values =") VALUES('";
  var query = "INSERT INTO animals (";
  var conditions = ["id", "breed","id_cage","food_per_day","name","birthday","entry_date"];
  for (var index in conditions) {
      if (conditions[index] in req.body) {
          query += conditions[index] + ",";
          values += req.body[conditions[index]] + "','";
      }
  }
  values = values.slice(0, -2);
  values += ")"
  query = query.slice(0,-1);
  query += values;
  db.query(query, function(err, result, fields) {
    if (err) throw err;
      db.query("SELECT * FROM animals", function(err, result, fields) {
        if (err) throw err;
        var response = { "page": "animals", "result": result };
        res.send(JSON.stringify(response));
    });
  });
});
app.put('/animals/:id', function(req, res) {
  var id = req.params.id;
  var query="update animals set";
  var conditions = ["breed","id_cage","food_per_day","name","birthday","entry_date"];
  for (var index in conditions) {
      if (conditions[index] in req.body) {
          query += " " + conditions[index] + "='" + req.body[conditions[index]] + "',";
      }
  }
  query = query.slice(0, -1);
  query +=  " where animals.id=" + id;
  db.query(query , function(err, result, fields) {
  if (err) throw err;
  res.send(JSON.stringify(result));
  });
});
app.delete('/animals', function(req, res) {
  var query = "DELETE from animals" ;
  db.query(query, function(err, result, fields) {
  if (err) throw err;
  var response= "All the animals have been supressed";
  res.send(JSON.stringify(response));
});
});
app.delete('/animals/:id', function(req, res) {
  var id = req.params.id;
  var query = "Delete from animals where animals.id='" +id+"'" ;
  db.query(query, function(err, result, fields) {
  if (err) throw err;
  var response= "The animal indentified whith id="+id+" has been supressed from database";
  res.send(JSON.stringify(response));
});
});

/////////////////////////////////
///// routes for cage table /////
/////////////////////////////////

app.get('/cages', function(req, res) {
var query = "SELECT * FROM cages";
var conditions = ["id", "name","description","area"];
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
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
if ("sort" in req.query) {
  var sort = req.query["sort"].split(",");
  query += " ORDER BY ";
  for (var index in sort) {
      var direction = sort[index].substr(0, 1);
      var field = sort[index].substr(1);
      query += field;
      if (direction == "-")
      query += " DESC,";
      else
      query += " ASC,";
  }
  query = query.slice(0, -1);
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
  var query ="SELECT * FROM cages where cages.id=" + id ;
  if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
  db.query(query, function(err, result, fields) {
  if (err) throw err;
  res.send(JSON.stringify(result));
  });
});
app.post('/cages/', function(req, res) {
  /*var name = req.body.name;
  var breed = req.body.breed;
  var dailyfood = req.body.dailyfood;
  var birthday = req.body.birthday;
  var entry = req.body.entry;
  var cage = req.body.cage;*/
  var values =") VALUES('";
  var query = "INSERT INTO cages (";
  var conditions = ["id", "name","description","area"];
  for (var index in conditions) {
      if (conditions[index] in req.body) {
          query += conditions[index] + ",";
          values += req.body[conditions[index]] + "','";
      }
  }
  values = values.slice(0, -2);
  values += ")"
  query = query.slice(0,-1);
  query += values;
  //console.log(query);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
      db.query("SELECT * FROM cages ", function(err, result, fields) {
        if (err) throw err;
        var response = { "page": "cages", "result": result };
        res.send(JSON.stringify(response));
    });
  });
});
app.put('/cages/:id', function(req, res) {
  var id = req.params.id;
  var query="update cages set";
  var conditions = ["description","area","name"];
  for (var index in conditions) {
      if (conditions[index] in req.body) {
          query += " " + conditions[index] + "='" + req.body[conditions[index]] + "',";
      }
  }
  query = query.slice(0, -1);
  query +=  " where cages.id=" + id;
  db.query(query , function(err, result, fields) {
  if (err) throw err;
  res.send(JSON.stringify(result));
  });
});
app.delete('/cages', function(req, res) {
  var query = "DELETE from cages" ;
  db.query(query, function(err, result, fields) {
  if (err) throw err;
  var response= "All the cages have been supressed";
  res.send(JSON.stringify(response));
});
});
app.delete('/cages/:id', function(req, res) {
  var id = req.params.id;
  var query = "Delete from cages where cages.id='" +id+"'" ;
  db.query(query, function(err, result, fields) {
  if (err) throw err;
  var response= "The cage indentified whith id="+id+" has been supressed from database";
  res.send(JSON.stringify(response));
});
});

/////////////////////////////////
///// routes for food table /////
/////////////////////////////////

app.get('/food', function(req, res) {
  var query = "SELECT * from food";
  var conditions = ["id", "name","quantity","id_animal"];
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
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
if ("sort" in req.query) {
  var sort = req.query["sort"].split(",");
  query += " ORDER BY ";
  for (var index in sort) {
      var direction = sort[index].substr(0, 1);
      var field = sort[index].substr(1);
      query += field;
      if (direction == "-")
      query += " DESC,";
      else
      query += " ASC,";
  }
  query = query.slice(0, -1);
  }
  if ("limit" in req.query) {
  query += " LIMIT " + req.query["limit"];
  if ("offset" in req.query) {
  query += " OFFSET " + req.query["offset"];
  }
  }
  //console.log(query);
  db.query(query, function(err, result, fields) {
  if (err) throw err;
  res.send(JSON.stringify(result));
  });
});
app.get('/food/:id', function(req, res) {
  var id = req.params.id;
  var query ="SELECT * FROM food where food.id=" + id ;
  if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
  db.query(query, function(err, result, fields) {
  if (err) throw err;
  res.send(JSON.stringify(result));
  });
});
app.post('/food/', function(req, res) {
  /*var name = req.body.name;
  var breed = req.body.breed;
  var dailyfood = req.body.dailyfood;
  var birthday = req.body.birthday;
  var entry = req.body.entry;
  var cage = req.body.cage;*/
  var values =") VALUES('";
  var query = "INSERT INTO food (";
  var conditions = ["id", "name","quantity","id_animal"];
  for (var index in conditions) {
      if (conditions[index] in req.body) {
          query += conditions[index] + ",";
          values += req.body[conditions[index]] + "','";
      }
  }
  values = values.slice(0, -2);
  values += ")"
  query = query.slice(0,-1);
  query += values;
  db.query(query, function(err, result, fields) {
    if (err) throw err;
      db.query("SELECT * FROM food ", function(err, result, fields) {
        if (err) throw err;
        var response = { "page": "food", "result": result };
        res.send(JSON.stringify(response));
    });
  });
});
app.put('/food/:id', function(req, res) {
  var id = req.params.id;
    var query="update food set";
  var conditions = ["quantity","id_animal","name"];
  for (var index in conditions) {
      if (conditions[index] in req.body) {
          query += " " + conditions[index] + "='" + req.body[conditions[index]] + "',";
      }
  }
  query = query.slice(0, -1);
  query +=  " where food.id=" + id;
  db.query(query , function(err, result, fields) {
  if (err) throw err;
  res.send(JSON.stringify(result));
  });
});
app.delete('/food', function(req, res) {
  var query = "DELETE from food" ;
  db.query(query, function(err, result, fields) {
  if (err) throw err;
  var response= "All the food have been supressed";
  res.send(JSON.stringify(response));
});
});
app.delete('/food/:id', function(req, res) {
  var id = req.params.id;
  var query = "Delete from food where food.id='" +id+"'" ;
  db.query(query, function(err, result, fields) {
  if (err) throw err;
  var response= "The food indentified whith id="+id+" has been supressed from database";
  res.send(JSON.stringify(response));
});
});

//////////////////////////////////
///// routes for staff table /////
//////////////////////////////////

app.get('/staff', function(req, res) {
  var query = "SELECT * from staff"
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
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
if ("sort" in req.query) {
  var sort = req.query["sort"].split(",");
  query += " ORDER BY ";
  for (var index in sort) {
      var direction = sort[index].substr(0, 1);
      var field = sort[index].substr(1);
      query += field;
      if (direction == "-")
      query += " DESC,";
      else
      query += " ASC,";
  }
  query = query.slice(0, -1);
  }
  if ("limit" in req.query) {
  query += " LIMIT " + req.query["limit"];
  if ("offset" in req.query) {
  query += " OFFSET " + req.query["offset"];
  }
  }
  //console.log(query);
  db.query(query, function(err, result, fields) {
  if (err) throw err;
  res.send(JSON.stringify(result));
  });
});
app.get('/staff/:id', function(req, res) {
  var id = req.params.id;
  var query ="SELECT * FROM staff where staff.id=" + id ;
  if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
  db.query(query, function(err, result, fields) {
  if (err) throw err;
  res.send(JSON.stringify(result));
  });
});
app.post('/staff/', function(req, res) {
  /*var name = req.body.name;
  var breed = req.body.breed;
  var dailyfood = req.body.dailyfood;
  var birthday = req.body.birthday;
  var entry = req.body.entry;
  var cage = req.body.cage;*/
  var values =") VALUES('";
  var query = "INSERT INTO staff (";
  var conditions = ["id", "lastname","firstname","wage"];
  for (var index in conditions) {
      if (conditions[index] in req.body) {
          query += conditions[index] + ",";
          values += req.body[conditions[index]] + "','";
      }
  }
  values = values.slice(0, -2);
  values += ")"
  query = query.slice(0,-1);
  query += values;
  db.query(query, function(err, result, fields) {
    if (err) throw err;
      db.query("SELECT * FROM staff ", function(err, result, fields) {
        if (err) throw err;
        var response = { "page": "staff", "result": result };
        res.send(JSON.stringify(response));
    });
  });
});
app.put('/staff/:id', function(req, res) {
  var id = req.params.id;
  var query="update staff set";
  var conditions = ["lastname","firstname","wage"];
  for (var index in conditions) {
      if (conditions[index] in req.body) {
          query += " " + conditions[index] + "='" + req.body[conditions[index]] + "',";
      }
  }
  query = query.slice(0, -1);
  query +=  " where staff.id=" + id;
  db.query(query , function(err, result, fields) {
  if (err) throw err;
  res.send(JSON.stringify(result));
  });
});
app.delete('/staff', function(req, res) {
  var query = "DELETE from staff" ;
  db.query(query, function(err, result, fields) {
  if (err) throw err;
  var response= "All the staff have been supressed";
  res.send(JSON.stringify(response));
});
});
app.delete('/staff/:id', function(req, res) {
  var id = req.params.id;
  var query = "Delete from staff where staff.id='" +id+"'" ;
  db.query(query, function(err, result, fields) {
  if (err) throw err;
  var response= "The staff indentified whith id="+id+" has been supressed from database";
  res.send(JSON.stringify(response));
});
});

/////////////////////////////////////
///// routes for remaining food /////
/////////////////////////////////////

app.get('/food-stats', function(req, res) {
  db.query("SELECT animals.id,(case when animals.food_per_day =0 then 0 else (food.quantity/animals.food_per_day)end) as days_left FROM food join animals on animals.id=food.id_animal", function(err, result, fields) {
  if (err) throw err;
  res.send(JSON.stringify(result));
  });
});

/////////////////////////////////////
/////       relationships       /////
/////////////////////////////////////

app.get('/animals/:id/cages', function(req, res) {
var id = req.params.id;
var query = "SELECT cages.* FROM cages JOIN animals ON cages.id = animals.id_cage where animals.id=" + id + " ";
if ("fields" in req.query) {
query = query.replace("cages.*", "cages." + req.query["fields"]);
}
var conditions = ["id", "breed","id_cage","food_per_day","name","birthday","entry_date","description","area"];
for (var index in conditions) {
  if (conditions[index] in req.query) {
      query += " AND";
      query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
  }
}
  if ("limit" in req.query) {
  query += " LIMIT " + req.query["limit"];
  if ("offset" in req.query) {
  query += " OFFSET " + req.query["offset"];
  }
  }
console.log(query);
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});
app.get('/animals/:id/cages/:id_cage', function(req, res) {
var id = req.params.id;
var id_cage = req.params.id_cage;
var query = "SELECT cages.* FROM cages JOIN animals ON cages.id = animals.id_cage where animals.id=" + id + " AND cages.id=" +id_cage +" ";
if ("fields" in req.query) {
query = query.replace("*", req.query["fields"]);
}
var conditions = ["id", "breed","id_cage","food_per_day","name","birthday","entry_date","description","area"];
for (var index in conditions) {
  if (conditions[index] in req.query) {
      query += " AND";
      query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
  }
}
//console.log(query);
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});

app.get('/cages/:id/animals', function(req, res) {
var id = req.params.id;
var query = "SELECT animals.* FROM cages JOIN animals ON cages.id = animals.id_cage where cages.id=" + id + " ";
if ("fields" in req.query) {
query = query.replace("animals.*", "animals." + req.query["fields"]);
}
var conditions = ["id", "breed","id_cage","food_per_day","name","birthday","entry_date","description","area"];
for (var index in conditions) {
  if (conditions[index] in req.query) {
      query += " AND";
      query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
  }
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
app.get('/cages/:id/animals/:id_animal', function(req, res) {
var id = req.params.id;
var id_animal = req.params.id_animal;
var query = "SELECT animals.* FROM cages JOIN animals ON cages.id = animals.id_cage where cages.id=" + id + " AND animals.id=" +id_animal +" ";
if ("fields" in req.query) {
query = query.replace("animals.*", "animals." + req.query["fields"]);
}
var conditions = ["id", "breed","id_cage","food_per_day","name","birthday","entry_date","description","area"];
for (var index in conditions) {
  if (conditions[index] in req.query) {
      query += " AND";
      query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
  }
}
//console.log(query);
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});

app.get('/food/:id/animals', function(req, res) {
var id = req.params.id;
var query = "SELECT animals.* FROM food JOIN animals ON food.id_animal = animals.id where food.id=" + id + " ";
if ("fields" in req.query) {
query = query.replace("animals.*", "animals." + req.query["fields"]);
}
var conditions = ["id", "breed","id_cage","food_per_day","name","quantity","id_animal"];
for (var index in conditions) {
  if (conditions[index] in req.query) {
      query += " AND";
      query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
  }
}
  if ("limit" in req.query) {
  query += " LIMIT " + req.query["limit"];
  if ("offset" in req.query) {
  query += " OFFSET " + req.query["offset"];
  }
  }
console.log(query);
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});
app.get('/food/:id/animals/:id_animal', function(req, res) {
var id = req.params.id;
var id_animal = req.params.id_animal;
var query = "SELECT animals.* FROM food JOIN animals ON food.id_animal = animals.id where food.id=" + id + "  AND animals.id=" +id_animal +" ";
if ("fields" in req.query) {
query = query.replace("animals.*", "animals." + req.query["fields"]);
}
var conditions = ["id", "breed","id_cage","food_per_day","name","quantity","id_animal"];
for (var index in conditions) {
  if (conditions[index] in req.query) {
      query += " AND";
      query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
  }
}
//console.log(query);
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});

app.get('/animals/:id/food', function(req, res) {
var id = req.params.id;
var query = "SELECT food.* FROM food JOIN animals ON food.id_animal = animals.id where animals.id=" + id + " ";
if ("fields" in req.query) {
query = query.replace("food.*", "food." + req.query["fields"]);
}
var conditions = ["id", "breed","id_cage","food_per_day","name","quantity","id_animal"];
for (var index in conditions) {
  if (conditions[index] in req.query) {
      query += " AND";
      query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
  }
}
  if ("limit" in req.query) {
  query += " LIMIT " + req.query["limit"];
  if ("offset" in req.query) {
  query += " OFFSET " + req.query["offset"];
  }
  }
console.log(query);
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});
app.get('/animals/:id/food/:id_food', function(req, res) {
var id = req.params.id;
var id_food = req.params.id_food;
var query = "SELECT food.* FROM food JOIN animals ON food.id_animal = animals.id where animals.id=" + id + "  AND food.id=" +id_food +" ";
if ("fields" in req.query) {
query = query.replace("food.*", "food." + req.query["fields"]);
}
var conditions = ["id", "breed","id_cage","food_per_day","name","quantity","id_animal"];
for (var index in conditions) {
  if (conditions[index] in req.query) {
      query += " AND";
      query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
  }
}
//console.log(query);
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});

/////////////////////////
///// END OF ROUTES /////
/////////////////////////

app.listen(3000, function() {
console.log('Project zoo listening on port 3000!');
});
