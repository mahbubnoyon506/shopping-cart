const express = require('express');
const router = express.Router();
const { createCheckout, stripeWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-checkout', protect, createCheckout);

// This needs to be defined BEFORE your global app.use(express.json()) in server.js 
// OR use a specific middleware check as shown below
router.post('/webhook', express.raw({ type: '*/*' }), stripeWebhook);

module.exports = router;