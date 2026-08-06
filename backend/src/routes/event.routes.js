const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEventById } = require('../controllers/event.controller');

router.post('/', createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);

module.exports = router;