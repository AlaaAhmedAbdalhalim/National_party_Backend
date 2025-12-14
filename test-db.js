const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  uri: process.env.MYSQL_PRIVATE_URL
});

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
