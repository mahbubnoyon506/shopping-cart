const mongoose = require('mongoose');

// Blog Category Schema
const blogCategorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String
}, { timestamps: true });

const BlogCategory = mongoose.model('BlogCategory', blogCategorySchema);

// Blog Schema
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: String, default: "Admin" }, // Or ref to a User model
    blogcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogCategory' }],
    mainImage: { type: String }, // URL to the asset
    body: { type: Array, required: true }, // Stores the rich text blocks
    isLatest: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = { Blog, BlogCategory };