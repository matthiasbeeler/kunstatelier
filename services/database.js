var mysql = require('mysql2');

exports.database = mysql.createConnection({
    connectionLimit: 50000,
    host: process.env.dbHost,
    user: process.env.dbUser,
    password: process.env.dbPass,
    database: process.env.db,
    port: process.env.dbPort,
    insecureAuth: true
});
