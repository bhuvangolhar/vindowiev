const pool = require('../../config/db');

const VenueModel = {
  // Create a new venue
  async create({ name, address, city, state, zip_code, capacity, contact_phone }) {
    const query = `
      INSERT INTO venues (name, address, city, state, zip_code, capacity, contact_phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [name, address, city, state, zip_code, capacity, contact_phone];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Get all venues with optional city filter
  async findAll({ city }) {
    let query = `SELECT * FROM venues WHERE 1=1`;
    const values = [];

    if (city) {
      values.push(city);
      query += ` AND city ILIKE $${values.length}`;
    }

    query += ` ORDER BY name ASC;`;
    const { rows } = await pool.query(query, values);
    return rows;
  },

  // Get single venue by ID with associated events
  async findById(id) {
    const query = `SELECT * FROM venues WHERE id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Get venue along with all events hosted at this venue
  async findWithEvents(id) {
    const venueQuery = `SELECT * FROM venues WHERE id = $1;`;
    const eventsQuery = `SELECT * FROM events WHERE venue_id = $1 ORDER BY event_date ASC;`;

    const venueRes = await pool.query(venueQuery, [id]);
    if (venueRes.rows.length === 0) return null;

    const eventsRes = await pool.query(eventsQuery, [id]);
    return {
      ...venueRes.rows[0],
      events: eventsRes.rows,
    };
  }
};

module.exports = VenueModel;