const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

// This configuration will use the DATABASE_URL in production (e.g., on Render)
// and separate DB_* variables for local development.
const pool = new Pool(
  isProduction
    ? {
        // Production: Use the connection string from the environment
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        // Local development: Use separate environment variables
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
      }
);

// Test the connection to verify that the database is reachable on startup.
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client for connection test', err.stack);
  }
  console.log('Database connection successful');
  client.release(); // Release the client back to the pool
});

module.exports = pool;