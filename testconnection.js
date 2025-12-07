const sql = require('mssql');

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
