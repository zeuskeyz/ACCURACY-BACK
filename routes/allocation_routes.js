// routes/allocation_routes.js
const express = require('express');
const router = express.Router();
const { Allocation } = require('../database/models');
const roleMiddleware = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { allocation } = require('../database/schemas');

// Create a new allocation (Admin only)
router.post('/', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const newAllocation = new Allocation(req.body);
    await newAllocation.save();
    res.status(201).json(newAllocation);
  } catch (error) { 
    res.status(400).json({ message: 'Error creating allocation', error: error.message });
  }
});

// Get all allocations (Admin and Market Owner)
router.get('/', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const allocations = await Allocation.find({});
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching allocations', error: error.message });
  }
});

// Get individual allocations (Admin and Market Owner) 
router.get('/me', authMiddleware, roleMiddleware(['MarketOwner', 'Seller']), async (req, res) => {
  try {
    const {role, username} = req.session.user;
    let allocations = []
    if(role === 'MarketOwner') { allocations = await Allocation.find({owner:username})} 
    else { allocations = await Allocation.find({$and: [ {seller:username}, {status: { $ne:'issued' }} ]})}
    res.json(allocations);

  } catch (error) { res.status(500).json({ message: 'Error fetching allocations', error: error.message });}
});

// Get individual allocation ( Market Owner)
router.get('/me/:id', authMiddleware, roleMiddleware(['MarketOwner', 'Seller']), async (req, res) => {
  try {
    const allocations = await Allocation.findOne({_id:req.params.id});
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching allocation', error: error.message });
  }
});

// Update allocation status (Market Owner and Seller)
router.post('/me/:id', authMiddleware, roleMiddleware(['MarketOwner', 'Seller']), async (req, res) => {
  try {
    const allocation = await Allocation.findById(req.params.id);
    if (!allocation) {
      return res.status(404).json({ message: 'Allocation not found' });
    }
    
    if (req.session.user.role === 'MarketOwner' && allocation.status === 'issued') {
      allocation.status = 'dispatched';
    } else if (req.session.user.role === 'Seller' && allocation.status === 'dispatched') {
      allocation.status = 'received';
    } else {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    await allocation.save();
    res.json(`allocation status updated successfully`);
  } catch (error) {
    res.status(400).json({ message: 'Error updating allocation status', error: error.message });
  }
});

// Delete an Allocation
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const allocation = await Allocation.findByIdAndDelete(req.params.id);
    if (!allocation) return res.status(404).json({ message: 'Allocation not found' });
    res.json({ message: 'Allocation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// enum: ['issued', 'dispatched', 'received' ,'closed']
//add an empty array called sold on the items object for each item so that when a serial is sold it is pushed into
//the new sold array.