const express = require('express');
const { getMovies, getShowtimeSeats } = require('../controllers/movieController');
const { protect } = require('../middleware/authMiddleware'); // Import the middleware

const router = express.Router();

// The protect middleware ensures only logged-in users can view movies
router.get('/', protect, getMovies); 
router.get('/:showtimeId/seats', protect, getShowtimeSeats);

module.exports = router;