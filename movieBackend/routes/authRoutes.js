const express = require('express');
// Import all required controller functions and middleware
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Maps POST request to /api/auth/signup to the signup function
router.post('/signup', signup);

// Maps POST request to /api/auth/login to the login function
router.post('/login', login);

// --- FIX ---
// Add the protected GET route for /api/auth/me
// This allows the frontend to verify a user's token on page load.
router.get('/me', protect, getMe);

module.exports = router;
