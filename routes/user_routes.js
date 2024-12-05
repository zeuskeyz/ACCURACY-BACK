// routes/user_routes.js
const express = require('express');
const router = express.Router();
const { User, Market } = require('../database/models');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const bcrypt = require('bcrypt');

// Get all users (Admin only)
router.get('/', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Route to get all sellers
router.get('/sellers', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    let options = []
    let takenSellers = []
    const exists = await Market.find()
    const sellers = await User.find({ role: 'Seller' }, '-password');
    exists.map(item => takenSellers = [...takenSellers, item.seller])
    sellers.map(seller => {
      !takenSellers.includes(seller.username) ? options = [...options, { value: seller.username, label: seller.fullName.toUpperCase() }] : null
    })

    res.json(options);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sellers', error: error.message });
  }
});

// Route to get all market owners
router.get('/owners', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    let options = []
    const owners = await User.find({ role: 'MarketOwner' }, { password: 0 });
    owners.map(owner => options = [...options, { value: owner.username, label: owner.fullName.toUpperCase() }])
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching market owners', error: error.message });
  }
});

// Create a new user (Admin only)
router.post('/new', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const exists = User.findOne({ $or: [{ fullName: req.body.fullName }, { phoneNumber: req.body.phoneNumber }, { username: req.body.username }] })
    if (exists) return res.status(400).json({ message: 'User already exists' })
    else {
      const password = await bcrypt.hash(req.body.password, 12)
      const newUser = new User({ ...req.body, password });
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    }
  } catch (error) { res.status(400).json({ message: 'Error creating user', error: error.message });}
});

// Update a user (Admin only)
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  if (req.session.user.role !== 'Admin' && req.session.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error: error.message });
  }
});

// Delete a user (Admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router;