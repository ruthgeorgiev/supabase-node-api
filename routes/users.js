const express = require('express');
const { validateUser } = require('../middleware/validation');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.post('/', validateUser, usersController.createUser);
router.put('/:id', validateUser, usersController.updateUser);
router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);
router.delete('/:id', usersController.deleteUser);
router.get('/:id/orders', usersController.getUserOrders);
router.put('/:id/check-inactive', usersController.checkUserInactive);

module.exports = router;
