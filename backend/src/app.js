require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./../config/db'); // Initializes PostgreSQL pool

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Ticket Booking API is running...',
      dbTime: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({ error: 'Database connection error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});