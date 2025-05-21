const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise} Mongoose connection
 */
const connectDB = async () => {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGO_URI) {
      console.warn('MONGO_URI environment variable is not set');
      throw new Error('MongoDB connection URI is not defined');
    }

    // Set mongoose options
    const options = {
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      autoIndex: process.env.NODE_ENV !== 'production', // Don't build indexes in production
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    
    // Don't crash the application immediately, allow graceful handling
    // by returning a rejected promise
    return Promise.reject(error);
  }
};

module.exports = connectDB; 