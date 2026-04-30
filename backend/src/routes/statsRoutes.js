

const express = require('express');
const { verifyAdmin } = require('../middleware/authMiddleware');
const { getStats } = require('../controllers/statsController');
const router = express.Router();

router.get('/', verifyAdmin, getStats);

module.exports = router;
