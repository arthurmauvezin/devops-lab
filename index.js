//require is used to get the modules
const express = require ( 'express' );
const mysql = require ( 'mysql' );
const bodyParser = require ( 'body-parser' );
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//we connect to the database zoo
const db = mysql.createConnection({
  host: "localhost" ,
  user: "root" ,
  password: "" ,
  database: "zoo" ,
  port: "3306"
});


//the Firewall
//pp.use, this function is executed for every route
app.use( function (req, res, next) {
  if ( "key" in req.query) {

    //we get the filters
    let apikey = req.query[ "key" ];

    //we create the query
    let query = "SELECT * FROM users WHERE apikey='" + apikey + "'" ;

    // console.log(JSON.stringify(query));
    // console.log(JSON.stringify(req.query));

    db.query(query, function (err, result, fields) {
      if (err) throw err;
      //if there is at least one user corresponding to this apikey, we go to next function
      if (result.length > 0 ) {
        next();
      }
      //if there is no user with this apikay, we throw a 403 http error and deny the access
      else {
        res.status(403);
        res.send( "Access denied" );
      }
    });
    //is there is no apikay at tall, we also deny the access
  } else {
    res.status(403);
    res.send( "Access denied" );
  }
});

//function used to create animal
app.post( '/animals' , function (req, res) {

  //we get all the parameters from the 'body' in order to insert an new row
  let name = req.body.name;
  let breed = req.body.breed;
  let food_per_day = req.body.food_per_day;
  let birthday = req.body.birthday;
  let entry_date = req.body.entry_date;
  let id_cage = req.body.id_cage;

  let query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) ";

  //we add the parameters to the query
  query += "VALUES ('" + name + "', '" + breed + "', '" + food_per_day + "', '" + birthday + "', '" + entry_date + "', '" + id_cage + "')" ;
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify( "Success" ));
    //console.log(JSON.stringify(query));
  });
});

app.post( '/cages' , function (req, res) {
  let name = req.body.name;
  let description = req.body.description;
  let area = req.body.area;

  let query = "INSERT INTO cages (name, description, area) ";
  query += "VALUES ('" + name + "', '" + description + "', '" + area + "')" ;
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify( "Success" ));
    //console.log(JSON.stringify(query));
  });
});

app.post( '/food' , function (req, res) {
  let name = req.body.name;
  let quantity = req.body.quantity;
  let id_animal = req.body.id_animal;

  let query = "INSERT INTO food (name, quantity, id_animal) ";
  query += "VALUES ('" + name + "', '" + quantity + "', '" + id_animal + "')" ;
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify( "Success" ));
    //console.log(JSON.stringify(query));
  });
});

app.post( '/staff' , function (req, res) {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let wage = req.body.wage;

  let query = "INSERT INTO staff (firstname, lastname, wage) ";
  query += "VALUES ('" + firstname + "', '" + lastname + "', '" + wage + "')" ;
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify( "Success" ));
    //console.log(JSON.stringify(query));
  });
});

//function used to print all the animals
app.get( '/animals' , function (req, res) {
  //we create the query
  let query = "SELECT * FROM animals"

  //if the user specifies the fiels he wants, we replace the tables SELECTED in the query
  if ( "fields" in req.query) {
    query = query.replace( "*" , req.query[ "fields" ]);
  }

  //if the user specifies the limit of results
  if ( "limit" in req.query) {
    query += " LIMIT " + req.query[ "limit" ];
    if ( "offset" in req.query) {
      query += " OFFSET " + req.query[ "offset" ];
    }
  }

  //if the user asks for a special order
  if ( "sort" in req.query) {
    var sort = req.query[ "sort" ].split( "," );
    query += " ORDER BY" ;
    for ( var index in sort) {
      var direction = sort[index].substr( 0 , 1 );
      var field = sort[index].substr( 1 );
      query += " " + field;
      if (direction == "-" )
      query += " DESC," ;
      else
      query += " ASC," ;
    }
    query = query.slice( 0 , -1 );
  }

  //the possible columns for this table
  let columns = [ "id" , "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];

  //we check all the paremeter in the req.query and add them to the query we make
  for ( let index in columns) {
    if (columns[index] in req.query) {
      if (query.indexOf( "WHERE" ) < 0 ) {
        query += " WHERE" ;
      } else {
        query += " AND" ;
      }
      query += " " + columns[index] + "='" +
      req.query[columns[index]] + "'" ;
    }
  }

  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify(result));
  });
});

//function used to print one particular animal using its id number
app.get( '/animals/:id' , function (req, res) {
  //we get the id directly from the route
  let id = req.params.id;

  let query = "SELECT * FROM animals WHERE id=" + id;

  if ( "fields" in req.query) {
    query = query.replace( "*" , req.query[ "fields" ]);
  }

  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify(result));
  });
});

//function used to print the relationship between animals and cages
app.get( '/cages/:id/animals' , function (req, res) {
  var id = req.params.id;

  var query = "SELECT animals.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id=" + id;

  if ( "fields" in req.query) {
    query = query.replace( "*" , req.query[ "fields" ]);
  }

  if ( "limit" in req.query) {
    query += " LIMIT " + req.query[ "limit" ];
    if ( "offset" in req.query) {
      query += " OFFSET " + req.query[ "offset" ];
    }
  }

  let columns = [ "id" , "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];

  for ( let index in columns) {
    if (columns[index] in req.query) {
      if (query.indexOf( "WHERE" ) < 0 ) {
        query += " WHERE" ;
      } else {
        query += " AND" ;
      }
      query += " " + columns[index] + "='" +
      req.query[columns[index]] + "'" ;
    }
  }

  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify(result));
  });
});

app.get( '/animals/:id/cages' , function (req, res) {
  var id = req.params.id;

  var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;

  if ( "fields" in req.query) {
    query = query.replace( "*" , req.query[ "fields" ]);
  }

  if ( "limit" in req.query) {
    query += " LIMIT " + req.query[ "limit" ];
    if ( "offset" in req.query) {
      query += " OFFSET " + req.query[ "offset" ];
    }
  }

  let columns = [ "id" , "name", "description", "area"];

  for ( let index in columns) {
    if (columns[index] in req.query) {
      if (query.indexOf( "WHERE" ) < 0 ) {
        query += " WHERE" ;
      } else {
        query += " AND" ;
      }
      query += " " + columns[index] + "='" +
      req.query[columns[index]] + "'" ;
    }
  }

  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify(result));
  });
});

app.get( '/animals/:id_animals/cages/:id_cages' , function (req, res) {
  var id_animals = req.params.id_animals;
  var id_cages = req.params.id_cages;

  var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animals + " AND cages.id=" + id_cages;

  if ( "fields" in req.query) {
    query = query.replace( "*" , req.query[ "fields" ]);
  }

  if ( "limit" in req.query) {
    query += " LIMIT " + req.query[ "limit" ];
    if ( "offset" in req.query) {
      query += " OFFSET " + req.query[ "offset" ];
    }
  }

  let columns = [ "id" , "name", "description", "area"];

  for ( let index in columns) {
    if (columns[index] in req.query) {
      if (query.indexOf( "WHERE" ) < 0 ) {
        query += " WHERE" ;
      } else {
        query += " AND" ;
      }
      query += " " + columns[index] + "='" +
      req.query[columns[index]] + "'" ;
    }
  }

  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify(result));
  });
});

app.get( '/cages' , function (req, res) {
  let query = "SELECT * FROM cages"

  if ( "fields" in req.query) {
    query = query.replace( "*" , req.query[ "fields" ]);
  }

  if ( "limit" in req.query) {
    query += " LIMIT " + req.query[ "limit" ];
    if ( "offset" in req.query) {
      query += " OFFSET " + req.query[ "offset" ];
    }
  }

  if ( "sort" in req.query) {
    var sort = req.query[ "sort" ].split( "," );
    query += " ORDER BY" ;
    for ( var index in sort) {
      var direction = sort[index].substr( 0 , 1 );
      var field = sort[index].substr( 1 );
      query += " " + field;
      if (direction == "-" )
      query += " DESC," ;
      else
      query += " ASC," ;
    }
    query = query.slice( 0 , -1 );
  }

  let columns = [ "id" , "name", "description", "area"];

  for ( let index in columns) {
    if (columns[index] in req.query) {
      if (query.indexOf( "WHERE" ) < 0 ) {
        query += " WHERE" ;
      } else {
        query += " AND" ;
      }
      query += " " + columns[index] + "='" +
      req.query[columns[index]] + "'" ;
    }
  }

  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify(result));
  });
});

app.get( '/cages/:id' , function (req, res) {
  let id = req.params.id;

  let query = "SELECT * FROM cages WHERE id=" + id;

  if ( "fields" in req.query) {
    query = query.replace( "*" , req.query[ "fields" ]);
  }
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify(result));
  });
});

app.get( '/food' , function (req, res) {
  let query = "SELECT * FROM food";

  if ( "fields" in req.query) {
    query = query.replace( "*" , req.query[ "fields" ]);
  }

  if ( "limit" in req.query) {
    query += " LIMIT " + req.query[ "limit" ];
    if ( "offset" in req.query) {
      query += " OFFSET " + req.query[ "offset" ];
    }
  }

  if ( "sort" in req.query) {
    var sort = req.query[ "sort" ].split( "," );
    query += " ORDER BY" ;
    for ( var index in sort) {
      var direction = sort[index].substr( 0 , 1 );
      var field = sort[index].substr( 1 );
      query += " " + field;
      if (direction == "-" )
      query += " DESC," ;
      else
      query += " ASC," ;
    }
    query = query.slice( 0 , -1 );
  }

  let columns = [ "id" , "name", "quantity", "id_animal"];

  for ( let index in columns) {
    if (columns[index] in req.query) {
      if (query.indexOf( "WHERE" ) < 0 ) {
        query += " WHERE" ;
      } else {
        query += " AND" ;
      }
      query += " " + columns[index] + "='" +
      req.query[columns[index]] + "'" ;
    }
  }

  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify(result));
  });
});

app.get( '/food/:id' , function (req, res) {
  let id = req.params.id;

  let query = "SELECT * FROM food WHERE id=" + id;

  if ( "fields" in req.query) {
    query = query.replace( "*" , req.query[ "fields" ]);
  }
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify(result));
  });
});

app.get( '/staff' , function (req, res) {
  let query = "SELECT * FROM staff"

  if ( "fields" in req.query) {
    query = query.replace( "*" , req.query[ "fields" ]);
  }

  if ( "limit" in req.query) {
    query += " LIMIT " + req.query[ "limit" ];
    if ( "offset" in req.query) {
      query += " OFFSET " + req.query[ "offset" ];
    }
  }

  if ( "sort" in req.query) {
    var sort = req.query[ "sort" ].split( "," );
    query += " ORDER BY" ;
    for ( var index in sort) {
      var direction = sort[index].substr( 0 , 1 );
      var field = sort[index].substr( 1 );
      query += " " + field;
      if (direction == "-" )
      query += " DESC," ;
      else
      query += " ASC," ;
    }
    query = query.slice( 0 , -1 );
  }

  let columns = [ "id" , "firstname", "lastname", "wage"];

  for ( let index in columns) {
    if (columns[index] in req.query) {
      if (query.indexOf( "WHERE" ) < 0 ) {
        query += " WHERE" ;
      } else {
        query += " AND" ;
      }
      query += " " + columns[index] + "='" +
      req.query[columns[index]] + "'" ;
    }
  }

  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify(result));
  });
});

app.get( '/food/:id/animals' , function (req, res) {
  let id = req.params.id;

  let query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + id;

  if ( "fields" in req.query) {
    query = query.replace( "*" , req.query[ "fields" ]);
  }

  if ( "limit" in req.query) {
    query += " LIMIT " + req.query[ "limit" ];
    if ( "offset" in req.query) {
      query += " OFFSET " + req.query[ "offset" ];
    }
  }

  let columns = [ "id" , "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];

  for ( let index in columns) {
    if (columns[index] in req.query) {
      if (query.indexOf( "WHERE" ) < 0 ) {
        query += " WHERE" ;
      } else {
        query += " AND" ;
      }
      query += " " + columns[index] + "='" +
      req.query[columns[index]] + "'" ;
    }
  }

  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify(result));
  });
});

app.get( '/food/:id_food/animals/:id_animal' , function (req, res) {
  let id_animal = req.params.id_animal;
  let id_food = req.params.id_food;

  let query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id=" + id_food + " AND animals.id = " + id_animal;

  if ( "fields" in req.query) {
    query = query.replace( "*" , req.query[ "fields" ]);
  }

  if ( "limit" in req.query) {
    query += " LIMIT " + req.query[ "limit" ];
    if ( "offset" in req.query) {
      query += " OFFSET " + req.query[ "offset" ];
    }
  }

  let columns = [ "id" , "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];

  for ( let index in columns) {
    if (columns[index] in req.query) {
      if (query.indexOf( "WHERE" ) < 0 ) {
        query += " WHERE" ;
      } else {
        query += " AND" ;
      }
      query += " " + columns[index] + "='" +
      req.query[columns[index]] + "'" ;
    }
  }

  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify(result));
  });
});

app.get( '/animals/:id/food' , function (req, res) {
  let id = req.params.id;

  let query = "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id=" + id;

  if ( "fields" in req.query) {
    query = query.replace( "*" , req.query[ "fields" ]);
  }

  if ( "limit" in req.query) {
    query += " LIMIT " + req.query[ "limit" ];
    if ( "offset" in req.query) {
      query += " OFFSET " + req.query[ "offset" ];
    }
  }

  let columns = [ "id" , "name", "quantity", "id_animal"];

  for ( let index in columns) {
    if (columns[index] in req.query) {
      if (query.indexOf( "WHERE" ) < 0 ) {
        query += " WHERE" ;
      } else {
        query += " AND" ;
      }
      query += " " + columns[index] + "='" +
      req.query[columns[index]] + "'" ;
    }
  }

  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify(result));
  });
});

app.get( '/staff/:id' , function (req, res) {
  let id = req.params.id;

  let query = "SELECT * FROM staff WHERE id=" + id;

  if ( "fields" in req.query) {
    query = query.replace( "*" , req.query[ "fields" ]);
  }
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify(result));
  });
});

//function used to update one particular animal using its id number as a parameter
app.put( '/animals/:id' , function (req, res) {
  let id = req.params.id;
  let index = 0;

  let query = "UPDATE animals SET ";

  //we update only the elements passed in the body
  for(let element in req.body){
    if(element !== undefined && req.body[element] !== undefined){
      if(index === 0){
        index++;
      }else{
        query += ", ";
      }
      query += element + " = '" + req.body[element] + "'";
    }
  }

  query += " WHERE id = " + id;

  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify( "Success" ));
    //console.log(JSON.stringify(query));
  });
});

app.put( '/cages/:id' , function (req, res) {
  let id = req.params.id;
  let index = 0;

  let query = "UPDATE cages SET ";

  for(let element in req.body){
    if(element !== undefined && req.body[element] !== undefined){
      if(index === 0){
        index++;
      }else{
        query += ", ";
      }
      query += element + " = '" + req.body[element] + "'";
    }
  }

  query += " WHERE id = " + id;
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify( "Success" ));
    //console.log(JSON.stringify(query));
  });
});

app.put( '/food/:id' , function (req, res) {
  let id = req.params.id;
  let index = 0;

  let query = "UPDATE food SET ";

  for(let element in req.body){
    if(element !== undefined && req.body[element] !== undefined){
      if(index === 0){
        index++;
      }else{
        query += ", ";
      }
      query += element + " = '" + req.body[element] + "'";
    }
  }

  query += " WHERE id = " + id;
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify( "Success" ));
    //console.log(JSON.stringify(query));
  });
});

app.put( '/staff/:id' , function (req, res) {
  let id = req.params.id;
  let index = 0;

  let query = "UPDATE staff SET ";

  for(let element in req.body){
    if(element !== undefined && req.body[element] !== undefined){
      if(index === 0){
        index++;
      }else{
        query += ", ";
      }
      query += element + " = '" + req.body[element] + "'";
    }
  }

  query += " WHERE id = " + id;
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify( "Success" ));
  });
});

//function used to delete one particular animal using its id number as a parameter
app.delete( '/animals/:id' , function (req, res) {
  let id = req.params.id;

  let query = "DELETE FROM animals WHERE id=" + id;
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send(JSON .stringify( "Success" ));
    //console.log(JSON.stringify(query));
  });
});

//function used to delete ever animal of the table animals
app.delete( '/animals' , function (req, res) {
  let query = "DELETE FROM animals";
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send(JSON .stringify( "Success" ));
    //console.log(JSON.stringify(query));
  });
});

app.delete( '/cages/:id' , function (req, res) {
  let id = req.params.id;

  let query = "DELETE FROM cages WHERE id=" + id;
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send(JSON .stringify( "Success" ));
    //console.log(JSON.stringify(query));
  });
});

app.delete( '/cages' , function (req, res) {
  let query = "DELETE FROM cages";
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send(JSON .stringify( "Success" ));
    //console.log(JSON.stringify(query));
  });
});

app.delete( '/food/:id' , function (req, res) {
  let id = req.params.id;

  let query = "DELETE FROM food WHERE id=" + id;
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send(JSON .stringify( "Success" ));
    //console.log(JSON.stringify(query));
  });
});

app.delete( '/food' , function (req, res) {
  let query = "DELETE FROM food";
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send(JSON .stringify( "Success" ));
  });
});

app.delete( '/staff/:id' , function (req, res) {
  let id = req.params.id;

  let query = "DELETE FROM staff WHERE id=" + id;
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send(JSON .stringify( "Success" ));
    //console.log(JSON.stringify(query));
  });
});

app.delete( '/staff' , function (req, res) {
  let query = "DELETE FROM staff";
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send(JSON .stringify( "Success" ));
    //console.log(JSON.stringify(query));
  });
});

//function used to print days left of food for every animal
app.get( '/food-stats' , function (req, res) {
  let id = req.params.id;
  let query = "SELECT a.id, if(f.quantity is null or a.food_per_day = 0, 0, (f.quantity / a.food_per_day)) as days_left FROM food as f right join animals as a on a.id = f.id_animal";
  db.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send( JSON .stringify(result));
    //console.log(JSON.stringify(query));
  });
});

app.listen( 3000 , function () {
  console .log( 'Example app listening on port 3000!' );
});
