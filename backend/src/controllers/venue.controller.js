const VenueModel = require('../models/venue.model');

// Create a new venue
const createVenue = async (req, res) => {
  try {
    const { name, address, city, state, zip_code, capacity, contact_phone } = req.body;

    if (!name || !address || !city || capacity == null) {
      return res.status(400).json({ error: 'Name, address, city, and capacity are required.' });
    }

    const newVenue = await VenueModel.create({
      name,
      address,
      city,
      state,
      zip_code,
      capacity,
      contact_phone,
    });

    res.status(201).json({ message: 'Venue created successfully', venue: newVenue });
  } catch (error) {
    console.error('Error in createVenue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all venues
const getVenues = async (req, res) => {
  try {
    const { city } = req.query;
    const venues = await VenueModel.findAll({ city });
    res.status(200).json(venues);
  } catch (error) {
    console.error('Error in getVenues:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get venue by ID with its hosted events
const getVenueById = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await VenueModel.findWithEvents(id);

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    res.status(200).json(venue);
  } catch (error) {
    console.error('Error in getVenueById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createVenue,
  getVenues,
  getVenueById,
};