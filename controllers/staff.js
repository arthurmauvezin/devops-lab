/**
 * This Node module contains the staff controller
 */

const database = require('../services/database');
const tables = require('../services/tables');

/**
 * Table schema
 */
const table = tables.staff;


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