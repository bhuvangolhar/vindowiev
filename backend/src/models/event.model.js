const pool = require('../../config/db');

const EventModel = {
  async create({ title, description, category, event_date, location, price, image_url, total_seats, venue_id }) {
    const query = `
      INSERT INTO events (title, description, category, event_date, location, price, image_url, total_seats, available_seats, venue_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9)
      RETURNING *;
    `;
    const values = [title, description, category, event_date, location, price, image_url, total_seats, venue_id || null];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findAll({ category, search }) {
    let query = `
      SELECT 
        e.*,
        v.name AS venue_name,
        v.city AS venue_city,
        v.address AS venue_address
      FROM events e
      LEFT JOIN venues v ON e.venue_id = v.id
      WHERE 1=1
    `;
    const values = [];

    if (category && category !== 'All') {
      values.push(category);
      query += ` AND e.category = $${values.length}`;
    }

    if (search) {
      values.push(`%${search}%`);
      query += ` AND (e.title ILIKE $${values.length} OR e.location ILIKE $${values.length} OR v.name ILIKE $${values.length})`;
    }

    query += ` ORDER BY e.event_date ASC;`;

    const { rows } = await pool.query(query, values);
    return rows;
  },

  async findById(id) {
    const query = `
      SELECT 
        e.*,
        v.name AS venue_name,
        v.address AS venue_address,
        v.city AS venue_city,
        v.state AS venue_state,
        v.capacity AS venue_capacity
      FROM events e
      LEFT JOIN venues v ON e.venue_id = v.id
      WHERE e.id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

module.exports = EventModel;