const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

/**
 *
 *	Check if the argument is an array or not
 *
 */
 function isArray(a) {

 	return (Array.isArray(a));
 };

/**
*	
*	Return the query with filters.
* 	req : contains all the data about the request
*	query : the SQL statement without the filter
*	conditions : the array of the fields
*	table : the table name
*
*/
function filter(req,query,conditions,table){
	//filter with condition
	for (var index in conditions) {
		// if the condition is on the correct field
		if (conditions[index] in req.query) {
			//if no Where clause is found
			if (query.indexOf("WHERE") < 0) {
				//add it
				query += " WHERE";
			} else {
				//else add an AND 
				query += " AND";
			}
			query += " " +table+"."+ conditions[index] + "='" +
			req.query[conditions[index]] + "'";
		}
	}
	// sort the results
	if ("sort" in req.query) {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";
		for (var index in sort) {
			// get + or - in the direction variable
			var direction = sort[index].substr(0, 1);
			// get the field name
			var field = sort[index].substr(1);
			// add it on the query
			query += " "+table+"."+ field;
			if (direction == "-")
				query += " DESC,";
			else
				query += " ASC,";
		}
		// remove the coma
		query = query.slice(0, -1);

	}
	// filter the fields
	if ("fields" in req.query) {

		// get the array of fields 
		field_array= req.query["fields"];
		// if it's not an array
		if(!isArray(field_array))
		{
			// add the name of the table before the field
			field_array = table+"."+field_array;
		}
		else{

			// a loop among the fields
			for(var i=0; i<field_array.length; i++)
			{
				// add the name of the table before the field
				field_array[i] = table+"."+field_array[i];
			}
		}
		// replace the actual select by the new one
		query = query.replace(table+".*", field_array);
	}
	// limit and pagination
	if ("limit" in req.query) {
		// add limit to the query
		query += " LIMIT " + req.query["limit"];
		// if offset is asked, add it to the query
		if ("offset" in req.query) {
			query += " OFFSET " + req.query["offset"];
		}
	}
	return query;
}
// connect to the database
var db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "zoo",
	port: "3306"
});
// wirefall function called before every route
app.use(function(req, res, next) {
	// check if the key argument is in the URL
	if ("key" in req.query) {
		// get the value of the token
		var key = req.query["key"];
		// execute a SQL query to check if the token is in the database
		var query = "SELECT * FROM users WHERE apikey='" + key + "'";
		db.query(query, function(err, result, fields) {
			if (err) throw err;
			// if a result is found
			if (result.length > 0) {
				// We can acces to the route
				next();
			}
			else {
				// send a HHTP 403 error
				res.status(403).send('Forbidden');
			}
		});
	} else {
		// send a HHTP 403 error
		res.status(403).send('Forbidden');
	}
});
//animals
//Creation
/**
*
*	Create animal Route
*
*/
app.post('/animals', function(req, res) {
	// variable
	var name = req.body.name;
	var breed = req.body.breed;
	var food_per_day = req.body.food_per_day;
	var birthday = req.body.birthday;
	var entry_date = req.body.entry_date;
	var id_cage = req.body.id_cage;
	// query
	var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('"+name+"', '"+breed+"', '"+food_per_day+"', '"+birthday+"', '"+entry_date+"', '"+id_cage+"')";
	// execute the query in the database 
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
//Reading
/**
*
*	Read animals Route
*
*/
app.get('/animals', function(req, res) {
	// query
	var query = "SELECT animals.* FROM animals";
	// fields in the table
	var conditions = ["id","name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
	
	// call the filter function
	query = filter(req,query,conditions,"animals");

	// execute the query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
/**
*
*	Read animal with id Route
*
*/
app.get('/animals/:id', function(req, res) {
	// get id from parameters
	var id = req.params.id;
	// query 
	var query = "SELECT animals.* FROM animals WHERE id=" + id;
	// fields in the table
	var conditions = ["id","name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
	
	// call the filter function
	query = filter(req,query,conditions,"animals");

	// execute the query 
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

/**
*
*	Read foods of one animal Route
*
*/
app.get('/animals/:id/food', function(req, res) {
	// get the id from parameters
	var id = req.params.id;
	// query
	var query = "SELECT food.* FROM food INNER JOIN animals on id_animal = animals.id WHERE id_animal=" + id;
	// fields in the table
	var conditions = ["id", "name", "id_animal", "quantity"];

	// call the filter function
	query = filter(req,query,conditions,"food");
	// execute the query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

/**
*
*	Read food with id of one animal Route
*
*/
app.get('/animals/:id/food/:id_food', function(req, res) {
	// get the id of animal and id of food from parameters
	var id = req.params.id;
	var id_food = req.params.id_food;
	// query
	var query = "SELECT food.* FROM food INNER JOIN animals on id_animal = animals.id WHERE id_animal=" + id + " and "+ id_food +" =food.id";
	// field in the table
	var conditions = ["id", "name", "id_animal", "quantity"];
	// call the filter function
	query = filter(req,query,conditions,"food");
	// execute query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
/**
*
*	Read cages of one animal Route
*
*/
app.get('/animals/:id/cages', function(req, res) {
	// get id from parameters
	var id = req.params.id;
	// query
	var query = "SELECT cages.* FROM animals inner join cages on animals.id_cage=cages.id WHERE animals.id = " + id;
	// field in the table
	var conditions = ["id", "name", "description", "area"];
	// call the filter function
	query = filter(req,query,conditions,"cages");
	// execute the query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
/**
*
*	Read cage with id of one animal Route
*
*/
app.get('/animals/:id/cages/:id_cage', function(req, res) {	
	// get id of animal and id of cage	
	var id = req.params.id;
	var id_cage = req.params.id_cage;
	// query
	var query = "SELECT cages.* FROM animals inner join cages on animals.id_cage=cages.id WHERE animals.id = " + id + " and cages.id = " + id_cage;	
	// field in the table
	var conditions = ["id","name", "description", "area"];
	// call the filter function
	query = filter(req,query,conditions,"cages");
	// execute the query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
//update
/**
*
*	Update animal with id Route
*
*/
app.put('/animals/:id', function(req, res) {
	// get id from parameters
	var id = req.params.id;

	// begining of the SQL query
	var query = "UPDATE animals SET id =" + id;
	
	// if name is updated
	if("name" in req.body){
		// add it to the query
		query += ", name = '"+req.body.name+"'";
	}
	// if breed is update
	if("breed" in req.body){
		// add it to the query
		query += ", breed = '"+req.body.breed+"'";
	}
	// if food_per_day is updated
	if("food_per_day" in req.body ){
		// add it to the query
		query += ", food_per_day = "+req.body.food_per_day;
	}
	// if birthday is updated
	if("birthday" in req.body ){
		// add it to the query
		query += ", birthday = '"+req.body.birthday+"'";
	}
	// if entry_date is updated
	if("entry_date" in req.body  ){
		// add it to the query
		query += ", entry_date = '"+req.body.entry_date+"'";
	}
	// if id_cage is update
	if("id_cage" in req.body  ){
		// add it to the query
		query += ", id_cage = "+req.body.id_cage+"";
	}
	// end the query by the selecting the animal with the id in parameter
	query += " WHERE id = "+id;
	// execute the query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//delete
/**
*
*	Delete all animals  Route
*
*/
app.delete('/animals', function(req, res) {
	// query
	var query = "DELETE FROM animals";
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
/**
*
*	Delete animal with id Route
*
*/
app.delete('/animals/:id', function(req, res) {
	// get id from parameters
	var id = req.params.id;
	// query
	var query = "DELETE FROM animals WHERE id=" + id;
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//cages

//Creation
/**
*
*	Create cage Route
*
*/
app.post('/cages', function(req, res) {
	// variable
	var name = req.body.name;
	var description = req.body.description;
	var area = req.body.area;
	
	// query
	var query = "INSERT INTO cages (name, description, area) VALUES ('"+name+"', '"+description+"', '"+area+"')";
	// execute the query SQL
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
//Reading
/**
*
*	Read cages Route
*
*/
app.get('/cages', function(req, res) {
	// query
	var query = "SELECT cages.* FROM cages";
	// filled in the table
	var conditions = ["id", "name", "description", "area"];
	// call the filter function
	query = filter(req,query,conditions,"cages");

	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
/**
*
*	Read cage with id Route
*
*/
app.get('/cages/:id', function(req, res) {
	// get id from parameters
	var id = req.params.id;
	// query
	var query = "SELECT cages.* FROM cages where id = "+id;
	// filled in the table
	var conditions = ["id","name", "description", "area"];
	// call the filter function
	query = filter(req,query,conditions,"cages");

	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
/**
*
*	Read animals in cage Route
*
*/
app.get('/cages/:id/animals', function(req, res) {
	// get id from parameters
	var id = req.params.id;
	// query
	var query = "SELECT animals.* FROM animals inner join cages on animals.id_cage=cages.id WHERE id_cage=" + id;
	// filled in the table
	var conditions = ["id", "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
	// call the filter function
	query = filter(req,query,conditions,"animals");

	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
/**
*
*	Read animal with id in cage Route
*
*/
app.get('/cages/:id/animals/:id_animal', function(req, res) {
	// get id from parameters
	var id = req.params.id;
	var id_animal = req.params.id_animal;
	// query
	var query = "SELECT animals.* FROM animals inner join cages on animals.id_cage=cages.id WHERE animals.id_cage=" + id + " and animals.id = " + id_animal;
	// filled in the table
	var conditions = ["id","name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
	// call the filter function
	query = filter(req,query,conditions,"animals");

	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

//update
/**
*
*	Update cage with id Route
*
*/
app.put('/cages/:id', function(req, res) {
	// get id from parameters
	var id = req.params.id;
	// begining of the SQL query
	var query = "UPDATE cages SET id =" + id;
	// if name in body
	if("name" in req.body){
		query += ", name = '"+req.body.name+"'";
	}
	// if description in body
	if("description" in req.body){
		query += ", description = '"+req.body.description+"'";
	}
	// if area in body
	if("area" in req.body ){
		query += ", area = "+req.body.area;
	}
	// end the query by the selecting the cage with the id in parameter
	query += " WHERE id = "+id;
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});

});

//delete
/**
*
*	Delete all cages Route
*
*/
app.delete('/cages', function(req, res) {
	var query = "DELETE FROM cages";
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
/**
*
*	Delete cage with id Route
*
*/
app.delete('/cages/:id', function(req, res) {
	// get id from parameters
	var id = req.params.id;
	// query
	var query = "DELETE FROM cages WHERE id=" + id;
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
//food

//Creation
/**
*
*	Create food Route
*
*/
app.post('/food', function(req, res) {
	// variable
	var name = req.body.name;
	var id_animal = req.body.id_animal;
	var quantity = req.body.quantity;
	
	// query
	var query = "INSERT INTO food (name, id_animal, quantity) VALUES ('"+name+"', '"+id_animal+"', '"+quantity+"')";
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
//Reading
/**
*
*	Read foods Route
*
*/
app.get('/food', function(req, res) {
	// query
	var query = "SELECT food.* FROM food";
	// filled in the table
	var conditions = ["id", "name", "id_animal", "quantity"];
	// call the filter function
	query = filter(req,query,conditions,"food");
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
/**
*
*	Read food with id Route
*
*/
app.get('/food/:id', function(req, res) {
	// get id from parameters
	var id = req.params.id;
	// query
	var query = "SELECT food.* FROM food WHERE id=" + id;
	// filled in the table
	var conditions = ["id", "name", "id_animal", "quantity"];
	// call the filter function
	query = filter(req,query,conditions,"food");
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
/**
*
*	Read animals in food Route
*
*/
app.get('/food/:id/animals', function(req, res) {
	// get id from parameters
	var id = req.params.id;
	// query
	var query = "SELECT animals.* FROM food INNER JOIN animals on id_animal = animals.id WHERE food.id=" + id;
	// filled in the table
	var conditions = ["id","name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
	// call the filter function
	query = filter(req,query,conditions,"animals");
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
/**
*
*	Read animal with id in food Route
*
*/
app.get('/food/:id/animals/:id_animal', function(req, res) {
	// get id from parameters
	var id = req.params.id;
	var id_animal = req.params.id_animal;
	// query
	var query = "SELECT animals.* FROM food INNER JOIN animals on id_animal = animals.id WHERE id_animal=" + id_animal + " and "+ id +" =food.id"
	// filled in the table
	var conditions = ["id","name", "breed", "food_per_day", "birthday", "entry_date", "id_cage"];
	// call the filter function
	query = filter(req,query,conditions,"animals");
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
//update
/**
*
*	Update foodwith id Route
*
*/
app.put('/food/:id', function(req, res) {
	// get id from parameters
	var id = req.params.id;
	// begining of the SQL query
	var query = "UPDATE food SET id =" + id;
	// if name in body
	if("name" in req.body){
		query += ", name = '"+req.body.name+"'";
	}
	// if id_animal in body
	if("id_animal" in req.body ){
		query += ", id_animal = "+req.body.id_animal;
	}
	// if quantity in body
	if("quantity" in req.body ){
		query += ", quantity = "+req.body.quantity;
	}
	// end the query by the selecting the food with the id in parameter
	query += " WHERE id = "+id;
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//delete
/**
*
*	Delete all foods Route
*
*/
app.delete('/food', function(req, res) {
	// query
	var query = "DELETE FROM food";
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
/**
*
*	Delete food with id Route
*
*/
app.delete('/food/:id', function(req, res) {
	// get id from parameters
	var id = req.params.id;
	// query
	var query = "DELETE FROM food WHERE id=" + id;
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//staffs
//Creation
/**
*
*	Create staff Route
*
*/
app.post('/staff', function(req, res) {
	// variable
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var wage = req.body.wage;
	
	// query
	var query = "INSERT INTO staff ( firstname, lastname, wage) VALUES ('"+firstname+"', '"+lastname+"', '"+wage+"')";
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
//Reading
/**
*
*	Read staffs Route
*
*/
app.get('/staff', function(req, res) {
	// query
	var query = "SELECT staff.* FROM staff";
	// filled in the table
	var conditions = ["id", "firstname", "lastname", "wage"];
	// call the filter function
	query = filter(req,query,conditions,"staff");
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
/**
*
*	Read staff with id Route
*
*/
app.get('/staff/:id', function(req, res) {
	// get id from parameters
	var id = req.params.id;
	// query
	var query = "SELECT staff.* FROM staff WHERE id=" + id;
	// filled in the table
	var conditions = ["id", "firstname", "lastname", "wage"];
	// call the filter function
	query = filter(req,query,conditions,"staff");
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});
//update
/**
*
*	Update staff with id Route
*
*/
app.put('/staff/:id', function(req, res) {
	// get id from parameters
	var id = req.params.id;

	// begining of the SQL query
	var query = "UPDATE staff SET id =" + id;
	// if firstname in body
	if("firstname" in req.body){
		query += ", firstname = '"+req.body.firstname+"'";
	}
	// if lastname in body
	if("lastname" in req.body ){
		query += ", lastname = '"+req.body.lastname+"'";
	}
	// if wage in body
	if("wage" in req.body ){
		query += ", wage = "+req.body.wage;
	}
	// end the query by the selecting the animal with the staff in parameter
	query += " WHERE id = "+id;
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//delete
/**
*
*	Delete all staffs Route
*
*/
app.delete('/staff', function(req, res) {
	// query
	var query = "DELETE FROM staff";
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});
/**
*
*	Delete staff Route
*
*/
app.delete('/staff/:id', function(req, res) {
	// get id from parameters
	var id = req.params.id;
	// query
	var query = "DELETE FROM staff WHERE id=" + id;
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify("Success"));
	});
});

//food-stats
/**
*
*	Read the days left for each animal according to the remaining food Route
*
*/
app.get('/food-stats', function(req, res) {
	// query
	var query = "select animals.id, if (animals.food_per_day = 0,0,((select SUM(food.quantity) from food where animals.id=food.id_animal)/animals.food_per_day) )as days_left from animals";
	// execute the SQL query
	db.query(query, function(err, result, fields) {
		if (err) throw err;
		res.send(JSON.stringify(result));
	});
});

app.listen(3000, function() {
	// Connect to the database
	db.connect(function(err) {
		if (err) throw err;
		console.log('Connection to database successful!');
	});
	console.log('Example app listening on port 3000!');
});
