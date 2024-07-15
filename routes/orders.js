const express = require('express');
const { validateOrder } = require('../middleware/validation');
const ordersController = require('../controllers/ordersController');

const router = express.Router();

router.post('/', validateOrder, ordersController.createOrder);
router.put('/:id', validateOrder, ordersController.updateOrder);
router.get('/', ordersController.getAllOrders);
router.get('/:id', ordersController.getOrderById);
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;
