const express = require('express');
const router = express.Router();
const { registerUser, getUsers, getUserById } = require('../controllers/user.controller');

router.post('/register', registerUser);
router.get('/', getUsers);
router.get('/:id', getUserById);

module.exports = router;