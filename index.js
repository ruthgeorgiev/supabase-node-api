const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
