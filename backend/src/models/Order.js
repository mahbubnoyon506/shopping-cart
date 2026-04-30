const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true },
    invoiceNumber: { type: String, unique: true, sparse: true },
    customerName: String,
    email: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
    stripeCheckoutSessionId: String,
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        image: String,
        price: Number,
        discount: { type: Number, default: 0 },
        quantity: Number,
    }],
    totalPrice: Number,
    currency: { type: String, default: 'USD' },
    status: {
        type: String,
        enum: ["pending", "processing", "paid", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    address: {
        city: String,
        state: String,
        zip: String,
        address: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);