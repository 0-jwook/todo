const mysql = require('mysql2');

const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : 'kkKK1130!!',
    database : 'todo',
});

module.exports = pool.promise();