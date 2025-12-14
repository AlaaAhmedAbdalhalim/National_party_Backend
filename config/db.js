// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config(); // لو شغالة محليًا

// استخدام المتغير اللي عملتيه
const dbUrl = process.env.MYSQL_PRIVATE_URL;

if (!dbUrl) {
  throw new Error('❌ MYSQL_PRIVATE_URL not found, please set it in Environment Variables!');
}

let pool;

try {
  pool = mysql.createPool({
    uri: dbUrl,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log('✅ Database pool created successfully!');
} catch (err) {
  console.error('❌ Failed to create database pool:', err);
}

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Connection successful!');
    conn.release();
  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
}

testConnection();

module.exports = pool;
