

const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var db = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database: "project",
port: "3306"
});

app.use(function(req,res,next){
	console.log("Requete : ",req.method,req.originalUrl,req.query);
	if(req.body.constructor === Object && Object.keys(req.body).length === 0){
	}
	else{
		console.log("	Body : ",req.body);
	}
	next();
})

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
res.status("403").send();
}
});
} else {
res.status("403").send();
}
});

app.listen(3000, function() {
db.connect(function(err) {
if (err) throw err;
console.log('Connection to database successful!');
});
console.log('Example app listening on port 3000!');
});

app.post('/staff', function(req, res) {
var id = req.body.id;
var firstname = req.body.firstname;
var lastname = req.body.lastname;
var wage = req.body.wage;


var query = "INSERT INTO staff (firstname,lastname,wage) VALUES ('"+firstname+"','"+lastname+"'," +wage+")";
db.query(query, function(err, result, fields) {
if (err) throw err;

res.send(JSON.stringify("Create with Success"));

});
});

app.get('/staff', function(req, res) {   
var query = "SELECT * FROM staff ";

 var conditions = ["firstname","lastname","wage"];

 for (var index in conditions){
 	if(conditions[index] in req.query)
 	{
 		if(query.indexOf("WHERE")<0){
 			query+= "WHERE";
 		}else{
 			query+="AND";

 		}
 		query += " " + conditions[index] + "='"+ req.query[conditions[index]] + "'";
 	}
 } 
 	 
  if ("limit" in req.query) {         query += " LIMIT " + req.query["limit"]; 
         if ("offset" in req.query) {             query += " OFFSET " + req.query["offset"];         }     } 
     if ("sort" in req.query)

      {         var sort = req.query["sort"].split(",");         query += " ORDER BY"; 
         for (var index in sort) {           
           var direction = sort[index].substr(0, 1);            
            var field = sort[index].substr(1); 
            
          query += " " + field; 
             
          if (direction == "-")              

             query += " DESC,";            
             else                 query += " ASC,";         } 
         query = query.slice(0, -1);     } 

       if ("fields" in req.query) {         query = query.replace("*", req.query["fields"]);     } 
     db.query(query, function(err, result, fields) {         if (err) throw err; 
         res.send(JSON.stringify(result));     }); });

app.get('/staff/:id', function(req, res) {//fait
var id = req.params.id;
var query = "SELECT * FROM staff WHERE id=" + id;


     if ("sort" in req.query)
      {         var sort = req.query["sort"].split(",");         query += " ORDER BY"; 
         for (var index in sort) {           
           var direction = sort[index].substr(0, 1);            
            var field = sort[index].substr(1); 
            
          query += " " + field; 
             
          if (direction == "-")              

             query += " DESC,";            
             else                 query += " ASC,";         } 
         query = query.slice(0, -1);     } 

       if ("fields" in req.query) {         query = query.replace("*", req.query["fields"]);     } 
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});



app.delete('/staff', function(req, res) {
var query = "DELETE FROM staff";
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
res.send(JSON.stringify("DELETE with Success"));
});
});

app.put('/staff/:id', function(req, res) {
	var id = req.params.id;
	var query = "UPDATE staff SET ";
	var conditions = ["firstname", "lastname","wage"];
	var i=0;
	for (var index in conditions) {
		if (conditions[index] in req.body) {
			if (i==0) {
				query += "";
				i+=1;
			} else {
				query += " , ";
			} 
			query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";
		}
	}
	query += " WHERE id="+ id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});


app.post('/animals', function(req, res) {


var id = req.body.id;
var name = req.body.name;
var breed = req.body.breed;
var food_per_day = req.body.food_per_day;
var birthday = req.body.birthday;
var entry_date = req.body.entry_date;
var id_cage = req.body.id_cage;






var query = "INSERT INTO animals (name,breed,food_per_day,birthday,entry_date,id_cage) VALUES ('"+name+"','"+breed+"',"+food_per_day+",'"+birthday+"','"+entry_date+"',"+id_cage+")";
db.query(query, function(err, result, fields) {
if (err) throw err;

res.send(JSON.stringify("Create with Success"));

});
});

app.get('/animals', function(req, res) {   

 var query = "SELECT * FROM animals "; 

 var conditions = ["name","breed","food_per_day","birthday","entry_date","id_cage"];

 for (var index in conditions){
 	if(conditions[index] in req.query)
 	{
 		if(query.indexOf("WHERE")<0){
 			query+= "WHERE";
 		}else{
 			query+="AND";

 		}
 		query += " " + conditions[index] + "='"+ req.query[conditions[index]] + "'";
 	}
 } 
 	  if ("limit" in req.query) {         query += " LIMIT " + req.query["limit"]; 
         if ("offset" in req.query) {             query += " OFFSET " + req.query["offset"];         }     } 

     if ("sort" in req.query)
      {         var sort = req.query["sort"].split(",");         query += " ORDER BY"; 
         for (var index in sort) {           
           var direction = sort[index].substr(0, 1);            
            var field = sort[index].substr(1); 
            
          query += " " + field; 
             
          if (direction == "-")              

             query += " DESC,";            
             else                 query += " ASC,";         } 
         query = query.slice(0, -1);     } 

       if ("fields" in req.query) {         query = query.replace("*", req.query["fields"]);     } 
     db.query(query, function(err, result, fields) {         if (err) throw err; 
         res.send(JSON.stringify(result));     }); });


app.get('/animals/:id', function(req, res) {
var id= req.params.id;
var query = "SELECT * FROM animals WHERE id=" + id;


if ("limit" in req.query) {         query += " LIMIT " + req.query["limit"]; 
         if ("offset" in req.query) {             query += " OFFSET " + req.query["offset"];         }     } 

     if ("sort" in req.query)
      {         var sort = req.query["sort"].split(",");         query += " ORDER BY"; 
         for (var index in sort) {           
           var direction = sort[index].substr(0, 1);            
            var field = sort[index].substr(1); 
            
          query += " " + field; 
             
          if (direction == "-")              

             query += " DESC,";            
             else                 query += " ASC,";         } 
         query = query.slice(0, -1);     } 

       if ("fields" in req.query) {         query = query.replace("*", req.query["fields"]);     } 
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});

app.delete('/animals', function(req, res) {
var query = "DELETE FROM animals";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});
app.delete('/animals/:id', function(req, res) {
var id = req.params.id;
var query = "DELETE FROM animals WHERE id=" + id;
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("DELETE with Success"));
});
});


app.put('/animals/:id', function(req, res) {
	var id = req.params.id;
	var query = "UPDATE animals SET ";
	var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
	var i=0;
	for (var index in conditions) {
		if (conditions[index] in req.body) {
			if (i==0) {
				query += "";
				i+=1;
			} else {
				query += " , ";
			} 
			query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";
		}
	}
	query += " WHERE id="+ id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.post('/food', function(req, res) {

var id = req.body.id;
var name= req.body.name;
var quantity = req.body.quantity;
var id_animal = req.body.id_animal;




var query = "INSERT INTO food (name,quantity ,id_animal ) VALUES ('"+name+"'," +quantity+",'"+id_animal+"')";
db.query(query, function(err, result, fields) {
if (err) throw err;

res.send(JSON.stringify("Create with Success"));

});
});

app.get('/food', function(req, res) {   

 var query = "SELECT * FROM food "; 

 var conditions = ["name","quantity","id_animal"];

 for (var index in conditions){
 	if(conditions[index] in req.query)
 	{
 		if(query.indexOf("WHERE")<0){
 			query+= "WHERE";
 		}else{
 			query+="AND";

 		}
 		query += " " + conditions[index] + "='"+ req.query[conditions[index]] + "'";
 	}
 } 
 	  if ("limit" in req.query) {         query += " LIMIT " + req.query["limit"]; 
         if ("offset" in req.query) {             query += " OFFSET " + req.query["offset"];         }     } 

     if ("sort" in req.query)
      {         var sort = req.query["sort"].split(",");         query += " ORDER BY"; 
         for (var index in sort) {           
           var direction = sort[index].substr(0, 1);            
            var field = sort[index].substr(1); 
            
          query += " " + field; 
             
          if (direction == "-")              

             query += " DESC,";            
             else                 query += " ASC,";         } 
         query = query.slice(0, -1);     } 

       if ("fields" in req.query) {         query = query.replace("*", req.query["fields"]);     } 
     db.query(query, function(err, result, fields) {         if (err) throw err; 
         res.send(JSON.stringify(result));     }); });




app.get('/food/:id', function(req, res) {
var id = req.params.id;
var query = "SELECT * FROM food WHERE id=" + id;
if ("limit" in req.query) {         query += " LIMIT " + req.query["limit"]; 
         if ("offset" in req.query) {             query += " OFFSET " + req.query["offset"];         }     } 

     if ("sort" in req.query)
      {         var sort = req.query["sort"].split(",");         query += " ORDER BY"; 
         for (var index in sort) {           
           var direction = sort[index].substr(0, 1);            
            var field = sort[index].substr(1); 
            
          query += " " + field; 
             
          if (direction == "-")              

             query += " DESC,";            
             else                 query += " ASC,";         } 
         query = query.slice(0, -1);     } 

       if ("fields" in req.query) {         query = query.replace("*", req.query["fields"]);     } 			
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});



app.delete('/food', function(req, res) {
var query = "DELETE FROM food";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});
app.delete('/food/:id', function(req, res) {
var id = req.params.id;
var query = "DELETE FROM food WHERE id=" + id;
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("DELETE with Success"));
});
});



app.put('/food/:id', function(req, res) {
	var id = req.params.id;
	var query = "UPDATE food SET ";
	var conditions = ["name", "quantity","id_animal"];
	var i=0;
	for (var index in conditions) {
		if (conditions[index] in req.body) {
			if (i==0) {
				query += "";
				i+=1;
			} else {
				query += " , ";
			} 
			query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";
		}
	}
	query += " WHERE id="+ id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.post('/cages', function(req, res) {


var id = req.body.id;
var name= req.body.name;
var description = req.body.description;
var area = req.body.area;


var query = "INSERT INTO cages (name,description,area) VALUES ('"+name+"','"+description+"'," +area+")";
db.query(query, function(err, result, fields) {
if (err) throw err;


res.send(JSON.stringify("Create with Success"));

});
});


app.get('/cages/:id', function(req, res) {
var id = req.params.id;






var query = "SELECT * FROM cages WHERE id=" + id;


 var conditions = ["name","description","area"];

 for (var index in conditions){
 	if(conditions[index] in req.query)
 	{
 		if(query.indexOf("WHERE")<0){
 			query+= "WHERE";
 		}else{
 			query+="AND";

 		}
 		query += " " + conditions[index] + "='"+ req.query[conditions[index]] + "'";
 	}
 } 


if ("limit" in req.query) {         query += " LIMIT " + req.query["limit"]; 
         if ("offset" in req.query) {             query += " OFFSET " + req.query["offset"];         }     } 

     if ("sort" in req.query)
      {         var sort = req.query["sort"].split(",");         query += " ORDER BY"; 
         for (var index in sort) {           
           var direction = sort[index].substr(0, 1);            
            var field = sort[index].substr(1); 
            
          query += " " + field; 
             
          if (direction == "-")              

             query += " DESC,";            
             else                 query += " ASC,";         } 
         query = query.slice(0, -1);     } 

       if ("fields" in req.query) {         query = query.replace("*", req.query["fields"]);     } 
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});

app.get('/cages', function(req, res) {   

 var query = "SELECT * FROM cages "; 

  var conditions = ["name","description","area"];

 for (var index in conditions){
 	if(conditions[index] in req.query)
 	{
 		if(query.indexOf("WHERE")<0){
 			query+= "WHERE";
 		}else{
 			query+="AND";

 		}
 		query += " " + conditions[index] + "='"+ req.query[conditions[index]] + "'";
 	}
 } 

 	  if ("limit" in req.query) {         query += " LIMIT " + req.query["limit"]; 
         if ("offset" in req.query) {             query += " OFFSET " + req.query["offset"];         }     } 

     if ("sort" in req.query)
      {         var sort = req.query["sort"].split(",");         query += " ORDER BY"; 
         for (var index in sort) {           
           var direction = sort[index].substr(0, 1);            
            var field = sort[index].substr(1); 
            
          query += " " + field; 
             
          if (direction == "-")              

             query += " DESC,";            
             else                 query += " ASC,";         } 
         query = query.slice(0, -1);     } 

       if ("fields" in req.query) {         query = query.replace("*", req.query["fields"]);     } 
     db.query(query, function(err, result, fields) {         if (err) throw err; 
         res.send(JSON.stringify(result));     }); });

app.put('/cages/:id', function(req, res) {
	var id = req.params.id;
	var query = "UPDATE cages SET ";
	var conditions = ["name", "description","area"];
	var i=0;
	for (var index in conditions) {
		if (conditions[index] in req.body) {
			if (i==0) {
				query += "";
				i+=1;
			} else {
				query += " , ";
			} 
			query += " " + conditions[index] + "='" + req.body[conditions[index]] + "'";
		}
	}
	query += " WHERE id="+ id;
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

app.delete('/cages', function(req, res) {
var query = "DELETE FROM cages";
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("Success"));
});
});
app.delete('/cages/:id', function(req, res) {
var id = req.params.id;
var query = "DELETE FROM cages WHERE id=" + id;
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify("DELETE with Success"));
});
});




app.get('/animals/:id/food', function(req, res) {
var id = req.params.id;

var query = "SELECT food.* FROM food INNER JOIN animals ON animals.id = food.id_animal  WHERE animals.id= '" + id +"'";

 var conditions = ["name","quantity","id_animal"];

 for (var index in conditions){
 	if(conditions[index] in req.query)
 	{
 		if(query.indexOf("WHERE")<0){
 			query+= "WHERE";
 		}else{
 			query+="AND";

 		}
 		query += " " + conditions[index] + "='"+ req.query[conditions[index]] + "'";
 	}
 } 

 	  if ("limit" in req.query) {         query += " LIMIT " + req.query["limit"]; 
         if ("offset" in req.query) {             query += " OFFSET " + req.query["offset"];         }     } 
 if ("fields" in req.query) {         query = query.replace("*", req.query["fields"]);     }
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});

app.get('/food/:id/animals', function(req, res) {
var id = req.params.id;

var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal  WHERE food.id = '" + id +"'";

 var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
 for (var index in conditions){
 	if(conditions[index] in req.query)
 	{
 		if(query.indexOf("WHERE")<0){
 			query+= "WHERE";
 		}else{
 			query+="AND";

 		}
 		query += " " + conditions[index] + "='"+ req.query[conditions[index]] + "'";
 	}
 } 

 	  if ("limit" in req.query) {         query += " LIMIT " + req.query["limit"]; 
         if ("offset" in req.query) {             query += " OFFSET " + req.query["offset"];         }     } 
 if ("fields" in req.query) {         query = query.replace("*", req.query["fields"]);     }
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});



app.get('/food/:id_animal/animals/:id', function(req, res) {
var id = req.params.id;
var id_animal = req.params.id_animal;
var query = " SELECT animals.* FROM food INNER JOIN animals ON animals.id = food.id_animal  WHERE animals.id= " + id + " AND food.id= '" +id_animal+ "'";

 var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];

 for (var index in conditions){
 	if(conditions[index] in req.query)
 	{
 		if(query.indexOf("WHERE")<0){
 			query+= "WHERE";
 		}else{
 			query+="AND";

 		}
 		query += " " + conditions[index] + "='"+ req.query[conditions[index]] + "'";
 	}
 } 

 	  if ("limit" in req.query) {         query += " LIMIT " + req.query["limit"]; 
         if ("offset" in req.query) {             query += " OFFSET " + req.query["offset"];         }     } 
 if ("fields" in req.query) {         query = query.replace("*", req.query["fields"]);     }
 
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});







app.get('/animals/:id/cages', function(req, res) {
var id = req.params.id;

var query = "SELECT cages.* FROM cages INNER JOIN animals ON animals.id_cage = cages.id  WHERE animals.id= '" + id +"'";

 var conditions = ["name","description","area"];

 for (var index in conditions){
 	if(conditions[index] in req.query)
 	{
 		if(query.indexOf("WHERE")<0){
 			query+= "WHERE";
 		}else{
 			query+="AND";

 		}
 		query += " " + conditions[index] + "='"+ req.query[conditions[index]] + "'";
 	}
 } 

 	  if ("limit" in req.query) {         query += " LIMIT " + req.query["limit"]; 
         if ("offset" in req.query) {             query += " OFFSET " + req.query["offset"];         }     } 
 if ("fields" in req.query) {         query = query.replace("*", req.query["fields"]);     }
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});

app.get('/cages/:id/animals', function(req, res) {
var id = req.params.id;

var query = "SELECT animals.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id  WHERE cages.id= '" + id +"'";

 var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
 for (var index in conditions){
 	if(conditions[index] in req.query)
 	{
 		if(query.indexOf("WHERE")<0){
 			query+= "WHERE";
 		}else{
 			query+="AND";

 		}
 		query += " " + conditions[index] + "='"+ req.query[conditions[index]] + "'";
 	}
 } 

 	  if ("limit" in req.query) {         query += " LIMIT " + req.query["limit"]; 
         if ("offset" in req.query) {             query += " OFFSET " + req.query["offset"];         }     } 
 if ("fields" in req.query) {         query = query.replace("*", req.query["fields"]);     }
db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});





app.get('/animals/:id_cage/cages/:id', function(req, res) {
var id = req.params.id;
var id_cage = req.params.id_cage;
var query = " SELECT cages.* FROM cages INNER JOIN animals ON animals.id_cage = cages.id  WHERE animals.id= " + id_cage + " AND cages.id='" +id+ "'";

 var conditions = ["name","description","area"];

 for (var index in conditions){
 	if(conditions[index] in req.query)
 	{
 		if(query.indexOf("WHERE")<0){
 			query+= "WHERE";
 		}else{
 			query+="AND";

 		}
 		query += " " + conditions[index] + "='"+ req.query[conditions[index]] + "'";
 	}
 } 

 	  if ("limit" in req.query) {         query += " LIMIT " + req.query["limit"]; 
         if ("offset" in req.query) {             query += " OFFSET " + req.query["offset"];         }     } 
 if ("fields" in req.query) {         query = query.replace("*", req.query["fields"]);     }

db.query(query, function(err, result, fields) {
if (err) throw err;
res.send(JSON.stringify(result));
});
});











