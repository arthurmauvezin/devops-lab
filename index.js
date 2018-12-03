const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended : true}));

//se Connecter
var db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "zoo",
    port : "3306"
});

/***************************PARE FEU**************************/
app.use( function (req, res, next) {
    if  ( "key"   in  req.query)
    {
        var  key = req.query[ "key" ];
        var  query =  "SELECT * FROM users WHERE apikey='"  + key +  "'" ; // valeur de l'apikey :ceciestmonjeton

        db.query(query,  function (err, result, fields)
        {
            if  (err)  throw  err;

            if  (result.length >  0 )
            {
                next();
            }
            else
            {
                res.sendStatus(403); // Erreur 403 si la clé différente de ceciestmonjeton --> ERREUR ACCES FORBIDDEN
            }
         });
    }
    else
    {
      res.sendStatus(403); // Erreur 403 si la clé différente de ceciestmonjeton --> ERREUR ACCES FORBIDDEN
    }
});

/**************************Fonctions Filter*******************/

function filtres(conditions, req, query, res)
{
    //Filtres
    // Filtre de Conditions
    for (var index in conditions)
    {
        if (conditions[index] in req.query)
        {
            if (query.indexOf("WHERE") < 0) //pour pas 2 fois des WHERE
            {
                query += " WHERE";
            }
            else
            {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    //Filtres d'ordre
    if ("sort" in req.query)
    {
        var sort = req.query["sort"].split(",");  //separer entre la virgule // les trucs differents
        query += " ORDER BY";
        for (var index in sort)
        {
            var direction = sort[index].substr(0, 1);  //stock que entre 0 et 1 (que le 1) + ou - avec + = " "
            var field = sort[index].substr(1); //stock le premier caractere (tout sauf le premier)
            query += " " + field;
            if (direction == "-")
            {
                query += " DESC,";
            }
            else
            {
                query += " ASC,";
            }
        }

        query = query.slice(0, -1);     //garde les elements de 0 à l'avant dernier = vire le dernier element
    }


    //Filtre des Champs
    if ("fields" in req.query)
    {
        query = query.replace("*", req.query["fields"]);
    }

    //Filtre de pagination
    if ("limit" in req.query)
    {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query)
        {
            query += " OFFSET " + req.query["offset"];
        }
    }

    return query;

}

/************************ ANIMAL ****************************/

//GET -> http://localhost:3000/animals -> Afficher tous les animaux
app.get('/animals', function(req, res){
    var query = "Select * From animals";

    var conditions = ["name", "breed","food_per_day", "birthday", "entry_date", "id_cage"];

    query = filtres(conditions, req, query, res);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//GET -> -> Afficher 1 animal
app.get('/animals/:id(\\d+)', function(req, res){   //(\\d+) car d'id est forcement un entier positif.
    var id = req.params.id;
    var query = "Select * From animals where id = "+ id;

    var conditions = ["name", "breed","food_per_day", "birthday", "entry_date", "id_cage"];

    query = filtres(conditions, req, query, res);

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//GET -> -> Relations entre Animals et Cages -> on veut les cage de cet animals --> PAS FILTRES POUR RELATIONS
app.get('/animals/:id(\\d+)/cages', function(req, res){   //(\\d+) car d'id est forcement un entier positif.

//console.log(" ANIMALS/ID/CAGES --> Query [fields] : " + req.query["fields"]);

    var id = req.params.id;
    var query = "Select cages.* From animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id = "+ id;

    var conditions = ["name", "description", "area"];

    query = filtres(conditions, req, query, res);

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });

    //console.log("fin animals/id/cages");
});

//GET -> -> Relations entre Animals et Cages -> on veut 1 cage de cet animals --> PAS FILTRES POUR RELATIONS
app.get('/animals/:id(\\d+)/cages/:id_cage(\\d+)', function(req, res){   //(\\d+) car d'id est forcement un entier positif.
    var id = req.params.id;
    var id_cage = req.params.id_cage;

    var query = "Select cages.* From animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id = "+ id + " AND cages.id=" + id_cage;

    var conditions = ["name", "description", "area"];

    query = filtres(conditions, req, query, res);

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//GET -> -> Relations entre Food et Animals -> on veut les animaux de cette food --> PAS FILTRES POUR RELATIONS
app.get('/animals/:id(\\d+)/food', function(req, res){   //(\\d+) car d'id est forcement un entier positif.
    var id = req.params.id;
    var query = "Select food.* From food INNER JOIN animals ON food.id_animal = animals.id WHERE animals.id = "+ id;

    var conditions = ["name", "quantity", "id_animal"];

    query = filtres(conditions, req, query, res);

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//GET -> -> Relations entre Food et Animals -> on veut 1 animal de cette food --> PAS FILTRES POUR RELATIONS
app.get('/animals/:id(\\d+)/food/:id_food(\\d+)', function(req, res){   //(\\d+) car d'id est forcement un entier positif.
    var id = req.params.id;
    var id_food = req.params.id_animal;
    var query = "Select food.* From food INNER JOIN animals ON food.id_animal = animals.id WHERE animals.id = "+ id + "AND animals.id = "+ id_animal;

    var conditions = ["name", "quantity", "id_animal"];

    query = filtres(conditions, req, query, res);

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});


//POST -> -> Inserer/créer un animal (tout mettre dans le body)
app.post('/animals', function(req, res){
    var name = req.body.name;
    var breed = req.body.breed;
    var food_per_day = req.body.food_per_day;
    var birthday = req.body.birthday;
    var entry_date = req.body.entry_date;
    var id_cage = req.body.id_cage;

    var query = "Insert into animals  (`name`, `breed`, `food_per_day`, `birthday`, `entry_date`, `id_cage`) Values('"+name+"', '" + breed + "', " +food_per_day+ ", '" + birthday +"' , '" +entry_date+"', "+id_cage+")";

    db.query(query, function(err, result, fields){
        if(err) throw err;

        res.send(JSON.stringify("Create Success"));
    });
});


//PUT -> -> modifier 1 animal
app.put('/animals/:id(\\d+)', function(req, res){
    var id = req.params.id;

    var query = "UPDATE animals SET ";

    next_need_comma = false;

    if(req.body.name){
        query +=  "name = '" + req.body.name + "'";
        next_need_comma = true;
    }
    if(req.body.breed){
        if(next_need_comma) query = query + ", ";
        query +=  "breed = '" + req.body.breed + "'";
        next_need_comma = true;
    }
    if(req.body.food_per_day){
        if(next_need_comma) query = query + ", ";
        query +=  "food_per_day = '" + req.body.food_per_day + "'";
        next_need_comma = true;
    }
    if(req.body.birthday){
        if(next_need_comma) query = query + ", ";
        query += "birthday = '" + req.body.birthday + "'";
        next_need_comma = true;
    }
    if(req.body.entry_cage){
        if(next_need_comma) query = query + ", ";
        query +=  "entry_cage = '" + req.body.entry_cage + "'";
        next_need_comma = true;
    }
    if(req.body.id_cage){
        if(next_need_comma) query = query + ", ";
        query +=  "id_cage = '" + req.body.id_cage + "'";
    }

    query += " WHERE id = " + id;


    if(req.body.name || req.body.breed || req.body.food_per_day || req.body.birthday || req.body.entry_cage || req.body.id_cage)
    {
        db.query(query, function(err, result, fields) {
            if(err) throw err;

            res.send(JSON.stringify("Update Success"));
        });
    }
});

//DELETE -> -> Supprimer 1 animal
app.delete('/animals/:id(\\d+)', function(req, res){
    var id = req.params.id;
    var query = "Delete from animals where id = "+id;

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify("Delete (Tupple) Success"));
    });
});

//DELETE -> -> Supprimer tous les animaux
app.delete('/animals', function(req, res){
    var id = req.params.id;
    var query = "Delete from animals";

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify("Delete (all) Success"));
    });
});

/************************ CAGES ****************************/

//GET -> http://localhost:3000/cages  -> Afficher toutes les cages
app.get('/cages', function(req, res){
    var query = "Select * From cages";

    var conditions = ["name", "description", "area"];

    query = filtres(conditions, req, query, res);


    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//GET -> -> Afficher 1 cage
app.get('/cages/:id(\\d+)', function(req, res){   //(\\d+) car d'id est forcement un entier positif.
    var id = req.params.id;
    var query = "Select * From cages where id = "+ id;

    var conditions = ["name", "description", "area"];

    query = filtres(conditions, req, query, res);

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//GET -> -> Relations entre Animals et Cages -> on veut les animals de cet cage --> PAS FILTRES POUR RELATIONS
app.get('/cages/:id(\\d+)/animals', function(req, res){   //(\\d+) car d'id est forcement un entier positif.

    //console.log(" CAGES/ID/ANIMALS --> Query [fields] : " + req.query["fields"]);

    var id = req.params.id;
    var query = "Select animals.* From animals INNER JOIN cages ON animals.id_cage = cages.id WHERE cages.id = "+ id;

    var conditions = ["name", "breed","food_per_day", "birthday", "entry_date", "id_cage"];

    query = filtres(conditions, req, query, res);

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });

    //console.log("fin Cages/id/animals");
});

//GET -> -> Relations entre Animals et Cages -> on veut 1 animal de cette cages --> PAS FILTRES POUR RELATIONS
app.get('/cages/:id(\\d+)/animals/:id_animal(\\d+)', function(req, res){   //(\\d+) car d'id est forcement un entier positif.
    var id = req.params.id;
    var id_animal = req.params.id_animal;
    var query = "Select cages.* From animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id = "+ id_animal + " AND cages.id=" + id;

    var conditions = ["name", "breed","food_per_day", "birthday", "entry_date", "id_cage"];

    query = filtres(conditions, req, query, res);

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});


//POST -> -> Inserer/créer une cage (tout mettre dans le body)
app.post('/cages', function(req, res){
    var name = req.body.name;
    var description = req.body.description;
    var area = req.body.area;

    var query = "Insert into cages  ( `name`, `description`, `area`)  Values('"+name+"', '" + description + "', " +area+ ")";

    db.query(query, function(err, result, fields){
        if(err) throw err;

        res.send(JSON.stringify("Create Success"));
    });
});

//PUT -> -> modifier 1 cage
app.put('/cages/:id(\\d+)', function(req, res){
    var id = req.params.id;

    var compteur  = 0;
    if(req.body.name)
    {
        compteur = compteur + 4;
        var name = req.body.name;
    }

    if(req.body.description)
    {
        compteur = compteur  + 2;
        var description = req.body.description;
    }

    if(req.body.area)
    {
        compteur = compteur + 1;
        var area = req.body.area;
    }

    switch (compteur) {
        case 1 :  //que taille
        var query = "Update cages set area = "+area+" where id = "+ id; //ca marche
        break;
        case 2 :  // que description
        var query = "Update cages set description = '"+description+"' where id = "+ id; //ca marche
        break;
        case 3 :  //taille + description
        var query = "Update cages set area = "+area+", description = '"+description+"' where id = "+ id;  //ca marche
        break;
        case 4 :  //que Nom
        var query = "Update cages set name = '"+name+"' where id = "+ id; //ca marche
        break;
        case 5 :  //nom + taille
        var query = "Update cages set area = "+area+", name = '"+name+"' where id = "+ id;  //ca marche
        break;
        case 6 :  //nom + description
        var query = "Update cages set name = '"+name+"', description = '"+description+"'  where id = "+ id; //ca marche
        break;
        case 7 :  //nom + description + taille
        var query = "Update cages set name = '"+name+"', description = '"+description+"' , area = "+area+"  where id = "+ id; //ca marche
        break;
        default:

    }

    db.query(query, function(err, result, fields) {
        if(err) throw err;

        res.send(JSON.stringify("Update Success"));
    });
});

//DELETE -> -> Supprimer 1 cage
app.delete('/cages/:id(\\d+)', function(req, res){
    var id = req.params.id;
    var query = "Delete from cages where id = "+id;

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify("Delete (Tupple) Success"));
    });

});

//DELETE -> -> Supprimer toutes les cages
app.delete('/cages', function(req, res){
    var id = req.params.id;
    var query = "Delete from cages ";

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify("Delete (all) Success"));
    });

});

/************************ STAFF ****************************/

//GET -> http://localhost:3000/staff -> Afficher tous les staff
app.get('/staff', function(req, res){
    var query = "Select * From staff";

    var conditions = ["firstname", "lastname", "wage"];

    query = filtres(conditions, req, query, res);

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//GET -> -> Afficher 1 staff
app.get('/staff/:id(\\d+)', function(req, res){   //(\\d+) car d'id est forcement un entier positif.
    var id = req.params.id;
    var query = "Select * From staff where id = "+ id;

    var conditions = ["firstname", "lastname", "wage"];

    query = filtres(conditions, req, query, res);

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//POST -> -> Inserer/créer un staff (tout mettre dans le body)
app.post('/staff', function(req, res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var wage = req.body.wage;

    var query = "Insert into staff  ( `firstname`, `lastname`, `wage`)  Values('"+firstname+"', '" + lastname + "', " +wage+ ")";

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify("Create Success"));
    });
});

//PUT -> -> modifier un STAFF
app.put('/staff/:id(\\d+)', function(req, res){
    var id = req.params.id;

    var query = "Update staff set ";

    var next_need_comma = false;

    if(req.body.firstname)
    {
        if(next_need_comma) query += ", ";
        query +=  "firstname = '" + req.body.firstname + "'";
        next_need_comma = true;
    }
    if(req.body.lastname)
    {
        if(next_need_comma) query += ", ";
        query +=  "lastname = '" + req.body.lastname + "'";
        next_need_comma = true;
    }
    if(req.body.wage)
    {
        if(next_need_comma) query += ", ";
        query +=  "wage = '" + req.body.wage + "'";
        next_need_comma = true;
    }

    query += "where id = "+ id;

    //console.log(query);

    if(req.body.firstname || req.body.lastname || req.body.wage)
    {
        db.query(query, function(err, result, fields) {
            if(err) throw err;

            res.send(JSON.stringify("Update Success"));
        });
    }
});

//DELETE -> -> Supprimer 1 staff
app.delete('/staff/:id(\\d+)', function(req, res){
    var id = req.params.id;
    var query = "Delete from staff where id = "+id;

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify("Delete (Tupple) Success"));
    });
});

//DELETE -> -> Supprimer Tout staff
app.delete('/staff', function(req, res){
    var id = req.params.id;
    var query = "Delete from staff ";

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify("Delete (Tupple) Success"));
    });
});

/************************ FOOD ****************************/

//GET -> http://localhost:3000/food -> Afficher toutes la nourriture
app.get('/food', function(req, res){
    var query = "Select * From food";

    var conditions = ["name", "quantity", "id_animal"];

    query = filtres(conditions, req, query, res);

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//GET -> -> Afficher 1 food
app.get('/food/:id(\\d+)', function(req, res){   //(\\d+) car d'id est forcement un entier positif.
    var id = req.params.id;
    var query = "Select * From food where id = "+ id;

    var conditions = ["name", "quantity", "id_animal"];

    query = filtres(conditions, req, query, res);

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//GET -> -> Relations entre Food et Animals -> on veut les animaux de cette food --> PAS FILTRES POUR RELATIONS
app.get('/food/:id(\\d+)/animals', function(req, res){   //(\\d+) car d'id est forcement un entier positif.
    var id = req.params.id;
    var query = "Select animals.* From food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id = "+ id;

    var conditions = ["name", "breed","food_per_day", "birthday", "entry_date", "id_cage"];

    query = filtres(conditions, req, query, res);

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//GET -> -> Relations entre Food et Animals -> on veut 1 animal de cette food --> PAS FILTRES POUR RELATIONS
app.get('/food/:id(\\d+)/animals/:id_animal(\\d+)', function(req, res){   //(\\d+) car d'id est forcement un entier positif.
    var id = req.params.id;
    var id_animal = req.params.id_animal;
    var query = "Select animals.* From food INNER JOIN animals ON food.id_animal = animals.id WHERE food.id = "+ id + " AND animals.id = "+ id_animal ;

    var conditions = ["name", "breed","food_per_day", "birthday", "entry_date", "id_cage"];

    query = filtres(conditions, req, query, res);

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify(result));
    });
});

//POST -> -> Inserer/créer une nourriture (tout mettre dans le body)
app.post('/food', function(req, res){
    var name = req.body.name;
    var quantity = req.body.quantity;
    var id_animal = req.body.id_animal;

    var query = "Insert into food  (`name`, `quantity`, `id_animal`)  Values('"+name+"', '" + quantity + "', " +id_animal+ ")";

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify("Create Success"));
    });
});


//PUT -> -> modifier un Food
app.put('/food/:id(\\d+)', function(req, res){
    var id = req.params.id;

    var query = "Update food set ";

    next_need_comma = false;

    if(req.body.name)
    {
        if(next_need_comma) query += ", ";
        query +=  "name = '" + req.body.name + "'";
        next_need_comma = true;
    }
    if(req.body.quantity)
    {
        if(next_need_comma) query += ", ";
        query +=  "quantity = '" + req.body.quantity + "'";
        next_need_comma = true;
    }
    if(req.body.id_animal)
    {
        if(next_need_comma) query += ", ";
        query +=  "id_animal = '" + req.body.id_animal + "'";
        next_need_comma = true;
    }

    query += " WHERE id = "+ id;

    if(req.body.name || req.body.quantity || req.body.id_animal)
    {
        db.query(query, function(err, result, fields) {
            if(err) throw err;

            res.send(JSON.stringify("Update Success"));
        });
    }
});


//DELETE -> -> Supprimer 1 food
app.delete('/food/:id(\\d+)', function(req, res){
    var id = req.params.id;
    var query = "Delete from food where id = "+id;

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify("Delete (Tupple) Success"));
    });
});

//DELETE -> -> Supprimer Tout food
app.delete('/food', function(req, res){
    var id = req.params.id;
    var query = "Delete from food ";

    db.query(query, function(err, result, fields)
    {
        if(err) throw err;

        res.send(JSON.stringify("Delete (all) Success"));
    });
});

/************************** STATISTIQUES *******************************************/
//GET -> SQL -> avoir la stat des jours qu'il reste
app.get('/food-stats', function(req, res){

    //var query = "SELECT animals.id, sommefood/food_per_day as days_left  FROM animals JOIN (SELECT id_animal, SUM(quantity) as sommefood FROM food GROUP BY id_animal)table1 ON animals.id = table1.id_animal";

    var query = "SELECT animals.id, animals.food_per_day, F.sommefood FROM animals JOIN (SELECT id_animal , SUM(quantity) as sommefood FROM food GROUP BY id_animal) F ON F.id_animal = animals.id";


    db.query(query, function(err, result, fields) {
        if(err) throw err;

        var days_left = new Array;
        var resultSend = new Array;

        for(var i=0; i<result.length; i++)
        {
            //test si 0 car div 0 pas cool
            if(result[i].food_per_day==0)
            {
                days_left[i]=0
            }
            else {
                days_left[i]=Math.round(result[i].sommefood/result[i].food_per_day);       //sommefood/food_per_day
            }

            //il faut id et days_left

            resultSend.push({"id" : result[i].id , "days_left" : days_left[i]});
        }

        res.send(resultSend);
    });

});

/************************ ECOUTE  ****************************/

app.listen(3000, function()
{
    db.connect(function(err)
    {
        if(err) throw err;

        console.log('Vous êtes bien connecté - App de CLARA ');
    });

    console.log('Ecoute port 3000');
});
