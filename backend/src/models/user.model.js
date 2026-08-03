const pool = require('../db');

const UserModel = {
  // Create a new user
  async create({ name, email, password, role = 'user' }) {
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at;
    `;
    const values = [name, email, password, role];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Find user by email
  async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  },

  // Find user by ID (excluding password)
  async findById(id) {
    const query = `SELECT id, name, email, role, created_at FROM users WHERE id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Get all users (excluding passwords)
  async findAll() {
    const query = `SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC;`;
    const { rows } = await pool.query(query);
    return rows;
  }
};

module.exports = UserModel;