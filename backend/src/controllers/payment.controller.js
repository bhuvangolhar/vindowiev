const PaymentModel = require('../models/payment.model');

// Process a payment
const processPayment = async (req, res) => {
  try {
    const { booking_id, user_id, transaction_id, amount, payment_method, status } = req.body;

    if (!booking_id || !user_id || !transaction_id || amount == null || !payment_method) {
      return res.status(400).json({
        error: 'booking_id, user_id, transaction_id, amount, and payment_method are required.',
      });
    }

    const payment = await PaymentModel.create({
      booking_id,
      user_id,
      transaction_id,
      amount,
      payment_method,
      status: status || 'completed',
    });

    res.status(201).json({ message: 'Payment processed successfully', payment });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Transaction ID already exists.' });
    }
    console.error('Error in processPayment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get payment by booking ID
const getPaymentByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const payment = await PaymentModel.findByBookingId(bookingId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found for this booking.' });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error('Error in getPaymentByBooking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all payments for a user
const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await PaymentModel.findByUserId(userId);
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error in getUserPayments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  processPayment,
  getPaymentByBooking,
  getUserPayments,
};