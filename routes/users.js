const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const router = express.Router();

const validateUser = [
  body('first_name').isString().isLength({ min: 1, max: 255 }),
  body('last_name').isString().isLength({ min: 1, max: 255 }),
  body('age').isInt({ min: 0 }),
  body('active').optional().isBoolean()
];

router.post('/', validateUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { first_name, last_name, age } = req.body;
    const user = new User({ first_name, last_name, age });
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', validateUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { first_name, last_name, age, active } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { first_name, last_name, age, active }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/orders', async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.params.id });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/check-inactive', async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.params.id });
    if (orders.length === 0) {
      const user = await User.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
      res.json(user);
    } else {
      res.status(400).json({ error: 'User has orders' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
