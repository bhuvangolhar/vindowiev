const pool = require('../../config/db');

const PaymentModel = {
  // Create payment record and update booking status in a single transaction
  async create({ booking_id, user_id, transaction_id, amount, payment_method, status = 'completed' }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Insert payment record
      const paymentQuery = `
        INSERT INTO payments (booking_id, user_id, transaction_id, amount, payment_method, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const paymentResult = await client.query(paymentQuery, [
        booking_id,
        user_id,
        transaction_id,
        amount,
        payment_method,
        status,
      ]);

      // 2. Update booking status if payment is completed
      const bookingStatus = status === 'completed' ? 'paid' : 'payment_failed';
      await client.query(
        'UPDATE bookings SET status = $1 WHERE id = $2;',
        [bookingStatus, booking_id]
      );

      await client.query('COMMIT');
      return paymentResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Get payment details by booking ID
  async findByBookingId(booking_id) {
    const query = `
      SELECT p.*, b.event_id, b.seats_booked
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      WHERE p.booking_id = $1;
    `;
    const { rows } = await pool.query(query, [booking_id]);
    return rows[0];
  },

  // Get all payments for a specific user
  async findByUserId(user_id) {
    const query = `
      SELECT p.*, e.title AS event_title
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN events e ON b.event_id = e.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC;
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
  }
};

module.exports = PaymentModel;