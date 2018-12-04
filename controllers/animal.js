/**
 * This Node module contains the animal controller
 */

const database = require('../services/database');
const tables = require('../services/tables');

/**
 * Table schema
 */
const table = tables.animals;


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
 * Relation "cages" in "animals"
 */
module.exports.getCages = function(request, response) {

    let statement = 'SELECT cages.* FROM ' + table.name + ' INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id = ' + request.params.id;

    statement = (request.params.id_cage === undefined) ?
                statement
                : statement + ' AND cages.id = ' + request.params.id_cage;

    // Condition filter
    let linkedTable = tables.cages;

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


/**
 * Relation "food" in "animals"
 */
module.exports.getFood = function(request, response) {

    let statement = 'SELECT food.* FROM ' + table.name + ' INNER JOIN food ON animals.id = food.id_animal WHERE animals.id = ' + request.params.id;

    // Condition filter
    let linkedTable = tables.food;

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