const { User } = require('../models/User');



const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // check if the user is already registered
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: 'Already registered' });
    }

    //Save the user
    const user = new User({ username, email, password, role });

    await user.save();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { registerUser };