const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');

const generateInvoiceNumber = () => `INV-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

exports.createCheckout = async (req, res) => {
    const { items, metadata } = req.body;
    try {
        const line_items = items.map((item) => ({
            price_data: {
                currency: "usd",
                unit_amount: Math.round(item.product.price * 100),
                product_data: {
                    name: item.product.name,
                    images: item.product.images?.length > 0 ? [item.product.images[0].url] : [],
                    metadata: {
                        id: item.product._id.toString(),
                        discount: item.product.discount?.toString() || '0'
                    }
                },
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            metadata: {
                orderNumber: metadata.orderNumber,
                userId: req.user.id,
                customerEmail: metadata.customerEmail,
                address: JSON.stringify(metadata.address),
            },
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.stripeWebhook = async (req, res) => {
    // console.log("API triggered....");
    const sig = req.headers['stripe-signature'];
    let event;

    // console.log("Webhook received, event type:", req.body.type || "unknown");
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        // console.log("Event verified:", event.type);
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // console.log("Full event object:", JSON.stringify(event, null, 2));

    if (event.type === 'checkout.session.completed') {
        // console.log("Processing checkout.session.completed event");
        const session = event.data.object;
        // console.log("Session ID:", session.id);
        // console.log("Session metadata:", session.metadata);

        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
            session.id,
            { expand: ['line_items.data.price.product'] }
        );
        console.log("Session with line items retrieved");
        console.log("Line items data:", JSON.stringify(sessionWithLineItems.line_items.data, null, 2));

        try {
            // Check if order already exists for this session
            const existingOrder = await Order.findOne({ stripeCheckoutSessionId: session.id });
            if (existingOrder) {
                console.log("Order already exists for session:", session.id);
                return res.json({ received: true, message: 'Order already processed' });
            }

            const lineItems = sessionWithLineItems.line_items.data;
            const productIds = lineItems
                .map((item) => {
                    const expandedProduct = item.price.product && typeof item.price.product === 'object'
                        ? item.price.product
                        : null;
                    return expandedProduct?.metadata?.id || item.price.metadata?.id;
                })
                .filter(Boolean);

            const productsFromDb = await Product.find({ _id: { $in: productIds } }).lean();
            const productMap = new Map(productsFromDb.map((product) => [product._id.toString(), product]));

            const products = lineItems.map((item) => {
                console.log("Processing item:", JSON.stringify(item, null, 2));
                const expandedProduct = item.price.product && typeof item.price.product === 'object'
                    ? item.price.product
                    : null;
                const productId = expandedProduct?.metadata?.id || item.price.metadata?.id || null;
                const dbProduct = productId ? productMap.get(productId) : null;
                const unitAmount = item.price?.unit_amount || 0;

                return {
                    product: productId,
                    name: dbProduct?.name || item.description || expandedProduct?.name || 'Unknown Product',
                    image: dbProduct?.images?.[0]?.url || expandedProduct?.images?.[0] || '',
                    price: dbProduct?.price ?? Math.round(unitAmount / 100),
                    discount: dbProduct?.discount ?? Number(expandedProduct?.metadata?.discount || 0),
                    quantity: item.quantity || 1,
                };
            });

            const orderData = {
                orderNumber: session.metadata.orderNumber,
                invoiceNumber: generateInvoiceNumber(),
                stripeCheckoutSessionId: session.id,
                user: session.metadata.userId,
                customerName: session.customer_details.name,
                email: session.metadata.customerEmail,
                totalPrice: session.amount_total / 100,
                currency: session.currency,
                status: "paid",
                address: JSON.parse(session.metadata.address),
                products,
            };
            console.log("Order data to create:", JSON.stringify(orderData, null, 2));

            const newOrder = await Order.create(orderData);
            console.log("Order created successfully with ID:", newOrder._id);
        } catch (error) {
            console.error("Error creating order:", error);
            console.error("Error stack:", error.stack);
            return res.status(500).json({ error: 'Failed to create order' });
        }
    } else if (event.type === 'charge.updated') {
        console.log("Received charge.updated event - this is not the event we create orders for");
        console.log("Charge data:", JSON.stringify(event.data.object, null, 2));
    }

    res.json({ received: true });
};