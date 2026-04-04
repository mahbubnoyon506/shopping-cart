const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');


// @desc    Create a new order
// @route   POST /api/orders

exports.createOrder = async (req, res) => {
    // 1. Start the Session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { products, address, email, customerName } = req.body;

        if (!products || products.length === 0) {
            throw new Error("No products in order");
        }

        let totalPrice = 0;
        const processedProducts = [];

        for (const item of products) {
            // Find product within the session
            const dbProduct = await Product.findById(item.product).session(session);

            if (!dbProduct) {
                throw new Error(`Product ${item.product} not found`);
            }

            if (dbProduct.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${dbProduct.name}`);
            }

            const itemPrice = dbProduct.price - (dbProduct.discount || 0);
            totalPrice += itemPrice * item.quantity;

            processedProducts.push({
                product: dbProduct._id,
                quantity: item.quantity
            });

            // Update stock within the session
            dbProduct.stock -= item.quantity;
            await dbProduct.save({ session });
        }

        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Create order within the session
        const order = await Order.create([{
            orderNumber,
            customerName,
            email,
            user: req.user.id,
            products: processedProducts,
            totalPrice,
            address,
            status: 'pending'
        }], { session });

        // 2. Commit the Transaction (Everything was successful!)
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ success: true, data: order[0] });

    } catch (error) {
        // 3. Abort the Transaction (Something failed, undo all changes!)
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({
            success: false,
            message: error.message || "Transaction failed. No data was changed."
        });
    }
};

// @desc    Get all orders (Admin view)
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('products.product', 'name price images')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single order by ID or Order Number
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('products.product', 'name price images');

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        if (!orders) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};