const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

///////////////////////////Firewall///////////////////////////////
app.use(function(req,res,next)
{
	if("key" in req.query)
	{
		var key = req.query["key"];
		var query = "SELECT * FROM users WHERE apikey='"+key+"'";
		
		db.query(query,function(err,result,fields)
		{
			if (err)
			throw err;
       
			if(result.length>0)
			{
				next();
			}
			else
			{
				res.status(403).send("Access denied");
			}
		});
	}
		else
		{
			res.status(403).send("Access denied");
		}
});


////////////////Connection to mySQL/////////////////////
var db = mysql.createConnection
({
 host: "localhost",
 user: "root",
 password: "",
 database: "zoo",
 port: "3306"
});

app.get('/', function(req, res) 
{
 var response = { "page": "home" };
 res.send(JSON.stringify(response));
});

//Informs if we could connect the database or if we have an error
app.listen(3000, function() 
{
	db.connect(function(err) 
	{
		if (err) throw err;
		
		console.log('Connection to database successful!');
	});
	
	console.log('Example app listening on port 3000!');
});

//Relationship animals/cages
app.get('/cages/:id/animals', function(req, res) 
{
   var id = req.params.id;
   var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id;
   var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];

   for (var index in conditions)
   {
     if (conditions[index] in req.query)
     {
         if (query.indexOf("WHERE") < 0)
         {
             query += " WHERE";
         }
         else
         {
             query += " AND";
         }
      query += " " + conditions[index] + "='" +
     req.query[conditions[index]] + "'";
     }
   }

   if ("fields" in req.query)
   {
    query = query.replace("animals.*", req.query["fields"]);
   }


   if ("limit" in req.query) 
   {
		query += " LIMIT " + req.query["limit"];
		
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
		}
    }

   db.query(query, function(err, result, fields) 
   {
		if (err) throw err;
		res.send(JSON.stringify(result));
   });
});

//Relationship animals/cages
app.get('/cages/:id_cage/animals/:id_animals',function(req, res) {
	var id_cage = req.params.id_cage;
	var id_animals = req.params.id_animals;
    var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id_cage + " AND animals.id=" + id_animals;
    var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];

    for (var index in conditions)
    {
		if (conditions[index] in req.query)
        {
			if (query.indexOf("WHERE") < 0)
            {
                query += " WHERE";
            }
            else
            {
                query += " AND";
            }
    
		query += " " + conditions[index] + "='" +
        req.query[conditions[index]] + "'";
    
        }
    }


    if ("fields" in req.query)
    {
		query = query.replace("animals.*", req.query["fields"]);
    }
  
  
    if ("limit" in req.query) 
	{
		query += " LIMIT " + req.query["limit"];
        
		if ("offset" in req.query) 
		{
			query += " OFFSET " + req.query["offset"];
        }
    }
     
  
    db.query(query, function(err, result, fields) 
	{
       if (err) throw err;
       res.send(JSON.stringify(result));
    });
});

//Relationship cages/animals
app.get('/animals/:id_animal/cages', function(req, res) 
{
	var id_animal = req.params.id_animal;
    var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id="+id_animal;
    var conditions = ["name", "description","area"];
      
    for (var index in conditions)
    {
		if (conditions[index] in req.query)
		{
            if (query.indexOf("WHERE") < 0)
            {
                query += " WHERE";
            }
            else
			{
                query += " AND";
            }
      
           query += " " + conditions[index] + "='" +
           req.query[conditions[index]] + "'";
        }
    }
      
      
    if ("fields" in req.query)
    {
        query = query.replace("cages.*", req.query["fields"]);
    }
              
    if ("limit" in req.query) 
	{
        query += " LIMIT " + req.query["limit"];
        
		if ("offset" in req.query) 
		{
            query += " OFFSET " + req.query["offset"];
        }
    }
      
    db.query(query, function(err, result, fields) 
	{
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
      
//Relationship cages/animals
app.get('/animals/:id_animals/cages/:id_cage',function(req, res) 
{
	var id_cage = req.params.id_cage;
    var id_animals = req.params.id_animals;
    var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id="+id_animals+" AND cages.id="+id_cage;
    var conditions = ["name", "description","area"];
              
	for (var index in conditions)
    {
        if (conditions[index] in req.query)
        {
            if (query.indexOf("WHERE") < 0)
            {
                query += " WHERE";
            }
            else
            {
                query += " AND";
            }
              
                query += " " + conditions[index] + "='" +
                req.query[conditions[index]] + "'";
        }
    }
              
    if ("fields" in req.query)
    {
        query = query.replace("cages.*", req.query["fields"]);
    }
                          
    if ("limit" in req.query) 
	{
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) 
		{
            query += " OFFSET " + req.query["offset"];
        }
    }
                          
    db.query(query, function(err, result, fields) 
	{
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//Relationship food/animals            
app.get('/animals/:id/food', function(req, res) 
{
   var id = req.params.id;
   var query = "SELECT food.* FROM animals INNER JOIN food ON food.id_animal=animals.id WHERE animals.id=" + id;
   var conditions = ["name", "quantity","id_animal"];

   for (var index in conditions)
   {
     if (conditions[index] in req.query)
     {
         if (query.indexOf("WHERE") < 0)
         {
             query += " WHERE";
         }
         else
         {
             query += " AND";
         }
      query += " " + conditions[index] + "='" +
     req.query[conditions[index]] + "'";
      }
   }

   if ("fields" in req.query)
   {
    query = query.replace("food.*", req.query["fields"]);
   }


   if ("limit" in req.query) 
   {
       query += " LIMIT " + req.query["limit"];
       if ("offset" in req.query) 
	   {
			query += " OFFSET " + req.query["offset"];
       }
   }

   db.query(query, function(err, result, fields) 
   {
		if (err) throw err;
		res.send(JSON.stringify(result));
   });
});

//Relationship food/animals
app.get('/animals/:id_animals/food/:id_food',function(req, res) 
{
       var id_food = req.params.id_food;
       var id_animals = req.params.id_animals;
       var query = "SELECT food.* FROM animals INNER JOIN food ON food.id_animal=animals.id WHERE animals.id=" + id_animal + " AND food.id=" + id_food;
       var conditions = ["name", "quantity","id_animal"];

       for (var index in conditions)
       {
         if (conditions[index] in req.query)
         {
             if (query.indexOf("WHERE") < 0)
             {
                 query += " WHERE";
             }
             else
             {
                 query += " AND";
             }
    
         query += " " + conditions[index] + "='" +
         req.query[conditions[index]] + "'";
    
         }
       }
      
       if ("fields" in req.query)
       {
        query = query.replace("food.*", req.query["fields"]);
       }

       if ("limit" in req.query) 
	   {
           query += " LIMIT " + req.query["limit"];
           if ("offset" in req.query) 
		   {
				query += " OFFSET " + req.query["offset"];
           }
       }

       db.query(query, function(err, result, fields) 
	   {
			if (err) throw err;
			res.send(JSON.stringify(result));
       });
});

//Relationship animals/food
app.get('/food/:id_food/animals', function(req, res) 
{
        var id_food= req.params.id_food;
        var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id="+id_food;
        var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];

        for (var index in conditions)
        {
            if (conditions[index] in req.query)
            {
                 if (query.indexOf("WHERE") < 0)
                 {
                     query += " WHERE";
                 }
                 else
                 {
                     query += " AND";
                 }
        
             query += " " + conditions[index] + "='" +
             req.query[conditions[index]] + "'";
        
            }
        }

           if ("fields" in req.query)
           {
            query = query.replace("animals.*", req.query["fields"]);
           }

           if ("limit" in req.query) 
		   {
               query += " LIMIT " + req.query["limit"];
               if ("offset" in req.query) 
			   {
					query += " OFFSET " + req.query["offset"];
               }
           }


           db.query(query, function(err, result, fields) 
		   {
				if (err) throw err;
				res.send(JSON.stringify(result));
           });
});

//Relationship animals/food  
app.get('/food/:id_food/animals/:id_animal',function(req, res) 
{
    var id_food= req.params.id_food;
    var id_animal = req.params.id_animal;
    var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id="+id_food+" AND animals.id="+id_animal;
    var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];

    for (var index in conditions)
    {
        if (conditions[index] in req.query)
        {
			if (query.indexOf("WHERE") < 0)
            {
				query += " WHERE";
            }
            else
            {
                query += " AND";
            }
           
                query += " " + conditions[index] + "='" +
                req.query[conditions[index]] + "'";
           
        }
    }

    if ("fields" in req.query)
    {
        query = query.replace("animals.*", req.query["fields"]);
    }
 
    if ("limit" in req.query) 
	{
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) 
		{
            query += " OFFSET " + req.query["offset"];
        }
    }
             
    db.query(query, function(err, result, fields) 
	{
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
      
//Read all animals
app.get('/animals', function(req, res) {
 var query = "SELECT * FROM animals"
 var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];

 for (var index in conditions)
 {
   if (conditions[index] in req.query)
   {
       if (query.indexOf("WHERE") < 0)
       {
           query += " WHERE";
       }
       else
       {
           query += " AND";
       }

   query += " " + conditions[index] + "='" +
   req.query[conditions[index]] + "'";

   }
 }

 if ("sort" in req.query)
 {
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

  if ("fields" in req.query)
  {
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

//Read one animal
app.get('/animals/:id', function(req, res) {
 var id = req.params.id;
 var query = "SELECT * FROM animals WHERE id=" + id;

 var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];

 for (var index in conditions)
 {
   if (conditions[index] in req.query)
   {
       if (query.indexOf("WHERE") < 0)
       {
           query += " WHERE";
       }
       else
       {
           query += " AND";
       }

   query += " " + conditions[index] + "='" +
   req.query[conditions[index]] + "'";

   }
 }

 if ("sort" in req.query)
 {
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

  if ("fields" in req.query)
  {
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

//Read all cages
app.get('/cages', function(req, res) {
 var query = "SELECT * FROM cages";
 var conditions = ["name", "description","area"];

 for (var index in conditions)
 {
   if (conditions[index] in req.query)
   {
       if (query.indexOf("WHERE") < 0)
       {
           query += " WHERE";
       }
       else
       {
           query += " AND";
       }

   query += " " + conditions[index] + "='" +
   req.query[conditions[index]] + "'";

   }
 }

 if ("sort" in req.query)
 {
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

  if ("fields" in req.query)
  {
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

//Read a cage
app.get('/cages/:id', function(req, res) {
 var id = req.params.id;
 var query = "SELECT * FROM cages WHERE id=" + id;
 var conditions = ["name", "description","area"];

 for (var index in conditions)
 {
   if (conditions[index] in req.query)
   {
       if (query.indexOf("WHERE") < 0)
       {
           query += " WHERE";
       }
       else
       {
           query += " AND";
       }

   query += " " + conditions[index] + "='" +
   req.query[conditions[index]] + "'";

   }
 }

 if ("sort" in req.query)
 {
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

  if ("fields" in req.query)
  {
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

//Read all food
app.get('/food', function(req, res) {
 var query = "SELECT * FROM food"
 var conditions = ["name", "quantity","id_animal"];

 for (var index in conditions)
 {
   if (conditions[index] in req.query)
   {
       if (query.indexOf("WHERE") < 0)
       {
           query += " WHERE";
       }
       else
       {
           query += " AND";
       }

   query += " " + conditions[index] + "='" +
   req.query[conditions[index]] + "'";

   }
 }

 if ("sort" in req.query)
 {
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

  if ("fields" in req.query)
  {
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

//Read a food
app.get('/food/:id', function(req, res) {
 var id = req.params.id;
 var query = "SELECT * FROM food WHERE id=" + id;

 var conditions = ["name", "quantity","id_animal"];

 for (var index in conditions)
 {
   if (conditions[index] in req.query)
   {
       if (query.indexOf("WHERE") < 0)
       {
           query += " WHERE";
       }
       else
       {
           query += " AND";
       }

   query += " " + conditions[index] + "='" +
   req.query[conditions[index]] + "'";

   }
 }

 if ("sort" in req.query)
 {
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

  if ("fields" in req.query)
  {
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

//Read all staff
app.get('/staff', function(req, res) {
 var query = "SELECT * FROM staff";

 var conditions = ["firstname", "lastname","wage"];
 for (var index in conditions)
 {
   if (conditions[index] in req.query)
   {
       if (query.indexOf("WHERE") < 0)
       {
           query += " WHERE";
       }
       else
       {
           query += " AND";
       }

   query += " " + conditions[index] + "='" +
   req.query[conditions[index]] + "'";

   }
 }

 if ("sort" in req.query)
 {
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

  if ("fields" in req.query)
  {
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

//Read food stats
app.get('/food-stats', function(req, res) {
   var query = "SELECT animals.id, if(food_per_day=0,0,quantity/food_per_day) as days_left FROM animals JOIN food WHERE animals.id = food.id_animal;"
   db.query(query, function(err, result, fields) {
     if (err) throw err;
     res.send(JSON.stringify(result));
   });
 });
 
//Read one staff member
app.get('/staff/:id', function(req, res) {
 var id = req.params.id;
 var query = "SELECT * FROM staff WHERE id=" + id;
 var conditions = ["firstname", "lastname","wage"];
  for (var index in conditions)
 {
   if (conditions[index] in req.query)
   {
       if (query.indexOf("WHERE") < 0)
       {
           query += " WHERE";
       }
       else
       {
           query += " AND";
       }

   query += " " + conditions[index] + "='" +
   req.query[conditions[index]] + "'";

   }
 }

 if ("sort" in req.query)
 {
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

  if ("fields" in req.query)
  {
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

//delete all animals
app.delete('/animals', function(req, res) {
 var query = "DELETE FROM animals";
 db.query(query, function(err, result, fields) {
   if (err) throw err;
   res.send(JSON.stringify("Success"));
 });
});

//delete one animal
app.delete('/animals/:id', function(req, res) {
 var id = req.params.id;
 var query = "DELETE FROM animals WHERE id=" + id;
 db.query(query, function(err, result, fields) {
   if (err) throw err;
   res.send(JSON.stringify("Success"));
 });
});

//delete all cages
app.delete('/cages', function(req, res) {
 var query = "DELETE FROM cages";
 db.query(query, function(err, result, fields) {
   if (err) throw err;
   res.send(JSON.stringify("Success"));
 });
});

//delete a cage
app.delete('/cages/:id', function(req, res) {
 var id = req.params.id;
 var query = "DELETE FROM cages WHERE id=" + id;
 db.query(query, function(err, result, fields) {
   if (err) throw err;
   res.send(JSON.stringify("Success"));
 });
});

//delete all food
app.delete('/food', function(req, res) {
 var query = "DELETE FROM food";
 db.query(query, function(err, result, fields) {
   if (err) throw err;
   res.send(JSON.stringify("Success"));
 });
});

//delete a food
app.delete('/food/:id', function(req, res) {
 var id = req.params.id;
 var query = "DELETE FROM food WHERE id=" + id;
 db.query(query, function(err, result, fields) {
   if (err) throw err;
   res.send(JSON.stringify("Success"));
 });
});

//delete all staff
app.delete('/staff', function(req, res) {
 var query = "DELETE FROM staff";
 db.query(query, function(err, result, fields) {
   if (err) throw err;
   res.send(JSON.stringify("Success"));
 });
});

//delete a staff member
app.delete('/staff/:id', function(req, res) {
 var id = req.params.id;
 var query = "DELETE FROM staff WHERE id=" + id;
 db.query(query, function(err, result, fields) {
   if (err) throw err;
   res.send(JSON.stringify("Success"));
 });
});

//Insert into staff
app.post('/staff', function(req, res) {
 var firstname = req.body.firstname;
 var lastname = req.body.lastname;
 var wage = req.body.wage;

 var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ( '"+firstname+"','"+lastname+"',"+wage+")";
 db.query(query, function(err, result, fields) {
   if (err) throw err;
   res.send(JSON.stringify("Success"));
 });
});

//Insert into cages
app.post('/cages', function(req, res) {
 var name = req.body.name;
 var description = req.body.description;
 var area = req.body.area;

 var query = "INSERT INTO cages (name,description,area) VALUES ('"+name+"','"+description+"', "+area+ ")";
 db.query(query, function(err, result, fields) {
   if (err) throw err;
   res.send(JSON.stringify("Success"));
 });
});

//Insert into animals
app.post('/animals', function(req, res) {
 var name = req.body.name;
 var breed = req.body.breed;
 var food_per_day = req.body.food_per_day;
 var birthday = req.body.birthday;
 var entry_date = req.body.entry_date;
 var id_cage = req.body.id_cage;

 var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('"+name+"', '"+breed+"', "+food_per_day+", '" +birthday+"','"+entry_date+"',"+id_cage+")";
 db.query(query, function(err, result, fields) {
   if (err) throw err;
   res.send(JSON.stringify("Success"));
 });
});

//Insert into food
app.post('/food', function(req, res) {
 var id = req.body.id;
 var name = req.body.name;
 var quantity = req.body.quantity; 
 var id_animal = req.body.id_animal;
  var query = "INSERT INTO food (name,quantity,id_animal) VALUES ('"+name+"',"+quantity+","+id_animal+")";
 db.query(query, function(err, result, fields) {
   if (err) throw err;
   res.send(JSON.stringify("Success"));
 });
});

//Update staff
app.put('/staff/:id', function(req, res) {
 var id = req.params.id;
 var firstname = req.body.firstname;
 var lastname = req.body.lastname;
 var wage = req.body.wage;
 var coma = ",";
 var bool = false;
 var query = "UPDATE staff SET";
 
 if(firstname)
 {
     query+=" firstname = '" + firstname + "'";
     if(!bool)
     {
       bool=true;
     }
 }

 if(lastname)
 {
   if(bool)
   {
     query+=coma;
   }
   else
   {
       bool=true;
   }
     query+=" lastname = '" + lastname + "'";
 }

 if(wage)
 {
   if(bool)
   {
     query+=coma;
   }
     query+=" wage = " + wage + "";
 }

   query+=" WHERE id="+ id;

 
 db.query(query, function(err, result, fields) {
   if (err) throw err;
   res.send(JSON.stringify("Success"));
 });
});

//Update cages
app.put('/cages/:id', function(req, res) {
 var id = req.params.id;
 var name = req.body.name;
 var description = req.body.description;
 var area = req.body.area;
 var coma = ",";
 var bool = false;
 var query = "UPDATE cages SET";

 if(name)
 {
     query+=" name = '" + name + "'";
     if(!bool)
     {
       bool=true;
     }
 }

 if(description)
 {
   if(bool)
   {
     query+=coma;
   }
   else
   {
       bool=true;
   }
     query+=" description = '" + description + "'";
 }

 if(area)
 {
   if(bool)
   {
     query+=coma;
   }
     query+=" area = " + area + "";
 }

  query+=" WHERE id="+ id;

 db.query(query, function(err, result, fields) {
   if (err) throw err;
   res.send(JSON.stringify("Success"));
 });
});

//Update animals
app.put('/animals/:id', function(req, res) {
   var id = req.params.id;
   var name = req.body.name;
   var breed = req.body.breed;
   var food_per_day = req.body.food_per_day;
   var birthday = req.body.birthday;
   var entry_date = req.body.entry_date;
   var id_cage = req.body.id_cage;
  var coma = ",";
   var bool = false;
   var query = "UPDATE animals SET";
 
  if(name)
   {
       query+=" name = '" + name + "'";
       if(!bool)
       {
         bool=true;
       }
   }
 
   if(breed)
   {
     if(bool)
     {
       query+=coma;
     }
     else
     {
         bool=true;
     }
       query+=" breed= '" + breed+ "'";
   }
 
   if(food_per_day)
   {
     if(bool)
     {
       query+=coma;
     }
       query+=" food_per_day = " +food_per_day+ "";
   }
 
  if(birthday)
   {
     if(bool)
     {
       query+=coma;
     }
     else
     {
         bool=true;
     }
       query+="birthday='"+birthday+"'";
   }
 
  if(entry_date)
   {
     if(bool)
     {
       query+=coma;
     }
     else
     {
         bool=true;
     }
       query+="entry_date='"+entry_date+"'";
   }
 
  if(id_cage)
   {
     if(bool)
     {
       query+=coma;
     }
       query+=" id_cage = " +id_cage+ "";
   }
 
    query+=" WHERE id="+ id;
 
 
   db.query(query, function(err, result, fields) {
     if (err) throw err;
     res.send(JSON.stringify("Success"));
   });
  });
 
//Update food
app.put('/food/:id', function(req, res) {
   var id = req.params.id;
   var name = req.body.name;
   var quantity = req.body.quantity;
   var id_animal = req.body.id_animal;
   var coma = ",";
   var bool = false;
   var query = "UPDATE food SET";
 
 
  if(name)
   {
     if(bool)
     {
       query+=coma;
     }
     else
     {
         bool=true;
     }
       query+=" name= '" + name+ "'";
   }
 
   if(quantity)
   {
     if(bool)
     {
       query+=coma;
     }
       query+=" quantity = " +quantity+ "";
   }
 
  if(id_animal)
   {
     if(bool)
     {
       query+=coma;
     }
       query+=" id_animal = " +id_animal+ "";
   }
 
  query+=" WHERE id="+ id;
 
   db.query(query, function(err, result, fields) {
     if (err) throw err;
     res.send(JSON.stringify("Success"));
   });
  });
