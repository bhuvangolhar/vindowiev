const EventModel = require('../models/event.model');

// Create a new event
const createEvent = async (req, res) => {
  try {
    const { title, description, category, event_date, location, price, image_url, total_seats } = req.body;

    if (!title || !category || !event_date || !location || price == null || !total_seats) {
      return res.status(400).json({ error: 'Title, category, event_date, location, price, and total_seats are required.' });
    }

    const newEvent = await EventModel.create({
      title,
      description,
      category,
      event_date,
      location,
      price,
      image_url,
      total_seats,
    });

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error('Error in createEvent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch events with category or search filters
const getEvents = async (req, res) => {
  try {
    const { category, search } = req.query;
    const events = await EventModel.findAll({ category, search });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error in getEvents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch a single event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await EventModel.findById(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Error in getEventById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
};