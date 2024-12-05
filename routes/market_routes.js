const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { Market } = require('../database/models');

// Create a new market
router.post('/new', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const exists = await Market.findOne({name:req.body.name})
    if (exists) return res.status(404).json({ message: 'Market already exists' })
    else { 
      const new_market = new Market(req.body);
      await new_market.save();
      res.status(201).json('Market created successfully');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all markets
router.get('/', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const markets = await Market.find();
    res.json(markets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific market
router.get('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const market = await Market.findById(req.params.id);
    if (!market) return res.status(404).json({ message: 'Market not found' });
    res.json(market);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a market
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const { name, owner, seller, branchCode } = req.body;
    const market = await Market.findByIdAndUpdate(
      req.params.id,
      { name, owner, seller, branchCode },
      { new: true, runValidators: true }
    );
    if (!market) return res.status(404).json({ message: 'Market not found' });
    res.json(market);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a market
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const market = await Market.findByIdAndDelete(req.params.id);
    if (!market) return res.status(404).json({ message: 'Market not found' });
    res.json({ message: 'Market deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;