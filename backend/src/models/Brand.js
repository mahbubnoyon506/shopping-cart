const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);