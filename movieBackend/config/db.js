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

// Test the connection to verify that the database is reachable on startup.
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client for connection test', err.stack);
  }
  console.log('Database connection successful');
  client.release(); // Release the client back to the pool
});

module.exports = pool;