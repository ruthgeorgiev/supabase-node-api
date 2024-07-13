const express = require('express');
const axios = require('axios');
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
    const response = await axios.post(`${supabaseUrl}/rest/v1/users`, {
      first_name, last_name, age
    }, { headers });
    res.json(response.data);
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
    const response = await axios.get(`${supabaseUrl}/rest/v1/users`, { headers });
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${supabaseUrl}/rest/v1/users?id=eq.${req.params.id}`, { headers });
    res.json(response.data[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await axios.delete(`${supabaseUrl}/rest/v1/users?id=eq.${req.params.id}`, { headers });
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/orders', async (req, res) => {
  try {
    const response = await axios.get(`${supabaseUrl}/rest/v1/orders?user_id=eq.${req.params.id}`, { headers });
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/check-inactive', async (req, res) => {
  try {
    const response = await axios.get(`${supabaseUrl}/rest/v1/orders?user_id=eq.${req.params.id}`, { headers });
    if (response.data.length === 0) {
      const result = await axios.patch(`${supabaseUrl}/rest/v1/users?id=eq.${req.params.id}`, {
        active: false
      }, { headers });
      res.json(result.data[0]);
    } else {
      res.status(400).json({ error: 'User has orders' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
