const mysql = require('mysql2/promise');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const dbUrl = process.env.DATABASE_URL;
const myURL = new URL(dbUrl); // WHATWG URL

const pool = mysql.createPool({
  host: myURL.hostname,
  user: myURL.username,
  password: myURL.password,
  database: myURL.pathname.slice(1),
  port: Number(myURL.port),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
