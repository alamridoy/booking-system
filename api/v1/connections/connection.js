const mysql = require('mysql');
require('dotenv').config();

let connectionHotelPool = mysql.createPool({
    connectionLimit: 500,
    host: process.env.DB_HOST_v1,
    user: process.env.DB_USER_v1,
    password: process.env.DB_PASS_v1,
    database: process.env.DB_DATABASE_v1
});

module.exports = {
    connectionHotelPool
}


