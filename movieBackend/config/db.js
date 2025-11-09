const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
      }
);

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client for connection test', err.stack);
  }
  console.log('Database connection successful');
  client.release();
});

module.exports = pool;