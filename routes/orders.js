const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const router = express.Router();

const validateOrder = [
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('date').isISO8601().withMessage('Date must be a valid ISO 8601 date'),
  body('user_id').isMongoId().withMessage('User ID must be a valid MongoDB ObjectId')
];

router.post('/', validateOrder, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { price, date, user_id } = req.body;
    const order = new Order({ price, date, user_id });
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', validateOrder, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { price, date, user_id } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { price, date, user_id }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
