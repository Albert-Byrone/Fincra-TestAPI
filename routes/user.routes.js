const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controller/user.controller');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Route for adding  a new user
router.post('/register', registerUser)

// Route to login a user
router.post('/login', loginUser)

// Route to get the profile of the logged-in user
router.get('/profile', authenticate, getUserProfile);


module.exports = router;
