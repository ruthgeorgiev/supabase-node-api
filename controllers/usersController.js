const UserService = require('../services/userService');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const headers = {
  'apikey': supabaseKey,
  'Authorization': `Bearer ${supabaseKey}`
};
const userService = new UserService(supabaseUrl, headers);

exports.createUser = async (req, res) => {
  const { first_name, last_name, age } = req.body;
  try {
    const newUser = await userService.createUser({ first_name, last_name, age });
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  const { first_name, last_name, age, active } = req.body;
  try {
    const updatedUser = await userService.updateUser(req.params.id, { first_name, last_name, age, active });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await userService.getUserOrders(req.params.id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.checkUserInactive = async (req, res) => {
  try {
    const result = await userService.checkUserInactive(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'User has orders') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
