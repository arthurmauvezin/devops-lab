/**
 * This Node module contains the food controller
 */

const database = require('../services/database');
const tables = require('../services/tables');

/**
 * Table schema
 */
const table = tables.food;


/**
 * CREATE
 */
module.exports.create = function(request, response) {

    let statement = database.createInsertStatement(table, request);

    database.connection.query(statement, function(error, result, fields) {
        if(error) throw error;

        response.send(JSON.stringify(result)); 
    });
}


/**
 * READ
 */
module.exports.read = function(request, response) {

    let statement = database.createReadStatement(table, request);

    database.connection.query(statement, function(error, result, fields) {
        if(error) throw error;

        response.send(JSON.stringify(result)); 
    });
}


/**
 * UPDATE
 */
module.exports.update = function(request, response) {

    let statement = database.createUpdateStatement(table, request);

    database.connection.query(statement, function(error, result, fields) {
        if(error) throw error;

        response.send(JSON.stringify(result));       
    });
}


/**
 * DELETE
 */
module.exports.delete = function(request, response) {

    let statement = database.createDeleteStatement(table, request);

    database.connection.query(statement, function(error, result, fields) {
        if(error) throw error;

        response.send(JSON.stringify(result));        
    });
}


/**
 * Relation "animals" in "food"
 */
module.exports.getAnimals = function(request, response) {

    let statement = 'SELECT animals.* FROM ' + table.name + ' INNER JOIN animals ON food.id_animal = animals.id WHERE food.id = ' + request.params.id;

    statement = (request.params.id_animal === undefined) ?
                statement
                : statement + ' AND animals.id = ' + request.params.id_animal;
    
    // Condition filter
    let linkedTable = tables.animals;

    for (let column in linkedTable.columns) { 
        if (linkedTable.columns[column] in request.query) { 
            if (statement.indexOf( "WHERE" ) < 0) {
                statement += " WHERE" ;
            } else {
                statement += " AND" ;
            }
            statement += " " + linkedTable.columns[column] + "='" + request.query[linkedTable.columns[column]] + "'" ; 
        }
    }

    // Fields filter
    if ("fields" in request.query) {
        statement = statement.replace("*" , request.query["fields"]);
    }

    // Pagination filter
    if ("limit" in request.query) { 
        statement += " LIMIT " + request.query["limit"];

        if ("offset" in request.query) { 
            statement += " OFFSET " + request.query["offset"];
        } 
    }

    database.connection.query(statement, function(error, result, fields) {
        if(error) throw error;

        response.send(JSON.stringify(result));        
    });
}