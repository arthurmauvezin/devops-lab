//Zoo technology web Project
//Alexis BOSSERAY Corentin COSTE


/* ----- connection and initialisation -----*/





const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "zoo",
    port: "8889"
});

app.use( function (req, res, next) {  
    if  ( "key"   in  req.query) {
        var  key = req.query[ "key" ];
        var  query =  "SELECT * FROM users WHERE apikey='"  + key +  "'" ;
        
        db.query(query,  function (err, result, fields) {  
            if  (err)  throw  err;
            
            if  (result.length >  0 ) { 
                next();
            }  else  {
                res.status(403).end()
            }
        }); 
    }  else  {
        res.status(403).end();
    }
});

app.listen(3000, function () {
    db.connect(function (err) {
        if (err) throw err;
        console.log('Connection to database successful!');
    });
    console.log('Example app listening on port 3000!');
});






/* ----- roots and CRUD for the object animals ----- */





//create
app.post('/animals', function (req, res) {
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;
    var query = "INSERT INTO animals (name, breed, food_per_day, birthday, entry_date, id_cage) VALUES ('" + name + "','"+breed+"','"+food_per_day+"','"+birthday+"','"+entry_date+"','"+id_cage+"')";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//read
app.get('/animals', function (req, res) {
    var query = "SELECT * FROM animals"
    
    var  conditions = [ "id",  "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            if  (query.indexOf( "WHERE" ) <  0 ) { 
                query +=  " WHERE" ;
            }  else  {
                query +=  " AND" ; 
            }
            query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id(\\d+)', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id;

    var  conditions = [ "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage" ];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            query +=  " AND " + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//update
app.put('/animals/:id(\\d+)', function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;
    var query = "UPDATE animals SET ";
    
    var vir = false;
    if (name){
        if (vir){
            query+=",";
        }
        query+="name= '"+name+"'";
        vir=true
    }
        if (breed){
        if (vir){
            query+=",";
        }
        query+="breed= '"+breed+"'";
        vir=true
    }
        if (food_per_day){
        if (vir){
            query+=",";
        }
        query+="food_per_day= '"+food_per_day+"'";
        vir=true
    }
        if (birthday){
        if (vir){
            query+=",";
        }
        query+="birthday= '"+birthday+"'";
        vir=true
    }
        if (entry_date){
        if (vir){
            query+=",";
        }
        query+="entry_date= '"+entry_date+"'";
        vir=true
    }
        if (id_cage){
        if (vir){
            query+=",";
        }
        query+="id_cage= '"+id_cage+"'";
        vir=true
    }
    query+="WHERE id ="+id;
    
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        if (!vir){
            res.send(JSON.stringify("No update"))
        }
        res.send(JSON.stringify("Success"));
    });
});

//delete
app.delete('/animals', function (req, res) {
    var query = "DELETE FROM animals";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.delete('/animals/:id(\\d+)', function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM animals WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});





/* ----- roots and CRUD for the object cages ----- */





//create
app.post('/cages', function (req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    var query = "INSERT INTO cages (name, description, area) VALUES ('" + name + "','"+description+"','"+area+"')";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//read
app.get('/cages', function (req, res) {
    var query = "SELECT * FROM cages"

    var  conditions = [ "id",  "name", "description", "area"];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            if  (query.indexOf( "WHERE" ) <  0 ) { 
                query +=  " WHERE" ;
            }  else  {
                query +=  " AND" ; 
            }
            query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages/:id(\\d+)', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + id;
    
    var  conditions = [ "id",  "name", "description", "area"];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            query +=  " AND " + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//update
app.put('/cages/:id(\\d+)', function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;
    var query = "UPDATE cages SET ";
    
    var vir = false;
    if (name){
        if (vir){
            query+=",";
        }
        query+="name= '"+name+"'";
        vir=true
    }
        if (description){
        if (vir){
            query+=",";
        }
        query+="description= '"+description+"'";
        vir=true
    }
        if (area){
        if (vir){
            query+=",";
        }
        query+="area= '"+area+"'";
        vir=true
    }

    query+="WHERE id ="+id;
    
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        if (!vir){
            res.send(JSON.stringify("No update"))
        }
        res.send(JSON.stringify("Success"));
    });
});

//delete
app.delete('/cages', function (req, res) {
    var query = "DELETE FROM cages";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.delete('/cages/:id(\\d+)', function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM cages WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});






/* ----- roots and CRUD for the object food ----- */






//create
app.post('/food', function (req, res) {
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    var query = "INSERT INTO food (name, quantity, id_animal) VALUES ('" + name + "','"+quantity+"','"+id_animal+"')";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//read
app.get('/food', function (req, res) {
    var query = "SELECT * FROM food"

    var  conditions = [ "id",  "name", "quantity", "id_animal"];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            if  (query.indexOf( "WHERE" ) <  0 ) { 
                query +=  " WHERE" ;
            }  else  {
                query +=  " AND" ; 
            }
            query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/food/:id(\\d+)', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;
    
    var  conditions = [ "id",  "name", "quantity", "id_animal"];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            query +=  " AND " + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//update
app.put('/food/:id(\\d+)', function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;
    var query = "UPDATE food SET ";
    
    var vir = false;
    if (name){
        if (vir){
            query+=",";
        }
        query+="name= '"+name+"'";
        vir=true
    }
        if (quantity){
        if (vir){
            query+=",";
        }
        query+="quantity= '"+quantity+"'";
        vir=true
    }
        if (id_animal){
        if (vir){
            query+=",";
        }
        query+="id_animal= '"+id_animal+"'";
        vir=true
    }

    query+="WHERE id ="+id;
    
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        if (!vir){
            res.send(JSON.stringify("No update"))
        }
        res.send(JSON.stringify("Success"));
    });
});

//delete
app.delete('/food', function (req, res) {
    var query = "DELETE FROM food";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.delete('/food/:id(\\d+)', function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM food WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});






/* ----- roots and CRUD for the object staff ----- */






//create
app.post('/staff', function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    var query = "INSERT INTO staff (firstname, lastname, wage) VALUES ('" +firstname + "','"+lastname+"','"+wage+"')";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

//read
app.get('/staff', function (req, res) {
    var query = "SELECT * FROM staff"

    var  conditions = [ "id",  "firstname", "lastname", "wage"];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            if  (query.indexOf( "WHERE" ) <  0 ) { 
                query +=  " WHERE" ;
            }  else  {
                query +=  " AND" ; 
            }
            query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/staff/:id(\\d+)', function (req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id;
    
    var  conditions = [ "id",  "firstname", "lastname", "wage"];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            query +=  " AND " + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//update
app.put('/staff/:id(\\d+)', function (req, res) {
    var id = req.params.id;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;
    var query = "UPDATE staff SET ";
    
    var vir = false;
    if (firstname){
        if (vir){
            query+=",";
        }
        query+="firstname= '"+firstname+"'";
        vir=true
    }
        if (lastname){
        if (vir){
            query+=",";
        }
        query+="lastname= '"+lastname+"'";
        vir=true
    }
        if (wage ){
        if (vir){
            query+=",";
        }
        query+="wage = '"+wage +"'";
        vir=true
    }

    query+="WHERE id ="+id;
    
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        if (!vir){
            res.send(JSON.stringify("No update"))
        }
        res.send(JSON.stringify("Success"));
    });
});

//delete
app.delete('/staff', function (req, res) {
    var query = "DELETE FROM staff";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});

app.delete('/staff/:id(\\d+)', function (req, res) {
    var id = req.params.id;
    var query = "DELETE FROM staff WHERE id=" + id;
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});





/* ----- roots for relationship ----- */





app.get('/animals/:id/cages', function (req, res) {
    var id = req.params.id;
    var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id = " + id;
    
    var  conditions = [ "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage", "description", "area"];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            if  (query.indexOf( "WHERE" ) <  0 ) { 
                query +=  " WHERE" ;
            }  else  {
                query +=  " AND" ; 
            }
            query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get( '/animals/:id_animals/cages/:id_cages' , function (req, res) {
    var id_cages = req.params.id_cages;
    var id_animals = req.params.id_animals;
    var query = "SELECT cages.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id_cages + " AND animals.id=" +id_animals;
    
    var  conditions = [ "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage", "description", "area"];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            if  (query.indexOf( "WHERE" ) <  0 ) { 
                query +=  " WHERE" ;
            }  else  {
                query +=  " AND" ; 
            }
            query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

app.get('/cages/:id/animals', function (req, res) {
    var id = req.params.id;
    var query = "SELECT animals.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id = " + id;
    
    var  conditions = [ "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage", "description", "area"];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            if  (query.indexOf( "WHERE" ) <  0 ) { 
                query +=  " WHERE" ;
            }  else  {
                query +=  " AND" ; 
            }
            query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get( '/cages/:id_cages/animals/:id_animals' , function (req, res) {
    var id_cages = req.params.id_cages;
    var id_animals = req.params.id_animals;
    var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id_cages + " AND animals.id=" +id_animals;
    
    var  conditions = [ "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage", "description", "area"];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            if  (query.indexOf( "WHERE" ) <  0 ) { 
                query +=  " WHERE" ;
            }  else  {
                query +=  " AND" ; 
            }
            query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

app.get('/animals/:id/food', function (req, res) {
    var id = req.params.id;
    var query = "SELECT food.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id = " + id;
    
    var  conditions = [ "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage", "quantity", "id_animal"];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            if  (query.indexOf( "WHERE" ) <  0 ) { 
                query +=  " WHERE" ;
            }  else  {
                query +=  " AND" ; 
            }
            query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get( '/animals/:id_animals/food/:id_food' , function (req, res) {
    var id_food = req.params.id_food;
    var id_animals = req.params.id_animals;
    var query = "SELECT food.* FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE animals.id=" + id_animals + " AND food.id=" +id_food;
    
    var  conditions = [ "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage", "quantity", "id_animal"];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            if  (query.indexOf( "WHERE" ) <  0 ) { 
                query +=  " WHERE" ;
            }  else  {
                query +=  " AND" ; 
            }
            query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }
    
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});

app.get('/food/:id/animals', function (req, res) {
    var id = req.params.id;
    var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id = " + id;
        
    var  conditions = [ "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage", "quantity", "id_animal"];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            if  (query.indexOf( "WHERE" ) <  0 ) { 
                query +=  " WHERE" ;
            }  else  {
                query +=  " AND" ; 
            }
            query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get( '/food/:id_food/animals/:id_animals' , function (req, res) {
    var id_food = req.params.id_food;
    var id_animals = req.params.id_animals;
    var query = "SELECT animals.* FROM food INNER JOIN animals ON food.id_animal = animals.id WHERE animals.id=" + id_animals + " AND food.id=" +id_food;
    
    var  conditions = [ "name", "breed", "food_per_day", "birthday", "entry_date", "id_cage", "quantity", "id_animal"];
    for  (var  index  in  conditions) {
        if  (conditions[index]  in  req.query) {
            if  (query.indexOf( "WHERE" ) <  0 ) { 
                query +=  " WHERE" ;
            }  else  {
                query +=  " AND" ; 
            }
            query +=  " "  + conditions[index] +  "='"  + req.query[conditions[index]] +  "'" ;
        } 
    }

    if  ( "sort"   in  req.query) {
        var  sort = req.query[ "sort" ].split( "," ); 
        query +=  " ORDER BY" ;
        for  (var  index  in  sort) {
            var  direction = sort[index].substr( 0 ,  1 );
            var  field = sort[index].substr( 1 );
            
            query +=  " "  + field;
            
            if  (direction ==  "-" ) 
                query +=  " DESC," ;
            else
                query +=  " ASC," ;
            }
            query = query.slice( 0 ,  -1 ); 
    }

    if  ( "fields"   in  req.query) {
        query = query.replace( "*" , req.query[ "fields" ]); 
    }

    if  ( "limit"   in  req.query) {
        query +=  " LIMIT "  + req.query[ "limit" ];
        if  ( "offset"   in  req.query) {
            query +=  " OFFSET "  + req.query[ "offset" ]; 
        }
    }

    db.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send( JSON .stringify(result));
    });
});






/* ----- roots for food management ----- */





app.get('/food-stats', function (req, res) {
    var query = "SELECT animals.id, (quantity/food_per_day) AS days_left FROM animals INNER JOIN food WHERE animals.id=food.id_animal";
    db.query(query, function (err, result, fields) {
        if (err) throw err;
        var result_JSON = JSON.stringify(result);
        result_JSON=result_JSON.replace("null",0)
        res.send(result_JSON);
    });
});