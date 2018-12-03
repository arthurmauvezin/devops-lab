const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
//petit pare feu
app.use(function(req, res, next) {
  //on recherche la clé dans la requete (pas crypté mais on avait pas le budget)
  if ("key" in req.query) {
    var key = req.query["key"];
    //on recherche la clé correspondante dans la bdd
    var query = "SELECT * FROM users WHERE apikey='" + key + "'";
    db.query(query, function(err, result, fields) {
    if (err) throw err;
    //si les deux clés sont un match on peut continuer
    if (result.length > 0) {
      next();
    }
    else {
      //sinon impossible de se connecter
      res.status(403).send("You're not taking over my zoo filthy pirates");
    }
    });
  } else {
    //de meme on ne peut se connecter s'il n'y a pas de clé
    res.status(403).send("You're not taking over my zoo filthy pirates");
  }
});

//on établis la connection
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "zoo"
});


app.listen(3000, function() {
  console.log('connection établis');
});
//fonction get pour les animaux (je précise que je ne vais pas commenter tous les get/post/put/delete, c'est tout le temps la meme chose)
app.get('/animals', function(req, res) {
  //la query SQL
  var query = "SELECT * FROM animals"
  var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
  //on appelle la fonction de filtrage
  query = filtrage(req,query,conditions);
  //on écécute la query et renvoie le resultat si tout se passe bien
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
//get pour un seul animal
app.get('/animals/:id(\\d+)', function(req, res) {
  var id = req.params.id;
  var query = "SELECT * FROM animals WHERE id="+id;
  var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
  query = filtrage(req,query,conditions);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
//insertion d'un animal, rien de spécial
app.post('/animals', function(req, res) {
  //les paramètres
  var name = req.body.name;
  var breed = req.body.breed;
  var food_per_day = req.body.food_per_day;
  var birthday = req.body.birthday;
  var entry_date = req.body.entry_date;
  var id_cage = req.body.id_cage;
  var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('" + name + "','" + breed + "','" + food_per_day + "','" + birthday + "','" + entry_date + "','" + id_cage + "')";
  db.query(query, function(err, result, fields) {
      if (err) throw err;
      res.send(JSON.stringify("Success"));
  });

});
//update d'un animal
 app.put('/animals/:id(\\d+)', function(req, res) {
  var id = req.params.id;
  var name = req.body.name;
  var breed = req.body.breed;
  var food_per_day = req.body.food_per_day;
  var birthday = req.body.birthday;
  var entry_date = req.body.entry_date;
  var id_cage = req.body.id_cage;
  //on change la query selon les paramètres afin de pouvoir faire une update partielle
  var query = "UPDATE animals SET"
  if (name)
  {
    query+=" name = '" + name + "',";
  }
  if (breed)
  {
    query+=" breed = '" + breed + "',";
  }
  if (food_per_day)
  {
    query+=" food_per_day = '" + food_per_day + "',";
  }
  if (birthday)
  {
    query+=" birthday = '" + birthday + "',";
  }
  if (entry_date)
  {
    query+=" entry_date = '" + entry_date + "',";
  }
  if (id_cage)
  {
    query+=" id_cage = '" + id_cage + "',";
  }
  //on vire la virgule à la fin
  query=query.replace(/,\s*$/, "");
  query+=" WHERE id= "+ id;
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
  });
});
//supprimer un animal
app.delete('/animals/:id(\\d+)', function(req, res) {
  var id = req.params.id;
  var query = "DELETE FROM animals WHERE id=" + id;
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
  });
});
//supprimer tous les animaux
app.delete('/animals/', function(req, res) {
  var id = req.params.id;
  var query = "DELETE FROM animals";
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
  });
});
//bis repetitas avec les cages
app.get('/cages', function(req, res) {
  var query = "SELECT * FROM cages"
  var conditions = ["name", "description","area"];
  query = filtrage(req,query,conditions);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });

});


app.get('/cages/:id(\\d+)', function(req, res) {
  var id = req.params.id;
  var query = "SELECT * FROM cages WHERE id="+id;
  var conditions = ["name", "description","area"];
  query = filtrage(req,query,conditions);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));

  });

});

app.post('/cages', function(req, res) {
  var name = req.body.name;
  var description = req.body.description;
  var area = req.body.area;
  var query = "INSERT INTO cages (name,description,area) VALUES ('" + name + "','" + description + "','" + area + "')";
  db.query(query, function(err, result, fields) {
      if (err) throw err;
      res.send(JSON.stringify("Success"));
  });


});
app.put('/cages/:id(\\d+)', function(req, res) {
  var id = req.params.id;
  var name = req.body.name;
  var description = req.body.description;
  var area = req.body.area;
  var query = "UPDATE cages SET"
  if (name)
  {
    query+=" name = '" + name + "',";
  }
  if (description)
  {
    query+=" description = '" + description + "',";
  }
  if (area)
  {
    query+=" area = '" + area + "',";
  }
  query=query.replace(/,\s*$/, "");
  query+=" WHERE id= "+ id;
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
  });

});
app.delete('/cages/:id(\\d+)', function(req, res) {
  var id = req.params.id;
  var query = "DELETE FROM cages WHERE id=" + id;
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
  });
});
app.delete('/cages/', function(req, res) {
  var id = req.params.id;
  var query = "DELETE FROM cages";
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
  });
});
//de meme avec la nourriture
app.get('/food', function(req, res) {
  var query = "SELECT * FROM food"
  var conditions = ["name", "quantity","id_animal"];
  query = filtrage(req,query,conditions);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });

});
app.get('/food/:id(\\d+)', function(req, res) {
  var id = req.params.id;
  var query = "SELECT * FROM food WHERE id="+id;
  var conditions = ["name", "quantity","id_animal"];
  query = filtrage(req,query,conditions);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.post('/food', function(req, res) {
  var name = req.body.name;
  var quantity = req.body.quantity;
  var id_animal = req.body.id_animal;
  var query = "INSERT INTO food (name,quantity,id_animal) VALUES ('" + name + "','" + quantity + "','" + id_animal + "')";
  db.query(query, function(err, result, fields) {
      if (err) throw err;
      res.send(JSON.stringify("Success"));
  });
});
app.put('/food/:id(\\d+)', function(req, res) {
  var id = req.params.id;
  var name = req.body.name;
  var quantity = req.body.quantity;
  var id_animal = req.body.id_animal;
  var query = "UPDATE food SET"
  if (name)
  {
    query+=" name = '" + name + "',";
  }
  if (quantity)
  {
    query+=" quantity = '" + quantity + "',";
  }
  if (id_animal)
  {
    query+=" id_animal = '" + id_animal + "',";
  }
  query=query.replace(/,\s*$/, "");
  query+=" WHERE id= "+ id;
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
  });

});
app.delete('/food/:id(\\d+)', function(req, res) {
  var id = req.params.id;
  var query = "DELETE FROM food WHERE id=" + id;
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
  });
});
app.delete('/food/', function(req, res) {
  var id = req.params.id;
  var query = "DELETE FROM food";
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
  });
});
//meme chose avec le staff zzzzzzzz
app.get('/staff', function(req, res) {
  var query = "SELECT * FROM staff"
  var conditions = ["firstname", "lastname","wage"];
  query = filtrage(req,query,conditions);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.get('/staff/:id(\\d+)', function(req, res) {
  var id = req.params.id;
  var query = "SELECT * FROM staff WHERE id="+id;
  var conditions = ["firstname", "lastname","wage"];
  query = filtrage(req,query,conditions);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.post('/staff', function(req, res) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var wage = req.body.wage;
  var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('" + firstname + "','" + lastname + "','" + wage + "')";
  db.query(query, function(err, result, fields) {
      if (err) throw err;
      res.send(JSON.stringify("Success"));
  });

});
app.put('/staff/:id(\\d+)', function(req, res) {
  var id = req.params.id;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var wage = req.body.wage;
  var query = "UPDATE staff SET"
  if (firstname)
  {
    query+=" firstname = '" + firstname + "',";
  }
  if (lastname)
  {
    query+=" lastname = '" + lastname + "',";
  }
  if (wage)
  {
    query+=" wage = '" + wage + "',";
  }
  query=query.replace(/,\s*$/, "");
  query+=" WHERE id= "+ id;
  //var query = "UPDATE staff SET firstname = '" + firstname + "', lastname = '"+lastname+"',wage='"+wage+"' WHERE id= "+ id;
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
  });

});
app.delete('/staff/:id(\\d+)', function(req, res) {
  var id = req.params.id;
  var query = "DELETE FROM staff WHERE id=" + id;
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
  });
});
app.delete('/staff/', function(req, res) {
  var id = req.params.id;
  var query = "DELETE FROM staff";
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
  });
});
//on accède aux cages via les animaux
app.get('/animals/:id/cages', function(req, res) {
  var id = req.params.id;
  //petit join classique (merci mr busca)
  var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;
  var conditions = ["name", "description","area"];
  //on oublie pas le filtrage
  query = filtrage(req,query,conditions);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.get('/animals/:id_animals/cages/:id_cages', function(req, res) {
  var id_animals = req.params.id_animals;
  var id_cages = req.params.id_cages;
  var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id= " + id_animals + " AND cages.id=" +   id_cages;
  var conditions = ["name", "description","area"];
  query = filtrage(req,query,conditions);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
//meme chose des cages aux animaux
app.get('/cages/:id/animals', function(req, res) {
  var id = req.params.id;
  var query = "SELECT animals.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id=" + id;
  var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
  query = filtrage(req,query,conditions);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.get('/cages/:id_cages/animals/:id_animals', function(req, res) {
  var id_animals = req.params.id_animals;
  var id_cages = req.params.id_cages;
  var query = "SELECT animals.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id= " + id_animals + " AND cages.id=" +   id_cages;
  var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
  query = filtrage(req,query,conditions);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.get('/food/:id/animals', function(req, res) {
  var id = req.params.id;
  var query = "SELECT animals.* FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE food.id=" + id;
  var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
  query = filtrage(req,query,conditions);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.get('/food/:id_food/animals/:id_animals', function(req, res) {
  var id_animals = req.params.id_animals;
  var id_food = req.params.id_food;
  var query = "SELECT animals.* FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE animals.id= " + id_animals + " AND food.id=" +   id_food;
  var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
  query = filtrage(req,query,conditions);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.get('/animals/:id/food', function(req, res) {
  var id = req.params.id;
  var query = "SELECT food.*  FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE animals.id=" + id;
  var conditions = ["name", "quantity","id_animal"];
  query = filtrage(req,query,conditions);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.get('/animals/:id_animals/food/:id_food', function(req, res) {
  var id_animals = req.params.id_animals;
  var id_food = req.params.id_food;
  var query = "SELECT food.* WHERE animals.id= " + id_animals + " AND food.id=" +   id_food;
  var conditions = ["name", "quantity","id_animal"];
  query = filtrage(req,query,conditions);
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
//on surveille le temps qu'il reste avant que les animaux meurent de fin
app.get('/food-stats',function(req,res){
  //on prends les données qui nous seront utiles pour calculerles jours restants
  var query = "SELECT animals.id,animals.food_per_day,sum(food.quantity) as somme FROM animals,food WHERE animals.id=food.id_animal GROUP BY animals.id"
  db.query(query, function(err, result, fields) {
    if (err) throw err;
    //id animaux
   var key=new Array(result.length);
   //jours restants
   var days_left=new Array(result.length);
   var realresult=new Array;
    for (var i=0;i<result.length;i++)
    {
      //on blinde (sacré quentin !)
      if(result[i].food_per_day!=0)
      {
        key[i]=result[i].id;
        //division niveau primaire
        days_left[i]=result[i].somme/result[i].food_per_day;
      }
      //on mets tout ça dans un seul objet comme demandé
      realresult.push({"id" :key[i],"days_left": days_left[i]});
    }
    //on envoie le résultat
     res.send(realresult);
  });
});
function filtrage(req,query,conditions)
{
  //conditions
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
//sorting
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
  //fields
  if ("fields" in req.query) {
    query = query.replace("*", req.query["fields"]);
  }
  //pagination
  if ("limit" in req.query) {
    query += " LIMIT " + req.query["limit"];
    if ("offset" in req.query) {
      query += " OFFSET " + req.query["offset"];
    }
  }
  //on retourne la requete modifié
return query;
}
