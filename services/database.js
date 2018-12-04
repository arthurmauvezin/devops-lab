/**
 * This Node module contains services for MySQL database
 */

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zoo',
    port: '3306'
});

/**
 * Object that contains information about the connection to the database
 */
module.exports.connection = connection;


/**
 * Add condition filter to the given statement and return it
 */
function getStatementWithConditionFilter(statement, request, table) {

    for (let column in table.columns) { 
        if (table.columns[column] in request.query) { 
            if (statement.indexOf( "WHERE" ) < 0) {
                statement += " WHERE" ;
            } else {
                statement += " AND" ;
            }
            statement += " " + table.columns[column] + "='" + request.query[table.columns[column]] + "'" ; 
        }
    }

    return statement;
}


/**
 * Add sort filter to the given statement and return it
 */
function getStatementWithSortFilter(statement, request) {

    if ("sort" in request.query) {
        let sort = request.query[ "sort" ].split( "," );

        statement += " ORDER BY";

        for (let index in sort) {
            let direction = sort[index].substr(0, 1);
            let field = sort[index].substr(1);

            statement += " " + field;

            if (direction == "-" ) statement += " DESC,";
            else statement += " ASC,";
        }

        statement = statement.slice(0, -1);
    }

    return statement;
}


/**
 * Add fields filter to the given statement and return it
 */
function getStatementWithFieldsFilter(statement, request) {

    if ("fields" in request.query) {
        statement = statement.replace( "*" , request.query[ "fields" ]);
    }
    return statement;
}


/**
 * Add pagination filter to the given statement and return it
 */
function getStatementWithPaginationFilter(statement, request) {

    if ("limit" in request.query) { 
        statement += " LIMIT " + request.query["limit"];

        if ("offset" in request.query) { 
            statement += " OFFSET " + request.query["offset"];
        } 
    }
    
    return statement;
}


/**
 * Create an INSERT statement from the request and return it
 */
module.exports.createInsertStatement = function(table, request) {

    let columnsToInsert = '';
    let valuesToInsert = '';
    let index = 0;

    for(let element in request.body) {
        if(element !== undefined && request.body[element] !== undefined) {
            if(index === 0) {
                index++;
            } else {
                columnsToInsert += ', ';
                valuesToInsert += ', ';
            }
            columnsToInsert += element;
            valuesToInsert += "'" + request.body[element] + "'";
        }
    }
    
    return 'INSERT INTO ' + table.name + '(' + columnsToInsert + ') VALUES (' + valuesToInsert + ')';
}


/**
 * Create a SELECT statement from the request and return it
 */
module.exports.createReadStatement = function(table, request) {

    let statement = "SELECT * FROM " + table.name;

    statement = (request.params.id === undefined) ?
                statement
                : statement + ' WHERE id = ' + request.params.id;

    statement = getStatementWithConditionFilter(statement, request, table);

    statement = getStatementWithSortFilter(statement, request);

    statement = getStatementWithFieldsFilter(statement, request);

    statement = getStatementWithPaginationFilter(statement, request);

    return statement;
}


/**
 * Create an UPDATE statement from the request and return it
 */
module.exports.createUpdateStatement = function(table, request) {

    let updatesToDo = '';
    let index = 0;

    for(let element in request.body) {
        if(element !== undefined && request.body[element] !== undefined) {
            if(index === 0) {
                index++;
            } else {
                updatesToDo += ', ';
            }
            updatesToDo += element + " = '" + request.body[element] + "'";
        }
    }
    
    return 'UPDATE ' + table.name + ' SET ' + updatesToDo + ' WHERE id = ' + request.params.id;
}


/**
 * Create a DELETE statement from the request and return it
 */
module.exports.createDeleteStatement = function(table, request) {

    return (request.params.id === undefined) ?
            'DELETE FROM ' + table.name
            : 'DELETE FROM ' + table.name + ' WHERE id = ' + request.params.id;
}

