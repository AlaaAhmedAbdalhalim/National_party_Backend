const mysql = require('mysql2/promise');

/* let pool = null;
 */const pool = require("./config/db");

app.get("/health", async (req, res) => {
  try {
    if (!pool) return res.status(500).send("DB not ready");

    const conn = await pool.getConnection();
    conn.release();
    res.send("OK");
  } catch (err) {
    res.status(500).send("DB error");
  }
});

if (!process.env.MYSQL_PUBLIC_URL) {
  console.error("❌ MYSQL_PUBLIC_URL is missing");
} else {
  try {
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

    console.log("✅ MySQL pool created");
  } catch (err) {
    console.error("❌ DB init error:", err.message);
  }
}

module.exports = pool;
