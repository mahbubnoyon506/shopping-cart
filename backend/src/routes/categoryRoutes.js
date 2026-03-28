const express = require('express');
const router = express.Router();
const {
    createCategory,
    getCategories,
    getCategoryBySlug,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

router.route('/')
    .get(getCategories)
    .post(createCategory);

router.route('/:id')
    .patch(updateCategory)
    .delete(deleteCategory);

router.get('/slug/:slug', getCategoryBySlug);

module.exports = router;