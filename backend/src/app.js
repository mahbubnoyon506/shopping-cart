require('dotenv').config();
const express = require("express")
const app = express()
const cors = require('cors');
const authRoutes = require('./routes/authRoute');
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const blogRoutes = require('./routes/blogRoutes')
const brandRoutes = require('./routes/brandRoutes')
// const paymentsRoutes = require('./routes/paymentRoutes')
const connectDB = require('./config/db');

const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
connectDB();

//Routes
// app.use('/api/payments/webhook', express.raw({ type: '*/*' }));
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/brands', brandRoutes);
// app.use('/api/payments', paymentsRoutes);

//Health check
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Backend API is running...'
    })
})

//Global 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' })
})

//Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    })
})

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});