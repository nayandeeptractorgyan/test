const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Public route
router.post('/', orderController.createOrder);

// Protected routes
router.get('/', auth, orderController.getAllOrders);
router.get('/:id', auth, orderController.getOrderById);
router.put('/:id', auth, orderController.updateOrderStatus);
router.delete('/:id', auth, orderController.deleteOrder);

module.exports = router;
