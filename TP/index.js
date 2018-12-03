const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require ('body-parser');


var db = mysql.createConnection( {
	host : "localhost",
	user : "root",
	password : "",
	database : "projet_zoo"
});

app.get('/', function(req, res) {
	db.query("SELECT * FROM test", function(err, result, fields) {
		if (err) throw err;
		var response = { "page": "home", "result": result };
		res.send(JSON.stringify(response));
	});
});



app.get('/animal', function(req,res) {
    var query = "SELECT * FROM animaux";
    var conditions = ["Nom","Race","Quantite_Nourriture","Date_Naissance","Date_Entree_Cage"];
    if ( "fields" in req.query) {
        query = query.replace( "*" , req.query[ "fields" ]);
    }
    for(var index in conditions){
        if (conditions[index] in req.query) {
            if(query.indexOf("WHERE")<0) {
                query += " WHERE";
            }
            query+= " " + conditions[index] + "= '" + req.query[conditions[index]]+"'";
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
    if ( "limit" in req.query) {
        query += " LIMIT " + req.query[ "limit" ];
        if ( "offset" in req.query) {
            query += " OFFSET " + req.query[ "offset" ];
        }
    }
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});


app.get( '/cage' , function (req, res) {
var response = { "page" : "cage" };
res.send( JSON .stringify(response));
});

app.get( '/nourriture' , function (req, res) {
var response = { "page" : "nourriture" };
res.send( JSON .stringify(response));
});

app.get( '/personnel' , function (req, res) {
var response = { "page" : "personnel" };
res.send( JSON .stringify(response));
});


app.listen( 3000 , function () {
console .log( 'Example app listening on port 3000!' );
});


// Création du path create 
app.post( '/animal' , function (req, res) {
res.send( JSON .stringify( "Create" ));
});

app.post( '/cage' , function (req, res) {
res.send( JSON .stringify( "Create" ));
});

app.post( '/nourriture' , function (req, res) {
res.send( JSON .stringify( "Create" ));
});

app.post( '/personnel' , function (req, res) {
res.send( JSON .stringify( "Create" ));
});


// Création du path Read pour animal
app.get( '/animal' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/animal/:AnimalID' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/animal/:Nom' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/animal/:Race' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/animal/:Quantite_Nourriture' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/animal/:Date_Naissance' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/animal/:Date_Entree_Cage' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/animal/:IDCage' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

// Création du path Read pour Cage

app.get( '/cage' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/cage/:Nom' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/cage/:Nom' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/cage/:Description' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/cage/:Taille' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

// Création du path Read pour nourriture

app.get( '/nourriture' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/nourriture/:NourritureID' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/nourriture/:Nom' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/nourriture/:AnimalID' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/nourriture/:Quantite' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

// Création du path Read pour personnel

app.get( '/personnel' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/personnel:/PersonnelID' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/personnel:/Prenom' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/personnel:/Nom' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});

app.get( '/personnel:/Salaire' , function (req, res) {
res.send( JSON .stringify( "Read" ));
});





//Creation du path Update pour animal

app.put( '/animal' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/animal/:AnimalID' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/animal/:Nom' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/animal/:Race' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/animal/:Quantite_Nourriture' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/animal/:Date_Naissance' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/animal/:Date_Entree_Cage' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/animal/:IDCage' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

//Creation du path Update pour Cage

app.put( '/cage' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/cage/:Nom' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/cage/:Nom' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/cage/:Description' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/cage/:Taille' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});


// Creation du path Update pour nourriture

app.put( '/nourriture' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/nourriture/:NourritureID' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/nourriture/:Nom' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/nourriture/:AnimalID' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/nourriture/:Quantite' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

// Création du path Update pour personnel

app.put( '/personnel' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/personnel:/PersonnelID' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/personnel:/Prenom' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/personnel:/Nom' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});

app.put( '/personnel:/Salaire' , function (req, res) {
res.send( JSON .stringify( "Update" ));
});






//Creation du path Delete pour animal

app.delete( '/animal' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/animal/:AnimalID' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/animal/:Nom' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/animal/:Race' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/animal/:Quantite_Nourriture' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/animal/:Date_Naissance' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/animal/:Date_Entree_Cage' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/animal/:IDCage' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

//Creation du path Delete pour Cage

app.delete( '/cage' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/cage/:Nom' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/cage/:Nom' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/cage/:Description' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/cage/:Taille' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});


// Creation du path Delete pour nourriture

app.delete( '/nourriture' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/nourriture/:NourritureID' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/nourriture/:Nom' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/nourriture/:AnimalID' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/nourriture/:Quantite' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

// Création du path Delete pour personnel

app.delete( '/personnel' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/personnel:/PersonnelID' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/personnel:/Prenom' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/personnel:/Nom' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});

app.delete( '/personnel:/Salaire' , function (req, res) {
res.send( JSON .stringify( "Delete" ));
});


//Creation de la route food-stats


/**
Food Stats en lecture uniquement pour afficher le temps 
avant la pénurie 
nourriture
**/

app.get('/food-stat',function(req,res){
   var query = "select t2.Race, t1.Quantite/t2.Quantite_Nourriture as \"Nombre d'heures restantes\" from (select sum(Quantite) as \"Qte\", Nom, NourritureID from nourriture group by Nom) as t1 Inner join ( select NourritureID, sum(Quantite_Nourriture) as \"qtnourriture\", Race from animal group by Race) as t2 on t2.NourritureID = t1.NourritureID";
   db.query(query,function(err,result,fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
   });
});




app.listen(3000,function() {
	db.connect(function(err) {
		if(err) throw err;
		console.log('example app listening on port 3000');
	} );
	console.log('Example app listening on port 3000!');
});
