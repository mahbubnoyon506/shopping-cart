const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    status: { type: String, enum: ['new', 'hot', 'sale', 'regular'], default: 'new' },
    variant: String,
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    categories: [{ type: String }], // Keeping strings as per your JSON, or ref to Category
    images: [{
        asset_ref: String,
        url: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);