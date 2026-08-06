const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getBookingById } = require('../controllers/booking.controller');

router.post('/', createBooking);
router.get('/user/:userId', getUserBookings);
router.get('/:id', getBookingById);

module.exports = router;