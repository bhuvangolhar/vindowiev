const UserModel = require('../models/user.model');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }

    const newUser = await UserModel.create({ name, email, password, role });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch all users
const getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch a single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  registerUser,
  getUsers,
  getUserById,
};