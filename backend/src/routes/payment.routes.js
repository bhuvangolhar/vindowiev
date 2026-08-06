const express = require('express');
const router = express.Router();
const { processPayment, getPaymentByBooking, getUserPayments } = require('../controllers/payment.controller');

router.post('/', processPayment);
router.get('/booking/:bookingId', getPaymentByBooking);
router.get('/user/:userId', getUserPayments);

module.exports = router;