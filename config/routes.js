var cages = require('../app/controllers/cage_controller');
var animals = require('../app/controllers/animals_controller');
var food = require('../app/controllers/food_controller');
var staff= require('../app/controllers/staff_controller');
var firewall= require('../app/controllers/firewall_controller');

module.exports = function (app) {
    //-----------------------------------------FIREWALL START---------------------------------------------//
    // FIREWALL
    app.use(function(req, res, next) {
        firewall.firewall(req,res,next);
    });
    //-----------------------------------------FIREWALL START---------------------------------------------//
    //-----------------------------------------ANIMALS CRUD START---------------------------------------------//
    // CREATE NEW ELEMENT
    app.post( '/animals' ,  function (req, res) {
        animals.create(req,res);
    });
    // // SHOW BY ID
    app.get('/animals/:id' , function (req, res) {
        animals.show(req,res);
    });
    // // UPDATE EXISITING ELEMENT
    app.put( '/animals/:id' ,  function (req, res) {
        animals.update(req,res);
    });
    //DELETE ALL ELEMENTS
    app.delete( '/animals' ,  function (req, res) {
        animals.delete_all(req,res);
    });
    // DELETE SELECTED ELEMENT
    app.delete('/animals/:id' ,  function (req, res) {
        animals.delete(req,res);
    });
    // SELECTION
    app.get( '/animals' ,  function (req, res) {
       animals.index(req,res);
    });
    //-----------------------------------------ANIMALS CRUD END---------------------------------------------//
    //-----------------------------------------CAGES CRUD START---------------------------------------------//
    // CREATE NEW ELEMENT
    app.post( '/cages' ,  function (req, res) {
        cages.create(req,res);
    });
    // // SHOW BY ID
    app.get('/cages/:id' , function (req, res) {
        cages.show(req,res);
    });
    // // UPDATE EXISITING ELEMENT
    app.put( '/cages/:id' ,  function (req, res) {
        cages.update(req,res);
    });
    //DELETE ALL ELEMETS
    app.delete( '/cages' ,  function (req, res) {
        cages.delete_all(req,res);
    });
    // DELETE SELECTED ELEMENT
    app.delete('/cages/:id' ,  function (req, res) {
        cages.delete(req,res);
    });
    // SELECTION
    app.get( '/cages' ,  function (req, res) {
        cages.index(req,res);
    });
    //-----------------------------------------CAGES CRUD END---------------------------------------------//
    //-----------------------------------------FOOD CRUD END----------------------------------------------//
    // CREATE NEW ELEMENT
    app.post( '/food' ,  function (req, res) {
        food.create(req,res);
    });
    // // SHOW BY ID
    app.get('/food/:id' , function (req, res) {
        food.show(req,res);
    });
    // // UPDATE EXISITING ELEMENT
    app.put( '/food/:id' ,  function (req, res) {
        food.update(req,res);
    });
    //DELETE ALL ELEMETS
    app.delete( '/food' ,  function (req, res) {
        food.delete_all(req,res);
    });
    // DELETE SELECTED ELEMENT
    app.delete('/food/:id' ,  function (req, res) {
        food.delete(req,res);
    });
    // SELECTION
    app.get( '/food' ,  function (req, res) {
        food.index(req,res);
    });
    //-----------------------------------------FOOD CRUD END---------------------------------------------//
    //-----------------------------------------STAFF CRUD END--------------------------------------------//
    // CREATE NEW ELEMENT
    app.post( '/staff' ,  function (req, res) {
        staff.create(req,res);
    });
    // SHOW BY ID
    app.get('/staff/:id' , function (req, res) {
        staff.show(req,res);
    });
    // UPDATE EXISITING ELEMENT
    app.put( '/staff/:id' ,  function (req, res) {
        staff.update(req,res);
    });
    //DELETE ALL ELEMETS
    app.delete( '/staff' ,  function (req, res) {
        staff.delete_all(req,res);
    });
    // DELETE SELECTED ELEMENT
    app.delete('/staff/:id' ,  function (req, res) {
        staff.delete(req,res);
    });
    // SELECTION
    app.get( '/staff' ,  function (req, res) {
        staff.index(req,res);
    });
    //-----------------------------------------STAFF CRUD END----------------------------------------//
    //-----------------------------------------Relationships between animals<==>cages and Food<==>Animals START----------------------------------------//
    app.get('/food/:id/animals', function(req, res) {
        food.animals_with_food(req,res);
    });
    app.get('/food/:id_food/animals/:id_animal', function(req, res) {
        food.food_of_animal(req,res);
    });
    app.get('/animals/:id/food', function(req, res) {
        animals.food_of_animal(req,res);
    });
    app.get('/animals/:id/cages', function(req, res) {
        animals.cage_of_animal(req,res);
    });
    app.get('/animals/:id_animal/cages/:id_cage', function(req, res) {
        animals.cage_of_animals(req,res);
    });
    app.get('/cages/:id/animals', function(req, res) {
        cages.animal_in_cage(req,res);
    });

    //-----------------------------------------Relationships between animals<==>cages and Food<==>Animals END----------------------------------------//
    //-----------------------------------------Food statistics Start-----------------------------------------------------------------------------------------//
    app.get('/food-stats',function(req, res) {
        food.food_status(req,res);
    });
    //-----------------------------------------Food statistics End-----------------------------------------------------------------------------------------//

}

