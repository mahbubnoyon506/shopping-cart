const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById,
    getMyOrders,

} = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Standard routes
router.route('/')
    .get(verifyAdmin, getOrders)
    .post(verifyToken, createOrder);

router.route('/my-orders').get(verifyToken, getMyOrders)

router.route('/:id')
    .get(verifyToken, getOrderById);

module.exports = router;