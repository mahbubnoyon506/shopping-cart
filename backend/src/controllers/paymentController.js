// require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create Stripe Checkout Session
exports.createCheckout = async (req, res) => {
    const { items, metadata } = req.body;

    try {
        const line_items = items.map((item) => ({
            price_data: {
                currency: "usd",
                unit_amount: Math.round(item.product.price * 100),
                product_data: {
                    name: item.product.name,
                    images: item.product.images?.length > 0 ? [item.product.images[0]] : [],
                    metadata: { id: item.product._id.toString() }
                },
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            // Pass metadata to retrieve it in the webhook later
            metadata: {
                orderNumber: metadata.orderNumber,
                userId: req.user.id, // From your auth middleware
                customerEmail: metadata.customerEmail,
                address: JSON.stringify(metadata.address)
            },
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Stripe Webhook (Verify and Save Order)
exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Retrieve the full session to get line items
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
            session.id, { expand: ['line_items'] }
        );

        // Save the order to MongoDB
        await Order.create({
            orderNumber: session.metadata.orderNumber,
            stripeCheckoutSessionId: session.id,
            clerkUserId: session.metadata.userId,
            customerName: session.customer_details.name,
            email: session.metadata.customerEmail,
            totalPrice: session.amount_total / 100,
            currency: session.currency,
            status: "paid",
            address: JSON.parse(session.metadata.address),
            products: sessionWithLineItems.line_items.data.map(item => ({
                product: item.price.product.metadata.id, // We stored ID in metadata earlier
                quantity: item.quantity
            }))
        });

        // Optional: Reduce stock in Product model here
    }

    res.json({ received: true });
};