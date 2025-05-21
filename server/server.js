const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const logger = require('./utils/logger');

// Load environment variables - first try config.env
try {
  const configPath = path.join(__dirname, 'config.env');
  dotenv.config({ path: configPath });
  logger.info(`Config loaded from ${configPath}`);
} catch (error) {
  logger.warn('Config file not found, using environment variables');
}

const app = require('./app');

// Force port to be 3001
const PORT = 3001;
console.log("FORCED PORT:", PORT);
let server;

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI && process.env.MONGODB_URI) {
      process.env.MONGO_URI = process.env.MONGODB_URI;
      logger.info('Using MONGODB_URI instead of MONGO_URI');
    }

    if (!process.env.MONGO_URI) {
      logger.warn('MongoDB URI not found. Server will start without database connection.');
      return null;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: process.env.NODE_ENV !== 'production'
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    logger.warn('Server will start without database connection.');
    return null;
  }
};

// Start server
const startServer = async () => {
  try {
    // Connect to database (but don't fail if connection fails)
    await connectDB();

    // Start the server
    server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error(`Unhandled Rejection: ${err.message}`);
      logger.error(err.stack);
      
      // Close server & exit process
      if (server) {
        server.close(() => process.exit(1));
      } else {
        process.exit(1);
      }
    });
  } catch (error) {
    logger.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  }
};

// Handle graceful shutdown
const shutdownGracefully = async (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
      
      // Close MongoDB connection
      mongoose.connection.close(false, () => {
        logger.info('MongoDB connection closed');
        process.exit(0);
      });
      
      // Force exit after 3 seconds if connections don't close
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 3000);
    });
  } else {
    process.exit(0);
  }
};

// Process termination handlers
process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
process.on('SIGINT', () => shutdownGracefully('SIGINT'));

// Initialize server
startServer(); 