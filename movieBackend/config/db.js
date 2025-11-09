const { Pool } = require('pg');

// This will automatically use the DATABASE_URL environment variable
// on Render, and your local database settings on your machine.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Heroku and Render require SSL for database connections,
  // but do not provide a CA certificate.
  // `rejectUnauthorized: false` is often required for these platforms.
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log('connected to the db');
});

module.exports = pool;