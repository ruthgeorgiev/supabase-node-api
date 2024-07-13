const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const headers = {
  'apikey': supabaseKey,
  'Authorization': `Bearer ${supabaseKey}`
};

const validateOrder = [
  body('price').isFloat({ gt: 0 }),
  body('date').isISO8601(),
  body('user_id').isInt({ gt: 0 })
];

router.post('/', validateOrder, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { price, date, user_id } = req.body;
    const response = await axios.post(`${supabaseUrl}/rest/v1/orders`, {
      price, date, user_id
    }, { headers });
    res.json(response.data);
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
    const response = await axios.patch(`${supabaseUrl}/rest/v1/orders?id=eq.${req.params.id}`, {
      price, date, user_id
    }, { headers });
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${supabaseUrl}/rest/v1/orders`, { headers });
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${supabaseUrl}/rest/v1/orders?id=eq.${req.params.id}`, { headers });
    res.json(response.data[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await axios.delete(`${supabaseUrl}/rest/v1/orders?id=eq.${req.params.id}`, { headers });
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
