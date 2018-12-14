	const  express =  require ( 'express' ); 
	const  mysql =  require ( 'mysql' ); 
	const  app = express();
	const  bodyParser =  require ( 'body-parser' );
	
	const diegohost = process.environment.MYSQL_HOST;
	const diegoport = process.environment.MYSQL_PORT;
	const diegodatabase = process.environment.MYSQL_DATABASE;
	const diegologin = process.environment.MYSQL_LOGIN;
	const diegopassword = process.environment.MYSQL_PASSWORD;

	app.use(bodyParser.urlencoded({ extended:  true  }));

	var  db = mysql.createConnection({ 
		host:  diegohost ,
		user:  diegologin ,
		password:  diegopassword,
		database:  diegodatabase ,
		port: diegoport });

	app.use( function (req, res, next) {  if  ( "key"   in  req.query) {
		console.log(req.method);
		console.log(req.query);
		console.log(req.body);
		console.log(req.originalUrl);
		var  key = req.query[ "key" ];
		var  query =  "SELECT * FROM users WHERE apikey='"  + key +  "'" ;
		db.query(query,  function (err, result, fields) {  if  (err)  throw  err;
			if  (result.length >  0 ) { next();
			}  else  {
				res.status(403).send( "Access denied" ); }
			}); }  else  {
			res.status(403).send( "Access denied" ); }
		});



	app.post( '/animals' ,  function (req, res) {
		var  id = req.body.id;
		var  name = req.body.name;
		var  breed = req.body.breed;
		var  food = req.body.food_per_day;
		var  birth = req.body.birthday;
		var  entry = req.body.entry_date;
		var  cage = req.body.id_cage;
		var  query =  "INSERT INTO animals (`id`,`name`,`breed`,`food_per_day`,`birthday`,`entry_date`,`id_cage`) VALUES (('"  + id +  "'),('"  + name +  "'),('"  + breed +  "'),('"  + food +  "'),('"  + birth +  "'),('"  + entry +  "'),('"  + cage +  "'))" ;
		db.query(query,  function (err, result, fields) {  
			if  (err)  throw  err;
			res.send( JSON .stringify( "Success" )); 
		});
	});

	app.get( '/animals' ,  function (req, res) {
		var  query =  "SELECT * FROM animals" ;
		var  conditions = [ "id" ,  "name","breed","food_per_day","entry_date","id_cage" ];
		for  ( var  index  in  conditions) {
			if  (conditions[index]  in  req.query) {
				if  (query.indexOf( "WHERE" ) <  0 ) { query +=  " WHERE" ;
			}  
			else  {
				query +=  " AND" ; 
			}
			query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
		} 
	}
	if  ( "sort"   in  req.query) {
		var  sort = req.query[ "sort" ].split( "," ); query +=  " ORDER BY" ;
		for  ( var  index  in  sort) {
			var  direction = sort[index].substr( 0 ,  1 );  var  field = sort[index].substr( 1 );
			query +=  " "  + field;
			if  (direction ==  "-" ) 
				query +=  " DESC," ;
			else
				query +=  " ASC," ;
		}
		query = query.slice( 0 ,  -1 ); 

	}

	if  ( "fields"   in  req.query) {
		query = query.replace( "*" , req.query[ "fields" ]); }

		if  ( "limit"   in  req.query) {
			query +=  " LIMIT "  + req.query[ "limit" ];
			if  ( "offset"   in  req.query) {
				query +=  " OFFSET "  + req.query[ "offset" ]; }
			}
			db.query(query,  function (err, result, fields) {  if  (err)  throw  err;
				res.send( JSON .stringify(result)); 
			});
		});

	app.get( '/animals/:id' ,  function (req, res) {
		var  query =  "SELECT * FROM animals WHERE id="+req.params.id ;
		var  conditions = [ "id" ,  "name","breed","food_per_day","entry_date","id_cage" ];
		for  ( var  index  in  conditions) {
			if  (conditions[index]  in  req.query) {
				if  (query.indexOf( "WHERE" ) <  0 ) { query +=  " WHERE" ;
			}  
			else  {
				query +=  " AND" ; 
			}
			query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
		} 
	}
	if  ( "sort"   in  req.query) {
		var  sort = req.query[ "sort" ].split( "," ); query +=  " ORDER BY" ;
		for  ( var  index  in  sort) {
			var  direction = sort[index].substr( 0 ,  1 );  var  field = sort[index].substr( 1 );
			query +=  " "  + field;
			if  (direction ==  "-" ) 
				query +=  " DESC," ;
			else
				query +=  " ASC," ;
		}
		query = query.slice( 0 ,  -1 ); 

	}

	if  ( "fields"   in  req.query) {
		query = query.replace( "*" , req.query[ "fields" ]); }

		if  ( "limit"   in  req.query) {
			query +=  " LIMIT "  + req.query[ "limit" ];
			if  ( "offset"   in  req.query) {
				query +=  " OFFSET "  + req.query[ "offset" ]; }
			}
			db.query(query,  function (err, result, fields) {  if  (err)  throw  err;
				res.send( JSON .stringify(result)); 
			});
		});

	app.put( '/animals/:id' ,  function (req, res) {
		var  id = req.params.id;
		var  query =  "UPDATE animals SET id="+id;
		if("name" in req.body){
			query+=", name='"+req.body.name+"'";
		}
		if("breed" in req.body){
			query+=", breed='" +req.body.breed+"'";
		} 
		if("food_per_day" in req.body){
			query+=", food_per_day=" +req.body.food_per_day;
		}
		if("birthday" in req.body){
			query+=", birthday='" +req.body.birthday+"'";
		}
		if("entry_date" in req.body){
			query+=", entry_date='" +req.body.entry_date+"'";
		}
		if("id_cage" in req.body){
			query+=", id_cage=" +req.body.id_cage;
		} 
		query +=" WHERE id="+ id;
		db.query(query,  function (err, result, fields) {
			if  (err)  throw  err; 
			res.send( JSON .stringify( "Success" ));
		}); 
	});

	app.delete( '/animals' ,  function (req, res) {
		var  id = req.params.id;
		var  query =  "DELETE FROM animals"; 
		db.query(query,  function (err, result, fields) {
			if  (err)  throw  err; 
			res.send( JSON .stringify( "Success" ));
		}); 
	});

	app.delete( '/animals/:id' ,  function (req, res) {
		var  id = req.params.id;
		var  query =  "DELETE FROM animals WHERE id="  + id; 
		db.query(query,  function (err, result, fields) {
			if  (err)  throw  err; 
			res.send( JSON .stringify( "Success" ));
		}); 
	});

	app.post( '/cages' ,  function (req, res) {
		var  id = req.body.id;
		var  name = req.body.name;
		var  description = req.body.description;
		var  area = req.body.area;

		var  query =  "INSERT INTO cages (`id`,`name`,`description`,`area`) VALUES (('"  + id +  "'),('"  + name +  "'),('"  + description +  "'),('"  + area +  "'))" ;
		db.query(query,  function (err, result, fields) {  
			if  (err)  throw  err;
			res.send( JSON .stringify( "Success" )); 
		});
	});

	app.get( '/cages/:id' ,  function (req, res) {
		var  query =  "SELECT * FROM cages WHERE id="+req.params.id ;
		var  conditions = [ "id" ,  "name", "description", "area" ];
		for  ( var  index  in  conditions) {
			if  (conditions[index]  in  req.query) {
				if  (query.indexOf( "WHERE" ) <  0 ) { query +=  " WHERE" ;
			}  
			else  {
				query +=  " AND" ; 
			}
			query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
		} 
	}
	if  ( "sort"   in  req.query) {
		var  sort = req.query[ "sort" ].split( "," ); query +=  " ORDER BY" ;
		for  ( var  index  in  sort) {
			var  direction = sort[index].substr( 0 ,  1 );  var  field = sort[index].substr( 1 );
			query +=  " "  + field;
			if  (direction ==  "-" ) 
				query +=  " DESC," ;
			else
				query +=  " ASC," ;
		}
		query = query.slice( 0 ,  -1 ); 

	}

	if  ( "fields"   in  req.query) {
		query = query.replace( "*" , req.query[ "fields" ]); }

		if  ( "limit"   in  req.query) {
			query +=  " LIMIT "  + req.query[ "limit" ];
			if  ( "offset"   in  req.query) {
				query +=  " OFFSET "  + req.query[ "offset" ]; }
			}
			db.query(query,  function (err, result, fields) {  if  (err)  throw  err;
				res.send( JSON .stringify(result)); });
		});

	app.get( '/cages' ,  function (req, res) {
		var  query =  "SELECT * FROM cages" ;
		var  conditions = [ "id" ,  "name", "description", "area" ];
		for  ( var  index  in  conditions) {
			if  (conditions[index]  in  req.query) {
				if  (query.indexOf( "WHERE" ) <  0 ) { query +=  " WHERE" ;
			}  
			else  {
				query +=  " AND" ; 
			}
			query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
		} 
	}
	if  ( "sort"   in  req.query) {
		var  sort = req.query[ "sort" ].split( "," ); query +=  " ORDER BY" ;
		for  ( var  index  in  sort) {
			var  direction = sort[index].substr( 0 ,  1 );  var  field = sort[index].substr( 1 );
			query +=  " "  + field;
			if  (direction ==  "-" ) 
				query +=  " DESC," ;
			else
				query +=  " ASC," ;
		}
		query = query.slice( 0 ,  -1 ); 

	}

	if  ( "fields"   in  req.query) {
		query = query.replace( "*" , req.query[ "fields" ]); }

		if  ( "limit"   in  req.query) {
			query +=  " LIMIT "  + req.query[ "limit" ];
			if  ( "offset"   in  req.query) {
				query +=  " OFFSET "  + req.query[ "offset" ]; }
			}
			db.query(query,  function (err, result, fields) {  if  (err)  throw  err;
				res.send( JSON .stringify(result)); });
		});

	app.put( '/cages/:id' ,  function (req, res) {
		var  id = req.params.id;
		var  query =  "UPDATE cages SET id="+id;
		if("name" in req.body){
			query+=", name='"+req.body.name+"'";
		}
		if("description" in req.body){
			query+=", description= '"+req.body.description+"'";
		} 
		if("area" in req.body){
			query+=", area= '"+req.body.area+"'";
		}
		query +=" WHERE id="+ id;
		db.query(query,  function (err, result, fields) {
			if  (err)  throw  err; 
			res.send( JSON .stringify( "Success" ));
		}); 
	});

	app.delete( '/cages/:id' ,  function (req, res) {
		var  id = req.params.id;
		var  query =  "DELETE FROM cages WHERE id="  + id; 
		db.query(query,  function (err, result, fields) {
			if  (err)  throw  err; 
			res.send( JSON .stringify( "Success" ));
		}); 
	});

	app.delete( '/cages' ,  function (req, res) {
		var  id = req.params.id;
		var  query =  "DELETE FROM cages"; 
		db.query(query,  function (err, result, fields) {
			if  (err)  throw  err; 
			res.send( JSON .stringify( "Success" ));
		}); 
	});

	app.post( '/food' ,  function (req, res) {
		var  id = req.body.id;
		var  name = req.body.name;
		var  id_animal = req.body.id_animal;
		var  quantity = req.body.quantity;

		var  query =  "INSERT INTO food (`id`,`name`,`id_animal`,`quantity`) VALUES (('"  + id +  "'),('"  + name +  "'),('"  + id_animal +  "'),('"  + quantity +  "'))" ;
		db.query(query,  function (err, result, fields) {  
			if  (err)  throw  err;
			res.send( JSON .stringify( "Success" )); 
		});
	});

	app.get( '/food/:id' ,  function (req, res) {
		var  query =  "SELECT * FROM food WHERE id="+req.params.id ;
		var  conditions = [ "id" ,  "name","quantity","id_animal"];
		for  ( var  index  in  conditions) {
			if  (conditions[index]  in  req.query) {
				if  (query.indexOf( "WHERE" ) <  0 ) { query +=  " WHERE" ;
			}  
			else  {
				query +=  " AND" ; 
			}
			query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
		} 
	}
	if  ( "sort"   in  req.query) {
		var  sort = req.query[ "sort" ].split( "," ); query +=  " ORDER BY" ;
		for  ( var  index  in  sort) {
			var  direction = sort[index].substr( 0 ,  1 );  var  field = sort[index].substr( 1 );
			query +=  " "  + field;
			if  (direction ==  "-" ) 
				query +=  " DESC," ;
			else
				query +=  " ASC," ;
		}
		query = query.slice( 0 ,  -1 ); 

	}

	if  ( "fields"   in  req.query) {
		query = query.replace( "*" , req.query[ "fields" ]); }

		if  ( "limit"   in  req.query) {
			query +=  " LIMIT "  + req.query[ "limit" ];
			if  ( "offset"   in  req.query) {
				query +=  " OFFSET "  + req.query[ "offset" ]; }
			}
			db.query(query,  function (err, result, fields) {  if  (err)  throw  err;
				res.send( JSON .stringify(result)); });
		});

	app.get( '/food' ,  function (req, res) {
		var  query =  "SELECT * FROM food" ;
		var  conditions = [ "id" ,  "name","quantity","id_animal"];
		for  ( var  index  in  conditions) {
			if  (conditions[index]  in  req.query) {
				if  (query.indexOf( "WHERE" ) <  0 ) { query +=  " WHERE" ;
			}  
			else  {
				query +=  " AND" ; 
			}
			query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
		} 
	}
	if  ( "sort"   in  req.query) {
		var  sort = req.query[ "sort" ].split( "," ); query +=  " ORDER BY" ;
		for  ( var  index  in  sort) {
			var  direction = sort[index].substr( 0 ,  1 );  var  field = sort[index].substr( 1 );
			query +=  " "  + field;
			if  (direction ==  "-" ) 
				query +=  " DESC," ;
			else
				query +=  " ASC," ;
		}
		query = query.slice( 0 ,  -1 ); 

	}

	if  ( "fields"   in  req.query) {
		query = query.replace( "*" , req.query[ "fields" ]); }

		if  ( "limit"   in  req.query) {
			query +=  " LIMIT "  + req.query[ "limit" ];
			if  ( "offset"   in  req.query) {
				query +=  " OFFSET "  + req.query[ "offset" ]; }
			}
			db.query(query,  function (err, result, fields) {  if  (err)  throw  err;
				res.send( JSON .stringify(result)); });
		});


	app.put( '/food/:id' ,  function (req, res) {

		var  id = req.params.id;
		var  query =  "UPDATE food SET id="+id;
		if("name" in req.body){
			query+=", name= '"+req.body.name+"'";
		}
		if("id_animal" in req.body){
			query+=", id_animal="+req.body.id_animal;
		}
		if("quantity" in req.body){
			query+=", quantity="+req.body.quantity;
		}
		query+=" WHERE id="+id;
		db.query(query,  function (err, result, fields) {
			if  (err)  throw  err; 
			res.send( JSON .stringify( "Success" ));
		}); 
	});

	app.delete( '/food/:id' ,  function (req, res) {
		var  id = req.params.id;
		var  query =  "DELETE FROM food WHERE id=" + id; 
		db.query(query,  function (err, result, fields) {
			if  (err)  throw  err; 
			res.send( JSON .stringify( "Success" ));
		}); 
	});
	app.delete( '/food' ,  function (req, res) {
		var  id = req.params.id;
		var  query =  "DELETE FROM food"; 
		db.query(query,  function (err, result, fields) {
			if  (err)  throw  err; 
			res.send( JSON .stringify( "Success" ));
		}); 
	});

	app.post( '/staff' ,  function (req, res) {
		var  id = req.body.id;
		var  firstname = req.body.firstname;
		var  lastname = req.body.lastname;
		var  wage = req.body.wage;

		var  query =  "INSERT INTO staff (`id`,`firstname`,`lastname`,`wage`) VALUES (('"  + id +  "'),('"  + firstname +  "'),('"  + lastname +  "'),('"  + wage +  "'))" ;
		db.query(query,  function (err, result, fields) {  
			if  (err)  throw  err;
			res.send( JSON .stringify( "Success" )); 
		});
	});

	app.get( '/staff/:id' ,  function (req, res) {
		var  query =  "SELECT * FROM staff WHERE id="+req.params.id ;
		var  conditions = [ "id" ,"firstname","lastname","wage" ];
		for  ( var  index  in  conditions) {
			if  (conditions[index]  in  req.query) {
				if  (query.indexOf( "WHERE" ) <  0 ) { query +=  " WHERE" ;
			}  
			else  {
				query +=  " AND" ; 
			}
			query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
		} 
	}
	if  ( "sort"   in  req.query) {
		var  sort = req.query[ "sort" ].split( "," ); query +=  " ORDER BY" ;
		for  ( var  index  in  sort) {
			var  direction = sort[index].substr( 0 ,  1 );  var  field = sort[index].substr( 1 );
			query +=  " "  + field;
			if  (direction ==  "-" ) 
				query +=  " DESC," ;
			else
				query +=  " ASC," ;
		}
		query = query.slice( 0 ,  -1 ); 

	}

	if  ( "fields"   in  req.query) {
		query = query.replace( "*" , req.query[ "fields" ]); }

		if  ( "limit"   in  req.query) {
			query +=  " LIMIT "  + req.query[ "limit" ];
			if  ( "offset"   in  req.query) {
				query +=  " OFFSET "  + req.query[ "offset" ]; }
			}
			db.query(query,  function (err, result, fields) {  if  (err)  throw  err;
				res.send( JSON .stringify(result)); });
		});

	app.get( '/staff' ,  function (req, res) {
		var  query =  "SELECT * FROM staff" ;
		var  conditions = [ "id" ,"firstname","lastname","wage" ];
		for  ( var  index  in  conditions) {
			if  (conditions[index]  in  req.query) {
				if  (query.indexOf( "WHERE" ) <  0 ) { query +=  " WHERE" ;
			}  
			else  {
				query +=  " AND" ; 
			}
			query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
		} 
	}
	if  ( "sort"   in  req.query) {
		var  sort = req.query[ "sort" ].split( "," ); query +=  " ORDER BY" ;
		for  ( var  index  in  sort) {
			var  direction = sort[index].substr( 0 ,  1 );  var  field = sort[index].substr( 1 );
			query +=  " "  + field;
			if  (direction ==  "-" ) 
				query +=  " DESC," ;
			else
				query +=  " ASC," ;
		}
		query = query.slice( 0 ,  -1 ); 

	}

	if  ( "fields"   in  req.query) {
		query = query.replace( "*" , req.query[ "fields" ]); }

		if  ( "limit"   in  req.query) {
			query +=  " LIMIT "  + req.query[ "limit" ];
			if  ( "offset"   in  req.query) {
				query +=  " OFFSET "  + req.query[ "offset" ]; }
			}
			db.query(query,  function (err, result, fields) {  if  (err)  throw  err;
				res.send( JSON .stringify(result)); });
		});

	app.put( '/staff/:id' ,  function (req, res) {

		var  id = req.params.id;
		var  query =  "UPDATE staff SET id="  + id;
		if("firstname" in req.body){
			query+=", firstname='"+req.body.firstname+"'";
		}
		if("lastname" in req.body){
			query+=", lastname= '"+req.body.lastname+"'";
		}
		if("wage" in req.body){
			query+=", wage="+req.body.wage;
		}
		query+=" WHERE id="+id;
		db.query(query,  function (err, result, fields) {
			if  (err)  throw  err; 
			res.send( JSON .stringify( "Success" ));
		}); 
	});
	app.delete( '/staff' ,  function (req, res) {
		var  id = req.params.id;
		var  query =  "DELETE FROM staff"; 
		db.query(query,  function (err, result, fields) {
			if  (err)  throw  err; 
			res.send( JSON .stringify( "Success" ));
		}); 
	});

	app.delete( '/staff/:id' ,  function (req, res) {
		var  id = req.params.id;
		var  query =  "DELETE FROM staff WHERE id="  + id; 
		db.query(query,  function (err, result, fields) {
			if  (err)  throw  err; 
			res.send( JSON .stringify( "Success" ));
		}); 
	});

	app.get('/food-stats', function(req, res) {
		var query="SELECT a.id, if(food_per_day=0,0,quantity/food_per_day) AS `days_left` FROM food b INNER JOIN animals a ON a.id=b.id_animal";
		db.query(query, function(err, result, fields) {

			if  (err)  throw  err; 
			res.send( JSON .stringify(result));
		}); 
	});

	app.get( '/animals/:id/cages' ,  function (req, res) {
		var  id = req.params.id;
		var  query =  "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage=cages.id WHERE animals.id="  + id; 
		var  conditions = [ "id" ,"name","description","area"];
		for  ( var  index  in  conditions) {
			if  (conditions[index]  in  req.query) {
				if  (query.indexOf( "WHERE" ) <  0 ) { query +=  " WHERE" ;
			}  
			else  {
				query +=  " AND" ; 
			}
			query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
		} 
	}
	if  ( "sort"   in  req.query) {
		var  sort = req.query[ "sort" ].split( "," ); query +=  " ORDER BY" ;
		for  ( var  index  in  sort) {
			var  direction = sort[index].substr( 0 ,  1 );  var  field = sort[index].substr( 1 );
			query +=  " "  + field;
			if  (direction ==  "-" ) 
				query +=  " DESC," ;
			else
				query +=  " ASC," ;
		}
		query = query.slice( 0 ,  -1 ); 

	}

	if  ( "fields"   in  req.query) {
		query = query.replace( "cages.*" , req.query[ "fields" ]); }

		if  ( "limit"   in  req.query) {
			query +=  " LIMIT "  + req.query[ "limit" ];
			if  ( "offset"   in  req.query) {
				query +=  " OFFSET "  + req.query[ "offset" ]; }
			}
			db.query(query,  function (err, result, fields) {
				if  (err)  throw  err; res.send( JSON .stringify(result));
			}); 
		});


	app.get( '/cages/:id/animals' ,  function (req, res) {
		var  id = req.params.id;
		var  query =  "SELECT animals.* FROM cages INNER JOIN animals ON cages.id= animals.id_cage WHERE cages.id="  + id; 
		var  conditions = [ "id" ,"name","breed","food_per_day", "id_cage","birthday","entry_date"];
		for  ( var  index  in  conditions) {
			if  (conditions[index]  in  req.query) {
				if  (query.indexOf( "WHERE" ) <  0 ) { query +=  " WHERE" ;
			}  
			else  {
				query +=  " AND" ; 
			}
			query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
		} 
	}
	if  ( "sort"   in  req.query) {
		var  sort = req.query[ "sort" ].split( "," ); query +=  " ORDER BY" ;
		for  ( var  index  in  sort) {
			var  direction = sort[index].substr( 0 ,  1 );  var  field = sort[index].substr( 1 );
			query +=  " "  + field;
			if  (direction ==  "-" ) 
				query +=  " DESC," ;
			else
				query +=  " ASC," ;
		}
		query = query.slice( 0 ,  -1 ); 

	}

	if  ( "fields"   in  req.query) {
		query = query.replace( "animals.*" , req.query[ "fields" ]); }

		if  ( "limit"   in  req.query) {
			query +=  " LIMIT "  + req.query[ "limit" ];
			if  ( "offset"   in  req.query) {
				query +=  " OFFSET "  + req.query[ "offset" ]; }
			}
			db.query(query,  function (err, result, fields) {
				if  (err)  throw  err; res.send( JSON .stringify(result));
			}); 
		});



	app.get( '/animals/:id_animal/cages/:id_cage' ,  function (req, res) {

		var  id_cage = req.params.id_cage;
		var  id = req.params.id_animal;
		var  query =  "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id="  + id +  " AND cages.id="  + id_cage;
		var  conditions = [ "id" ,"name","description","area"];
		for  ( var  index  in  conditions) {
			if  (conditions[index]  in  req.query) {
				if  (query.indexOf( "WHERE" ) <  0 ) { query +=  " WHERE" ;
			}  
			else  {
				query +=  " AND" ; 
			}
			query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
		} 
	}
	if  ( "sort"   in  req.query) {
		var  sort = req.query[ "sort" ].split( "," ); query +=  " ORDER BY" ;
		for  ( var  index  in  sort) {
			var  direction = sort[index].substr( 0 ,  1 );  var  field = sort[index].substr( 1 );
			query +=  " "  + field;
			if  (direction ==  "-" ) 
				query +=  " DESC," ;
			else
				query +=  " ASC," ;
		}
		query = query.slice( 0 ,  -1 ); 

	}

	if  ( "fields"   in  req.query) {
		query = query.replace( "*" , req.query[ "fields" ]); }

		if  ( "limit"   in  req.query) {
			query +=  " LIMIT "  + req.query[ "limit" ];
			if  ( "offset"   in  req.query) {
				query +=  " OFFSET "  + req.query[ "offset" ]; }
			}
			db.query(query,  function (err, result, fields) {
				if  (err)  throw  err; res.send( JSON .stringify(result));
			}); 
		});

	app.get( '/cages/:id_cage/animals/:id' ,  function (req, res) {
		var  id_cage = req.params.id_cage;
		var  id = req.params.id;
		var  query =  "SELECT animals.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE animals.id_cage="  + id_cage +  " AND cages.id="  + id;
		var  conditions = [ "id" ,  "name","breed","food_per_day","entry_date","id_cage" ];
		for  ( var  index  in  conditions) {
			if  (conditions[index]  in  req.query) {
				if  (query.indexOf( "WHERE" ) <  0 ) { query +=  " WHERE" ;
			}  
			else  {
				query +=  " AND" ; 
			}
			query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
		} 
	}
	if  ( "sort"   in  req.query) {
		var  sort = req.query[ "sort" ].split( "," ); query +=  " ORDER BY" ;
		for  ( var  index  in  sort) {
			var  direction = sort[index].substr( 0 ,  1 );  var  field = sort[index].substr( 1 );
			query +=  " "  + field;
			if  (direction ==  "-" ) 
				query +=  " DESC," ;
			else
				query +=  " ASC," ;
		}
		query = query.slice( 0 ,  -1 ); 

	}

	if  ( "fields"   in  req.query) {
		query = query.replace( "animals.*" , req.query[ "fields" ]); }

		if  ( "limit"   in  req.query) {
			query +=  " LIMIT "  + req.query[ "limit" ];
			if  ( "offset"   in  req.query) {
				query +=  " OFFSET "  + req.query[ "offset" ]; }
			}
			db.query(query,  function (err, result, fields) {
				if  (err)  throw  err; res.send( JSON .stringify(result));
			}); 
		});

	app.get( '/food/:id/animals' ,  function (req, res) {
		var  id = req.params.id;
		var  query =  "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal= animals.id WHERE food.id=" + id; 
		var  conditions = [ "id" ,"name","breed","food_per_day", "id_cage","birthday","entry_date"];
		for  ( var  index  in  conditions) {
			if  (conditions[index]  in  req.query) {
				if  (query.indexOf( "WHERE" ) <  0 ) { query +=  " WHERE" ;
			}  
			else  {
				query +=  " AND" ; 
			}
			query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
		} 
	}
	if  ( "sort"   in  req.query) {
		var  sort = req.query[ "sort" ].split( "," ); query +=  " ORDER BY" ;
		for  ( var  index  in  sort) {
			var  direction = sort[index].substr( 0 ,  1 );  var  field = sort[index].substr( 1 );
			query +=  " "  + field;
			if  (direction ==  "-" ) 
				query +=  " DESC," ;
			else
				query +=  " ASC," ;
		}
		query = query.slice( 0 ,  -1 ); 

	}

	if  ( "fields"   in  req.query) {
		query = query.replace( "animals.*" , req.query[ "fields" ]); }

		if  ( "limit"   in  req.query) {
			query +=  " LIMIT "  + req.query[ "limit" ];
			if  ( "offset"   in  req.query) {
				query +=  " OFFSET "  + req.query[ "offset" ]; }
			}
			db.query(query,  function (err, result, fields) {
				if  (err)  throw  err; res.send( JSON .stringify(result));
			}); 
		});


	app.get( '/animals/:id/food' ,  function (req, res) {
		var  id = req.params.id;
		var  query =  "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal  WHERE animals.id= "  + id; 
		var  conditions = [ "id" ,"name","quantity","id_animal"];
		for  ( var  index  in  conditions) {
			if  (conditions[index]  in  req.query) {
				if  (query.indexOf( "WHERE" ) <  0 ) { query +=  " WHERE" ;
			}  
			else  {
				query +=  " AND" ; 
			}
			query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
		} 
	}
	if  ( "sort"   in  req.query) {
		var  sort = req.query[ "sort" ].split( "," ); query +=  " ORDER BY" ;
		for  ( var  index  in  sort) {
			var  direction = sort[index].substr( 0 ,  1 );  var  field = sort[index].substr( 1 );
			query +=  " "  + field;
			if  (direction ==  "-" ) 
				query +=  " DESC," ;
			else
				query +=  " ASC," ;
		}
		query = query.slice( 0 ,  -1 ); 

	}

	if  ( "fields"   in  req.query) {
		query = query.replace( "food.*" , req.query[ "fields" ]); }

		if  ( "limit"   in  req.query) {
			query +=  " LIMIT "  + req.query[ "limit" ];
			if  ( "offset"   in  req.query) {
				query +=  " OFFSET "  + req.query[ "offset" ]; }
			}
			db.query(query,  function (err, result, fields) {
				if  (err)  throw  err; res.send( JSON .stringify(result));
			}); 
		});


	app.get( '/food/:id/animals/:id_animal' ,  function (req, res) {
		var  id = req.params.id;
		var  id_animal = req.params.id_animal;
		var  query =  "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal= animals.id WHERE food.id=" + id+ " AND animals.id="+id_animal; 
		var  conditions = [ "id" ,"name","breed","food_per_day", "id_cage","birthday","entry_date"];
		for  ( var  index  in  conditions) {
			if  (conditions[index]  in  req.query) {
				if  (query.indexOf( "WHERE" ) <  0 ) { query +=  " WHERE" ;
			}  
			else  {
				query +=  " AND" ; 
			}
			query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
		} 
	}
	if  ( "sort"   in  req.query) {
		var  sort = req.query[ "sort" ].split( "," ); query +=  " ORDER BY" ;
		for  ( var  index  in  sort) {
			var  direction = sort[index].substr( 0 ,  1 );  var  field = sort[index].substr( 1 );
			query +=  " "  + field;
			if  (direction ==  "-" ) 
				query +=  " DESC," ;
			else
				query +=  " ASC," ;
		}
		query = query.slice( 0 ,  -1 ); 

	}

	if  ( "fields"   in  req.query) {
		query = query.replace( "animals.*" , req.query[ "fields" ]); }

		if  ( "limit"   in  req.query) {
			query +=  " LIMIT "  + req.query[ "limit" ];
			if  ( "offset"   in  req.query) {
				query +=  " OFFSET "  + req.query[ "offset" ]; }
			}
			db.query(query,  function (err, result, fields) {
				if  (err)  throw  err; res.send( JSON .stringify(result));
			}); 
		});



	app.listen( 3000 ,  function () { 
		
		db.connect( function (err) {
		if  (err)  throw  err;
		console .log( 'Connection to database successful!' );
	}); 
	console .log( 'Example app listening on port 3000!' );
}); 

