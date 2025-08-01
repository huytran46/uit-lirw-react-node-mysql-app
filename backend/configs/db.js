const mysql = require('mysql2/promise');
require('dotenv').config();

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '3306';
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '12345678';
const database = process.env.DB_NAME || 'react_node_app';

const pool = mysql.createPool({
   host: host,
   port: port,
   user: user,
   password: password,
   database: database,
   waitForConnections: true,
   connectionLimit: 10,
   maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
   idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
   queueLimit: 0,
   enableKeepAlive: true,
   keepAliveInitialDelay: 0,
});

module.exports = pool;