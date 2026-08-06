const BookingModel = require('../models/booking.model');

// Create new booking
const createBooking = async (req, res) => {
  try {
    const { user_id, event_id, seats_booked } = req.body;

    if (!user_id || !event_id || !seats_booked || seats_booked <= 0) {
      return res.status(400).json({ error: 'Valid user_id, event_id, and seats_booked (> 0) are required.' });
    }

    const booking = await BookingModel.create({ user_id, event_id, seats_booked });
    res.status(201).json({ message: 'Booking confirmed successfully', booking });
  } catch (error) {
    if (error.message === 'EVENT_NOT_FOUND') {
      return res.status(404).json({ error: 'Event not found.' });
    }
    if (error.message === 'NOT_ENOUGH_SEATS') {
      return res.status(400).json({ error: 'Not enough seats available for this event.' });
    }
    console.error('Error in createBooking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get bookings by User ID
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await BookingModel.findByUserId(userId);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get booking by Booking ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingModel.findById(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error in getBookingById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
};