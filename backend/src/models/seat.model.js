const pool = require('../../config/db');

const SeatModel = {
  // Bulk create seats for an event (e.g., generating 50 seats at once)
  async bulkCreate(seats) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertedSeats = [];
      for (const seat of seats) {
        const { event_id, seat_number, seat_row, tier = 'Standard', price } = seat;
        const query = `
          INSERT INTO event_seats (event_id, seat_number, seat_row, tier, price)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;
        const res = await client.query(query, [event_id, seat_number, seat_row, tier, price]);
        insertedSeats.push(res.rows[0]);
      }

      await client.query('COMMIT');
      return insertedSeats;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Fetch all seats for a given event
  async findByEventId(event_id) {
    const query = `
      SELECT * FROM event_seats
      WHERE event_id = $1
      ORDER BY seat_row ASC, seat_number ASC;
    `;
    const { rows } = await pool.query(query, [event_id]);
    return rows;
  },

  // Lock and reserve specific seat IDs
  async reserveSeats(client, seat_ids) {
    const query = `
      UPDATE event_seats
      SET is_reserved = true
      WHERE id = ANY($1::int[]) AND is_reserved = false
      RETURNING *;
    `;
    const { rows } = await client.query(query, [seat_ids]);
    return rows;
  },

  // Release/unreserve seat IDs (if booking or payment fails)
  async releaseSeats(seat_ids) {
    const query = `
      UPDATE event_seats
      SET is_reserved = false
      WHERE id = ANY($1::int[])
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [seat_ids]);
    return rows;
  }
};

module.exports = SeatModel;