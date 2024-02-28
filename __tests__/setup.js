// tests/setup.js
const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.connect('mongodb://127.0.0.1/user_test_db');
};