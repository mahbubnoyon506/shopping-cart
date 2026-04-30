const express = require('express');
const { verifyAdmin } = require('../middleware/authMiddleware');
const { getAnalyticsOverview, getInventoryAlerts, getProductAnalytics, getSalesAnalytics } = require("../controllers/analyticsController");
const router = express.Router();

router.get('/overview', verifyAdmin, getAnalyticsOverview);
router.get("/products", verifyAdmin, getProductAnalytics);
router.get("/sales", verifyAdmin, getSalesAnalytics);
router.get("/inventory-alerts", verifyAdmin, getInventoryAlerts);

module.exports = router;
