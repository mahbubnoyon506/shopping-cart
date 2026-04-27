const express = require('express');
const router = express.Router();
const {
    createCategory,
    getCategories,
    getCategoryBySlug,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCategories)
    .post(verifyToken, verifyAdmin, createCategory);

router.route('/:id')
    .patch(verifyToken, verifyAdmin, updateCategory)
    .delete(verifyToken, verifyAdmin, deleteCategory);

router.get('/slug/:slug', getCategoryBySlug);

module.exports = router;