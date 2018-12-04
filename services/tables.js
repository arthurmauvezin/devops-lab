/**
 * This NodeJS module contains all the tables schemas
 */

module.exports.animals = {
    name: 'animals',
    columns: ['breed', 'food_per_day', 'birthday', 'entry_date', 'id_cage']
};

module.exports.food = {
    name: 'food',
    columns: ['name', 'quantity', 'id_animal']
};

module.exports.cages = {
    name: 'cages',
    columns: ['name', 'description', 'area']
};

module.exports.staff = {
    name: 'staff',
    columns: ['firstname', 'lastname', 'wage']
};