require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

console.log('DATABASE_URL:', process.env.DATABASE_URL);  // Log DATABASE_URL
console.log('DATABASE_SSL:', process.env.DATABASE_SSL);  // Log DATABASE_SSL

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
