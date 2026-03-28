const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    featured: { type: Boolean, default: false },
    image: String,
    productCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);