const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/error.middleware');
const fs = require('fs');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const paymentRoutes = require('./routes/payment.routes');
const reviewRoutes = require('./routes/review.routes');
const saleRoutes = require('./routes/sale.routes');
const messageRoutes = require('./routes/message.routes');
const taskRoutes = require('./routes/task.routes');
const reportRoutes = require('./routes/report.routes');
const notificationRoutes = require('./routes/notification.routes');
const deliveryRoutes = require('./routes/delivery.routes');
const announcementRoutes = require('./routes/announcement.routes');
const uploadRoutes = require('./routes/upload.routes');

// Initialize express
const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }
})); // Set security HTTP headers with exceptions for image serving
app.use(xss()); // Prevent XSS attacks
app.use(mongoSanitize()); // Sanitize data against NoSQL query injection
app.use(hpp()); // Prevent HTTP param pollution

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // More lenient for development
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter); // Apply rate limiting to all API routes

// Enable CORS for the API - more permissive for development
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  credentials: true, // Allow cookies to be sent with requests
  exposedHeaders: ['Content-Disposition'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Special CORS middleware for uploads specifically
const uploadCorsMiddleware = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Timing-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  next();
};

// Ensure upload directories exist
const ensureUploadDirectories = () => {
  const uploadDirs = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads/products'),
    path.join(__dirname, 'uploads/users')
  ];
  
  uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created upload directory: ${dir}`);
      } catch (error) {
        console.error(`Failed to create upload directory ${dir}:`, error);
      }
    }
  });
};

// Create required upload directories on app start
ensureUploadDirectories();

// Debug middleware to log static file requests
const staticFileDebugMiddleware = (req, res, next) => {
  console.log(`Static file request: ${req.path}`);
  next();
};

// Serve static uploads with proper cache control and CORS headers
app.use('/uploads', uploadCorsMiddleware, staticFileDebugMiddleware, express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d', // Cache for 1 day
  etag: true, // Enable ETag for caching
  lastModified: true, // Enable Last-Modified for caching
  fallthrough: true // Fall through to next middleware if file not found
}));

// Serve static public files (like default profile images)
app.use('/public', express.static(path.join(__dirname, 'public'), {
  maxAge: '1d', // Cache for 1 day
  etag: true, // Enable ETag for caching
  lastModified: true, // Enable Last-Modified for caching
  fallthrough: true // Fall through to next middleware if file not found
}));

// Explicitly log the static files directory path
console.log('Serving static files from:', path.join(__dirname, 'uploads'));

// Request logging
app.use(logger.logApiRequest);

// HTTP logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Use a more concise format for production
  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400, // Only log errors in production
    stream: {
      write: message => logger.info(message.trim())
    }
  }));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/upload', uploadRoutes);

// Log all registered routes
console.log('Registered API routes:');
console.log('- /api/auth');
console.log('- /api/users');
console.log('- /api/products');
console.log('- /api/orders');
console.log('- /api/inventory');
console.log('- /api/payments');
console.log('- /api/reviews');
console.log('- /api/sales');
console.log('- /api/messages');
console.log('- /api/tasks');
console.log('- /api/reports');
console.log('- /api/notifications');
console.log('- /api/deliveries');
console.log('- /api/announcements');
console.log('- /api/upload');

// Log all upload route details
console.log('Upload route registration:');
console.log('- POST /api/upload/product-images -> controllers/upload.controller.js -> uploadProductImages');
console.log('- GET /api/upload/proxy/:type/:filename -> controllers/upload.controller.js -> serveImageProxy');

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) return next();
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler - should be placed after all routes
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Error handling middleware
app.use(errorHandler);

module.exports = app; 