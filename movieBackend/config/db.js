const { Pool } = require('pg');
require('dotenv').config();

// Create a new Pool instance using environment variables
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    // Note: If PG_HOST, PG_DATABASE, or PG_PORT are undefined, 
    // it will try to use the default Postgres values or fail.
});

// Simple connection test
// This uses the pool's internal query function for a quick check.
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        return console.error('🔴 Error connecting to PostgreSQL database:', err.stack);
    }
    console.log('✅ Connected to PostgreSQL database successfully!');
});

// Export the Pool instance directly.
// This is the CRITICAL FIX that resolves the "pool.connect is not a function" error.
module.exports = pool;