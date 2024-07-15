const pool = require('../db/db');

exports.createOrder = async (req, res) => {
  console.log('createOrder called with body:', req.body);
  const { price, date, user_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO orders (price, date, user_id) VALUES ($1, $2, $3) RETURNING *',
      [price, date, user_id]
    );
    console.log('Order created:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in createOrder:', err);
    res.status(500).json({ error: err.message });
  }
};

// Add similar logging to other methods
exports.updateOrder = async (req, res) => {
  console.log('updateOrder called with body:', req.body);
  const { price, date, user_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE orders SET price = $1, date = $2, user_id = $3 WHERE id = $4 RETURNING *',
      [price, date, user_id, req.params.id]
    );
    console.log('Order updated:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in updateOrder:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  console.log('getAllOrders called');
  try {
    const result = await pool.query('SELECT * FROM orders');
    console.log('Orders fetched:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in getAllOrders:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  console.log('getOrderById called with ID:', req.params.id);
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    console.log('Order fetched:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in getOrderById:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  console.log('deleteOrder called with ID:', req.params.id);
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [req.params.id]);
    console.log('Order deleted');
    res.status(204).send();
  } catch (err) {
    console.error('Error in deleteOrder:', err);
    res.status(500).json({ error: err.message });
  }
};
