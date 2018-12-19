const express = require ('express');
const mysql = require ('mysql');
const bodyParser =require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

var db= mysql.createConnection({
  host:"localhost",
  user: "root",
  password:"root",
  database:"project",
  port:"3306"
});

// Firewall
app.use(function(req, res, next){
    if ("key" in req.query)
    {
        var key = req.query["key"];
        var query = "SELECT apikey FROM users WHERE apikey = '"+key+"'";
        db.query(query, function(err, result, fields)
        {
        if (err) throw err;
        if (result.length > 0)
        {
            next();
        }
        else
        {
            res.status(403).send();
        }
        });
    }
    else
    {
        res.status(403).send();
    }
});


// animals
app.delete('/animals', function(req,res){
  var query="DELETE FROM animals";
  db.query(query,function(err,results,fields){
    if (err) throw err;
    res.send(JSON.stringify("Success"));
});
});
app.delete('/animals/:id', function(req,res){
  var id = req.params.id;
  var query="DELETE FROM animals WHERE id=" + id;
  db.query(query,function(err,results,fields){
    if (err) throw err;
    res.send(JSON.stringify("Success"));
});
});
app.post('/animals',function(req,res){
  var name= req.body.name;
  var breed= req.body.breed;
  var food_per_day= req.body.food_per_day;
  var birthday= req.body.birthday;
  var entry_date= req.body.entry_date;
  var id_cage= req.body.id_cage;
  var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('"+name+"','"+breed+"','"+food_per_day+"','"+birthday+"','"+entry_date+"','"+id_cage+"')";

  db.query(query, function(err, result, fields){
    if(err) throw err;
  res.send(JSON.stringify("Success"));
});
});
app.get('/animals',function(req,res){
  var query="SELECT * FROM animals";
  var conditions= ["name", "breed","food_per_day","birthday","entry_date","id_cage"];


      for(var index in conditions){
          if(conditions[index] in req.query){
              if(query.indexOf("where")<0){
                  query += " where";
              } else {
                  query += " and";
              }

              query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
          }
      }

      if("sort" in req.query){
          var sort = req.query["sort"].split(",");
          query += " order by";

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

      if("fields" in req.query){
          query=query.replace("*", req.query["fields"]);
      }

      if ("limit" in req.query){
          query += " LIMIT " + req.query["limit"];
          if ("offset" in req.query){
              query += " OFFSET " + req.query["offset"];
          }
      }


  db.query(query,function(err,result,fields)
{
  if(err) throw err; res.send(JSON.stringify(result));

});
});
app.get('/animals/:id',function(req,res){
  var id= req.params.id;
  var query="SELECT * FROM animals WHERE id=" +id;
  var conditions= ["name", "breed","food_per_day","birthday","entry_date","id_cage"];


      for(var index in conditions){
          if(conditions[index] in req.query){
              if(query.indexOf("where")<0){
                  query += " where";
              } else {
                  query += " and";
              }

              query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
          }
      }

      if("sort" in req.query){
          var sort = req.query["sort"].split(",");
          query += " order by";

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

      if("fields" in req.query){
          query=query.replace("*", req.query["fields"]);
      }

      if ("limit" in req.query){
          query += " LIMIT " + req.query["limit"];
          if ("offset" in req.query){
              query += " OFFSET " + req.query["offset"];
          }
      }


  db.query(query,function(err,result,fields)
{
  if(err) throw err; res.send(JSON.stringify(result));

});
});
app.put('/animals/:id', function(req, res) {
    var query = "update animals";
    var id = req.params.id;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    for(var index in conditions){
        if(conditions[index] in req.body){
            if(query.indexOf("set")<0){
                query += " set";
            } else {
                query += ", ";
            }

            query += " "+conditions[index]+" = '"+req.body[conditions[index]]+"'";
        }
    }

    query += " where id = "+id;
    db.query(query, function(err, result, fields){
        console.log(query);
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//cages
app.delete('/cages', function(req,res){
  var query="DELETE FROM cages";
  db.query(query,function(err,results,fields){
    if (err) throw err;
    res.send(JSON.stringify("Success"));
});
});
app.delete('/cages/:id', function(req,res){
  var id = req.params.id;
  var query="DELETE FROM cages WHERE id=" + id;
  db.query(query,function(err,results,fields){
    if (err) throw err;
    res.send(JSON.stringify("Success"));
});
});
app.post('/cages', function(req, res){
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    var query = "insert into cages(name, description, area) values('"+name+"', '"+description+"', '"+area+"')";
    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/cages', function(req, res){
    var query = "select * from cages";
    var conditions = ["name", "description", "area"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " order by";

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

    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "select * from cages where id ="+id;
    var conditions = ["name", "description", "area"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " order by";

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

    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.put('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "update cages";
    var conditions = ["name", "description", "area"];

    for(var index in conditions){
        if(conditions[index] in req.body){
            if(query.indexOf("set")<0){
                query += " set";
            } else {
                query += ", ";
            }

            query += " "+conditions[index]+" = '"+req.body[conditions[index]]+"'";
        }
    }

    query += " where id = "+id;
    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//food
app.delete('/food', function(req, res){
    var query = "delete from food";
    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.delete('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "delete from food where id ="+id;
    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.post('/food', function(req, res){
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    var query = "insert into food(name, quantity, id_animal) values('"+name+"', '"+quantity+"', '"+id_animal+"')";
    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/food', function(req, res){
    var query = "select * from food";
    var conditions = ["name", "quantity", "id_animal"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " order by";

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

    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "select * from food where id ="+id;
    var conditions = ["name", "quantity", "id_animal"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " order by";

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

    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.put('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "update food";
    var conditions = ["name", "quantity", "id_animal"];

    for(var index in conditions){
        if(conditions[index] in req.body){
            if(query.indexOf("set")<0){
                query += " set";
            } else {
                query += ", ";
            }

            query += " "+conditions[index]+" = '"+req.body[conditions[index]]+"'";
        }
    }

    query += " where id = "+id;
    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


// staff
app.delete('/staff', function(req, res){
    var query = "delete from staff";
    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.delete('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "delete from staff where id ="+id;
    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.post('/staff', function(req, res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    var query = "insert into staff(firstname, lastname, wage) values('"+firstname+"', '"+lastname+"', '"+wage+"')";
    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/staff', function(req, res){
    var query = "select * from staff";
    var conditions = ["firstname", "lastname", "wage"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " order by";

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

    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "select * from staff where id ="+id;
    var conditions = ["firstname", "lastname", "wage"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " "+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    if("sort" in req.query){
        var sort = req.query["sort"].split(",");
        query += " order by";

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

    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.put('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "update staff";
    var conditions = ["firstname", "lastname", "wage"];

    for(var index in conditions){
        if(conditions[index] in req.body){
            if(query.indexOf("set")<0){
                query += " set";
            } else {
                query += ", ";
            }

            query += " "+conditions[index]+" = '"+req.body[conditions[index]]+"'";
        }
    }

    query += " where id = "+id;
    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


// relation queries
app.get('/animals/:id_animals/cages', function(req, res) {
    var id_animals = req.params.id_animals;
    var query = "select cages.* from animals join cages on cages.id = animals.id_cage where animals.id="+id_animals;
    var conditions = ["name", "description", "area"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " cages."+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/food/:id_food/animals', function(req, res) {
    var id_food = req.params.id_food;
    var query = "select animals.* from food join animals on food.id_animal = animals.id where food.id= "+id_food;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " animals."+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/food/:id_food/animals/:id_animals', function(req, res) {
    var id_food = req.params.id_food;
    var id_animals = req.params.id_animals;
    var query = "select animals.* from food join animals on food.id_animal = animals.id where food.id= '"+id_food+"' and animals.id= "+id_animals;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " animals."+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/animals/:id_animals/food', function(req, res) {
    var id_animals = req.params.id_animals;
    var query = "select food.* from animals join food on animals.id = food.id_animal where animals.id= "+id_animals;
    var conditions = ["name", "quantity", "id_animal"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " food."+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    database.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/animals/:id_animals/cages/:id_cages', function(req, res) {
    var id_animals = req.params.id_animals;
    var id_cages = req.params.id_cages;
    var query = "select cages.* from animals join cages on cages.id = animals.id_cage where animals.id= '"+id_animals+"' and cages.id= "+id_cages;
    var conditions = ["name", "description", "area"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " cages."+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/cages/:id_cages/animals', function(req, res) {
    var id_cages = req.params.id_cages;
    var query = "select animals.* from cages join animals on animals.id_cage=cages.id where cages.id= "+id_cages;
    var conditions = ["name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];

    for(var index in conditions){
        if(conditions[index] in req.query){
            if(query.indexOf("where")<0){
                query += " where";
            } else {
                query += " and";
            }

            query += " animals."+conditions[index]+" = '"+req.query[conditions[index]]+"'";
        }
    }

    if("fields" in req.query){
        query=query.replace("*", req.query["fields"]);
    }

    if ("limit" in req.query){
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query){
            query += " OFFSET " + req.query["offset"];
        }
    }

    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/food-stats', function(req, res) {
    var id = req.params.id;
    var query = "select distinct a.id as 'id', COALESCE(floor(dayL.dayLeft), 0) as 'days_left' from animals a natural join (select a1.id, (f.quantity / a1.food_per_day) as dayLeft from animals a1 join food f on a1.id = f.id_animal) as dayL";
    db.query(query, function(err, result, fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


// App listening
app.listen(3000,function(){
  /*db.connect(function(err){
    if(err) throw err;
    console.log('Connection to database successful!');
  });*/

  console.log('Example app listening on port 3000');

});
