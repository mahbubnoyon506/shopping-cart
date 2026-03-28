const express = require('express');
const router = express.Router();
const {
    createBrand,
    getBrands,
    getBrandBySlug,
    updateBrand,
    deleteBrand
} = require('../controllers/brandController');

// Main routes
router.route('/')
    .get(getBrands)
    .post(createBrand);

// ID-based routes (Update/Delete)
router.route('/:id')
    .patch(updateBrand)
    .delete(deleteBrand);

// Slug-based route for frontend display
router.get('/slug/:slug', getBrandBySlug);

module.exports = router;