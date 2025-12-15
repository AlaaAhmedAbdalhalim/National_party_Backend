// test-db.js
require('dotenv').config(); // مهم جدًا عشان يقرأ المتغيرات من .env
const pool = require('./config/db'); // هنا ملف db.js بتاعك

async function testConnection() {
    try {
        const connection = await pool.getConnection(); // نجيب كونكشن من البول
        console.log('✅ Connected to the database successfully!');

        // اختياري: نجرب استعلام صغير
        const [rows] = await connection.query('SELECT 1 + 1 AS result');
        console.log('Test query result:', rows[0].result); // لازم تطبع 2

        connection.release(); // نفك الكونكشن من البول
    } catch (err) {
        console.error('❌ Connection failed:', err);
    }
}

testConnection();
