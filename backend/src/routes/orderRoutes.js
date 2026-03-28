const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById
} = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Standard routes
router.route('/')
    .get(verifyAdmin, getOrders)    // Admin-only route
    .post(verifyToken, createOrder); // Authenticated user can create order

router.route('/:id')
    .get(verifyToken, getOrderById); // Authenticated user can view own order

module.exports = router;