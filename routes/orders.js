const express = require('express');
const pool = require('../db');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Validation middleware for order data
const validateOrder = [
  body('price').isFloat({ gt: 0 }),
  body('date').isISO8601(),
  body('user_id').isInt({ gt: 0 })
];

// POST /orders to create a new order
router.post('/', validateOrder, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { price, date, user_id } = req.body;
    const result = await pool.query(
      'INSERT INTO orders (price, date, user_id) VALUES ($1, $2, $3) RETURNING *',
      [price, date, user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /orders/:id to update an existing order
router.put('/:id', validateOrder, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { price, date, user_id } = req.body;
    const result = await pool.query(
      'UPDATE orders SET price = $1, date = $2, user_id = $3 WHERE id = $4 RETURNING *',
      [price, date, user_id, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /orders to get all orders
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /orders/:id to get a specific order
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /orders/:id to delete an order
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
