/* const sql = require('mssql');

const config = {
  user: 'NationalUser',
  password: 'Np@2025Strong!',
  server: 'localhost', // مثال: DESKTOP-123\\SQLEXPRESS
  database: 'NationalParty',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

sql.connect(config)
  .then(() => {
    console.log('✅ Connected To NationalParty Successfully');
  })
  .catch(err => {
    console.log('❌ Connection Failed:', err);
  });
 */
const sql = require('mssql');
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
