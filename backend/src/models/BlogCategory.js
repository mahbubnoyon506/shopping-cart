const mongoose = require('mongoose');

const blogCategorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String
}, { timestamps: true });

module.exports = mongoose.model('BlogCategory', blogCategorySchema);