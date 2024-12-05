// routes/sales_routes.js
const express = require('express');
const router = express.Router();
const { Sale, Allocation } = require('../database/models');
const roleMiddleware = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Get all sales (Admin and Market Owner)
router.get('/', authMiddleware, roleMiddleware(['Admin', 'MarketOwner']), async (req, res) => {
  try {
    const sales = await Sale.find({});
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales', error: error.message });
  }
});

// get phone types in aa sale
router.get('/:id', authMiddleware, roleMiddleware(['Seller']), async (req, res) => {
  try {
    const allocation = await Allocation.findOne({ number: req.params });
    const { number, items } = allocation;
    let phoneTypes = [], statusCheck = {};

    await items.forEach(item => {
      const remaining = item.serial.length - item.toSell.length
      item.toSell.length < item.serials.length ? statusCheck[item.phone] = remaining : statusCheck[item.phone] = 0
    })

    if (!allocation) return res.status(400).json({ message: 'Invalid serial number or allocation not sellable' });
    else return Object.entries(statusCheck).map(item => item[1] > 0 && phoneTypes.push(item[0]));

    res.status(201).json(phoneTypes);

  } catch (error) {
    res.status(400).json({ message: 'Error getting phone types', error: error.message });
  }
});

// Create a new sale (Seller)
router.post('/:id', authMiddleware, roleMiddleware(['Seller']), async (req, res) => {
  try {

    const { customer, msisdn, phone, mpesa, serial } = req.body;
    const newSale = new Sale(req.body);
    const allocation = await Allocation.findOne({ 'items.serials': serial, $or: [{ status: 'received' }, { status: 'selling' }] });

    if (!allocation) {
      return res.status(400).json({ message: 'Invalid serial number or allocation not sellable' });
    }

    else {

      const products = allocation.items

      products.forEach(product => {

        if (product.serials.includes(serial)) {
          const toSell = product.toSell.push(serial)
          const serials = product.serials.splice(product.serials.indexOf(serial), 1)
          product = { ...product, serials, toSell }
        }

      })

      await Allocation.findOneAndUpdate({ 'items.serials': serial, $or: [{ status: 'received' }, { status: 'selling' }] }, { items: products, status: 'selling' })
      await newSale.save();
      
    }

    res.status(201).json({message: 'sale request sent'});

  } catch (error) { res.status(400).json({ message: 'Error creating sale', error: error.message }); }
});

// Update sale with receipt number (Market Owner)
router.put('/:id/receipt', authMiddleware, roleMiddleware(['MarketOwner']), async (req, res) => {
  try {
    const { receiptNumber } = req.body;
    const sale = await Sales.findByIdAndUpdate(req.params.id,
      { receiptNumber, status: 'Completed' },
      { new: true, runValidators: true }
    );

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json(sale);
  } catch (error) {
    res.status(400).json({ message: 'Error updating sale', error: error.message });
  }
});

module.exports = router;