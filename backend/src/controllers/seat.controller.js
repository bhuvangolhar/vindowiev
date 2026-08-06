const SeatModel = require('../models/seat.model');

// Bulk generate seats for an event
const createSeatsBulk = async (req, res) => {
  try {
    const { seats } = req.body; // Expects an array of seat objects

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ error: 'An array of seat objects is required.' });
    }

    const createdSeats = await SeatModel.bulkCreate(seats);
    res.status(201).json({ message: 'Seats created successfully', count: createdSeats.length, seats: createdSeats });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'One or more seat numbers already exist for this event.' });
    }
    console.error('Error in createSeatsBulk:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all seats for a specific event
const getSeatsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const seats = await SeatModel.findByEventId(eventId);
    res.status(200).json(seats);
  } catch (error) {
    console.error('Error in getSeatsByEvent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Release reserved seats
const releaseSeats = async (req, res) => {
  try {
    const { seat_ids } = req.body;

    if (!Array.isArray(seat_ids) || seat_ids.length === 0) {
      return res.status(400).json({ error: 'Array of seat_ids is required.' });
    }

    const unreserved = await SeatModel.releaseSeats(seat_ids);
    res.status(200).json({ message: 'Seats released successfully', seats: unreserved });
  } catch (error) {
    console.error('Error in releaseSeats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createSeatsBulk,
  getSeatsByEvent,
  releaseSeats,
};