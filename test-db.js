const sql = require('mssql');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "1433", 10),
  options: { encrypt: true, trustServerCertificate: true }
};

async function test() {
  console.log('Trying to connect with server:', dbConfig.server);
  try {
    await sql.connect(dbConfig);
    console.log('Connected to SQL Server!');
  } catch (err) {
    console.error('SQL Connection Error:', err);
  }
}

test();
