const mongoose = require('mongoose');
// require('dotenv').config();

const connectMongo = async () => {
    try {
        const mongoURI = process.env.DATABASE_URL;
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        if (error.message.includes('ECONNREFUSED')) {
            console.error('Hint: Is your MongoDB service running?');
        }
        process.exit(1);
    }
};

module.exports = connectMongo;