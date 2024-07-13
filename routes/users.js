// routes/userRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const UserService = require('../services/userService');
const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const headers = {
  'apikey': supabaseKey,
  'Authorization': `Bearer ${supabaseKey}`
};

const userService = new UserService(supabaseUrl, headers);

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
    const userData = { first_name, last_name, age };
    const newUser = await userService.createUser(userData);
    res.json(newUser);
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
    const userData = { first_name, last_name, age, active };
    const updatedUser = await userService.updateUser(req.params.id, userData);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/orders', async (req, res) => {
  try {
    const orders = await userService.getUserOrders(req.params.id);
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/check-inactive', async (req, res) => {
  try {
    const result = await userService.checkUserInactive(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'User has orders') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

module.exports = router;
