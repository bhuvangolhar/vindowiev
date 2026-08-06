const express = require('express');
const router = express.Router();
const { createSeatsBulk, getSeatsByEvent, releaseSeats } = require('../controllers/seat.controller');

router.post('/bulk', createSeatsBulk);
router.get('/event/:eventId', getSeatsByEvent);
router.post('/release', releaseSeats);

module.exports = router;