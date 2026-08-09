const express = require('express');
const router = express.Router();
const { createVenue, getVenues, getVenueById } = require('../controllers/venue.controller');

router.post('/', createVenue);
router.get('/', getVenues);
router.get('/:id', getVenueById);

module.exports = router;