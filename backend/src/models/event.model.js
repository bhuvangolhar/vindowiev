const pool = require('../../config/db');

const EventModel = {
  // Create a new event
  async create({ title, description, category, event_date, location, price, image_url, total_seats }) {
    const query = `
      INSERT INTO events (title, description, category, event_date, location, price, image_url, total_seats, available_seats)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
      RETURNING *;
    `;
    const values = [title, description, category, event_date, location, price, image_url, total_seats];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Fetch all events with optional category and search filters
  async findAll({ category, search }) {
    let query = `SELECT * FROM events WHERE 1=1`;
    const values = [];

    if (category && category !== 'All') {
      values.push(category);
      query += ` AND category = $${values.length}`;
    }

    if (search) {
      values.push(`%${search}%`);
      query += ` AND (title ILIKE $${values.length} OR location ILIKE $${values.length})`;
    }

    query += ` ORDER BY event_date ASC;`;

    const { rows } = await pool.query(query, values);
    return rows;
  },

  // Find a single event by ID
  async findById(id) {
    const query = `SELECT * FROM events WHERE id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

module.exports = EventModel;