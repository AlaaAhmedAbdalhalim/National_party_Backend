/* const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,              // ✅ MUST be true for Somee
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Connected To Somee SQL Server Successfully');
        return pool;
    })
    .catch(err => {
        console.log('❌ Connection Failed:', err);
        throw err;
    });

module.exports = { sql, poolPromise };
 */const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: true,               // required for Somee
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Connected to SQL Server Successfully');
        return pool;
    })
    .catch(err => {
        console.error('❌ Connection Failed:', err.message);
        throw err;
    });

module.exports = { sql, poolPromise };
