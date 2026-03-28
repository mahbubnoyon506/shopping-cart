const { Blog, BlogCategory } = require('../models/Blog');
const slugify = require('slugify');

// --- Blog Category Logic ---
exports.createBlogCategory = async (req, res) => {
    try {
        req.body.slug = slugify(req.body.title, { lower: true });
        const category = await BlogCategory.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getBlogCategories = async (req, res) => {
    try {
        const categories = await BlogCategory.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Blog Logic ---
exports.createBlog = async (req, res) => {
    try {
        req.body.slug = slugify(req.body.title, { lower: true });
        const blog = await Blog.create(req.body);
        res.status(201).json({ success: true, data: blog });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate('blogcategories')
            .sort({ publishedAt: -1 });
        res.status(200).json({ success: true, count: blogs.length, data: blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug }).populate('blogcategories');
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};