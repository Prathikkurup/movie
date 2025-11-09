const express = require('express');
require('dotenv').config(); // Loads environment variables from .env file
const cors = require('cors'); // Import the cors package

// Import Database setup (to ensure connection runs and is available)
const db = require('./config/db'); 

// --- Import Routes ---
const authRoutes = require('./routes/authRoutes'); // This imports your /signup and /login routes
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');


const app = express();

// --- Configure CORS ---
// This allows your frontend (running on http://localhost:8080) to make requests to your backend.
app.use(cors({
    origin: 'http://localhost:8080' 
}));

// Middleware: Allows the server to parse incoming JSON bodies (Crucial for login/signup data)
app.use(express.json());

// --- Define Route Groups ---
app.use('/api/auth', authRoutes); // All routes in authRoutes.js start with /api/auth
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
// Basic Test Route
app.get('/', (req, res) => {
    res.status(200).send('Movie Booking API is running!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});