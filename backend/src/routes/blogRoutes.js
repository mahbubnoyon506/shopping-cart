const express = require('express');
const router = express.Router();
const {
    createBlog,
    getBlogs,
    getBlogBySlug,
    createBlogCategory,
    getBlogCategories
} = require('../controllers/blogController');

// Blog Category Routes
router.route('/categories')
    .get(getBlogCategories)
    .post(createBlogCategory);

// Blog Routes
router.route('/')
    .get(getBlogs)
    .post(createBlog);

router.get('/:slug', getBlogBySlug);

module.exports = router;