const User = require('../models/User');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const registerUser = async (req, res) => {

  console.log("Registering user")
  try {
    const { username, email, password, role } = req.body;

    // check if the user is already registered
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: 'The user has already been registered' });
    }

    //Save the user
    const user = new User({ username, email, password, role });

    await user.save();
    res.status(201).json({
      message: 'User created successfully',
      userId: user._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
}


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'User authenticated successfully',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error authenticating user', error: error.message });
  }
};


const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};
module.exports = { registerUser, loginUser, getUserProfile };