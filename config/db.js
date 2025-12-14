const mysql = require('mysql2/promise');

let pool;

if (!process.env.MYSQL_PUBLIC_URL) {
  console.warn("⚠️ MYSQL_PUBLIC_URL not found, DB disabled (local?)");
} else {
  const dbUrl = process.env.MYSQL_PUBLIC_URL;
  const myURL = new URL(dbUrl);

  pool = mysql.createPool({
    host: myURL.hostname,
    user: myURL.username,
    password: myURL.password,
    database: myURL.pathname.slice(1),
    port: Number(myURL.port),
    waitForConnections: true,
    connectionLimit: 10
  });

  console.log("✅ MySQL pool ready");
}

module.exports = pool;
