const express = require('express');
// Ensure you import the new function and the pool for transactions
const { createBooking, getBookingHistory, cancelBooking} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware'); 
const router = express.Router();

// POST /api/bookings - Create a new booking
router.post('/', protect, createBooking);

// GET /api/bookings - Get booking history for the user
router.get('/', protect, getBookingHistory); // <--- ADD THIS LINE
router.delete('/:bookingId', protect, cancelBooking); // <--- ADD THIS LINE
module.exports = router;