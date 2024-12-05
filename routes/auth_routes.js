const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../database/models');
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Set user session
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
      branchCode: user.branchCode,
      isLogged: true
    };

    res.json({ message: 'Logged in successfully', user: req.session.user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again' });
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user route
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.json({ message: 'Not authenticated' });
  }
});

module.exports = router;