// routes/phone_routes.js
const express = require('express');
const router = express.Router();
const { Phone } = require('../database/models');
const authMiddleware  = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Get all phones (All authenticated users)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const phones = await Phone.find({});
    res.json(phones);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching phones', error: error.message });
  }
});

// Create a new phone (Admin only)
router.post('/new', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
      const newPhone = new Phone(req.body);
      await newPhone.save();
      res.status(201).json({message: 'Device added successfully'});
  } catch (error) {
    res.status(400).json({ message: 'Error creating phone', error: error.message });
  }
});

// Update a phone (Admin only)
router.put('/edit/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const updatedPhone = await Phone.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedPhone) {
      return res.status(404).json({ message: 'Phone not found' });
    }
    res.json(updatedPhone);
  } catch (error) {
    res.status(400).json({ message: 'Error updating phone', error: error.message });
  }
});

// Delete a phone (Admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const deletedPhone = await Phone.findByIdAndDelete(req.params.id);
    if (!deletedPhone) {
      return res.status(404).json({ message: 'Phone not found' });
    }
    res.json({ message: 'Phone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting phone', error: error.message });
  }
});

module.exports = router;