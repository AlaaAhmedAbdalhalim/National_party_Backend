const mysql = require('mysql2/promise');

let pool = null;

if (process.env.MYSQL_PUBLIC_URL) {
  const myURL = new URL(process.env.MYSQL_PUBLIC_URL);

  pool = mysql.createPool({
    host: myURL.hostname,
    user: myURL.username,
    password: myURL.password,
    database: myURL.pathname.slice(1),
    port: Number(myURL.port),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  console.log("✅ MySQL pool created");
} else {
  console.warn("⚠️ MYSQL_PUBLIC_URL not found, DB disabled");
}

module.exports = pool;
