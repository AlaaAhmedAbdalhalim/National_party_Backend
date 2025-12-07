// config/db.js
const sql = require('mssql');

const config = {
    user: 'NationalUser',
    password: 'Np@2025Strong!',
    server: 'localhost',   // لو SQL Server على نفس الجهاز
    database: 'NationalParty',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Pool مع promise عشان نقدر نستخدمه في الروترات
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Connected To NationalParty Successfully');
        return pool;
    })
    .catch(err => {
        console.log('❌ Connection Failed:', err);
        throw err; // مهم عشان أي كود يعتمد على pool يعرف فيه مشكلة
    });

module.exports = { sql, poolPromise };
