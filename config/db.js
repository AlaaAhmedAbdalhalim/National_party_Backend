const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool(process.env.DATABASE_URL);

pool.getConnection((err, connection) => {
  if (err) {
    console.log("❌ DB Error:", err.message);
  } else {
    console.log("✅ DB Connected");
    connection.release();
  }
});

module.exports = pool.promise();
