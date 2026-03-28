const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProductBySlug,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Chain routes for the same path
router.route('/')
    .get(getProducts)
    .post(verifyAdmin, createProduct); // Admin-only for creating products

router.route('/:id')
    .patch(verifyAdmin, updateProduct) // Admin-only
    .delete(verifyAdmin, deleteProduct); // Admin-only

// Specific route for slug lookup
router.get('/:slug', getProductBySlug);

module.exports = router;