const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Ticket Booking API is running...' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});