/**
 * App initialization
 */
const express = require('express');
const app = express();


/**
 * Modules required
 */
const bodyParser = require('body-parser');


/**
 * Services
 */
const database = require('./services/database');


/**
 * Controllers
 */
const animalController = require('./controllers/animal');
const foodController = require('./controllers/food');
const cageController = require('./controllers/cage');
const staffController = require('./controllers/staff');


/**
 * Middlewares
 */
app.use(bodyParser.urlencoded({extended: true}));

// Firewall middleware
app.use(function(request, response, next) {
    if(request.query.key === 'ceciestmonjeton') {
        next();
    } else {
        response.status(403).send('You are not authorized to do this.');
    }
});


/**
 * Routes
 */

// CRUD routes for animals
app.post('/animals', animalController.create);
app.get('/animals', animalController.read);
app.get('/animals/:id', animalController.read);
app.put('/animals/:id', animalController.update);
app.delete('/animals', animalController.delete);
app.delete('/animals/:id', animalController.delete);
// Relation "cages" in "animals"
app.get('/animals/:id/cages', animalController.getCages);
app.get('/animals/:id/cages/:id_cage', animalController.getCages);
// Relation "food" in "animals"
app.get('/animals/:id/food', animalController.getFood);

// CRUD routes for food
app.post('/food', foodController.create);
app.get('/food', foodController.read);
app.get('/food/:id', foodController.read);
app.put('/food/:id', foodController.update);
app.delete('/food', foodController.delete);
app.delete('/food/:id', foodController.delete);
// Relation "animals" in "food"
app.get('/food/:id/animals', foodController.getAnimals);
app.get('/food/:id/animals/:id_animal', foodController.getAnimals);

// CRUD routes for cages
app.post('/cages', cageController.create);
app.get('/cages', cageController.read);
app.get('/cages/:id', cageController.read);
app.put('/cages/:id', cageController.update);
app.delete('/cages', cageController.delete);
app.delete('/cages/:id', cageController.delete);
// Relation "animals" in "cages"
app.get('/cages/:id/animals', cageController.getAnimals);

// CRUD routes for staff
app.post('/staff', staffController.create);
app.get('/staff', staffController.read);
app.get('/staff/:id', staffController.read);
app.put('/staff/:id', staffController.update);
app.delete('/staff', staffController.delete);
app.delete('/staff/:id', staffController.delete);

// Route for basic food stats
app.get('/food-stats', function(req, res) {
    var statement = 'SELECT animals.id, food.quantity / animals.food_per_day AS days_left '
                    + 'FROM animals JOIN food ON animals.id = food.id_animal';

    database.connection.query(statement, function(error, result, fields) {
        if(error) throw error;

        res.send(JSON.stringify(result));
    });
});


/**
 * Starting app
 */
app.listen(3000, function() {
    database.connection.connect(function(error) {
        if(error) throw error;
        console.info('Info: Connected to the database')
    });
    console.info('Info: App started');
});
