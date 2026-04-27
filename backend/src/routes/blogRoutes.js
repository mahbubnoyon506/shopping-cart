const express = require('express');
const router = express.Router();
const {
    createBlog,
    getBlogs,
    getBlogBySlug,
    createBlogCategory,
    getBlogCategories,
    updateBlog,
    deleteBlog,
    updateBlogCategory,
    deleteBlogCategory
} = require('../controllers/blogController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Blog Category Routes
router.route('/categories')
    .get(getBlogCategories)
    .post(verifyAdmin, createBlogCategory);

router.route('/categories/:id')
    .patch(verifyAdmin, updateBlogCategory)
    .delete(verifyAdmin, deleteBlogCategory);

// Blog Routes
router.route('/')
    .get(getBlogs)
    .post(verifyAdmin, createBlog);
router.route('/:id')
    .patch(verifyAdmin, updateBlog)
    .delete(verifyAdmin, deleteBlog);

router.get('/:slug', getBlogBySlug);

module.exports = router;