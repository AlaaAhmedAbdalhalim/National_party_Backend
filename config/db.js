const mysql = require('mysql2/promise');

const dbUrl = process.env.DATABASE_URL;
const myURL = new URL(dbUrl); // WHATWG URL
const [user, password] = myURL.username + ':' + myURL.password; // أو myURL.username & myURL.password
const pool = mysql.createPool({
  host: myURL.hostname,
  user: myURL.username,
  password: myURL.password,
  database: myURL.pathname.slice(1), // يشيل '/'
  port: Number(myURL.port),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
