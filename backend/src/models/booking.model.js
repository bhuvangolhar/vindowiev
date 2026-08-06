const pool = require('../../config/db');

const BookingModel = {
  // Create a booking atomically within a database transaction
  async create({ user_id, event_id, seats_booked }) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Lock event row and verify seat availability
      const eventResult = await client.query(
        'SELECT price, available_seats FROM events WHERE id = $1 FOR UPDATE;',
        [event_id]
      );

      if (eventResult.rows.length === 0) {
        throw new Error('EVENT_NOT_FOUND');
      }

      const event = eventResult.rows[0];

      if (event.available_seats < seats_booked) {
        throw new Error('NOT_ENOUGH_SEATS');
      }

      const total_price = Number(event.price) * seats_booked;

      // 2. Deduct available seats
      await client.query(
        'UPDATE events SET available_seats = available_seats - $1 WHERE id = $2;',
        [seats_booked, event_id]
      );

      // 3. Create booking record
      const bookingQuery = `
        INSERT INTO bookings (user_id, event_id, seats_booked, total_price)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const bookingResult = await client.query(bookingQuery, [
        user_id,
        event_id,
        seats_booked,
        total_price,
      ]);

      await client.query('COMMIT');
      return bookingResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Get all bookings for a user with event details
  async findByUserId(user_id) {
    const query = `
      SELECT 
        b.id,
        b.seats_booked,
        b.total_price,
        b.status,
        b.created_at,
        e.title AS event_title,
        e.event_date,
        e.location,
        e.image_url
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC;
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
  },

  // Get single booking by ID with user and event details
  async findById(id) {
    const query = `
      SELECT 
        b.*,
        u.name AS user_name,
        u.email AS user_email,
        e.title AS event_title,
        e.location,
        e.event_date
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN events e ON b.event_id = e.id
      WHERE b.id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

module.exports = BookingModel;