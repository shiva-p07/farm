# Farmer Rice - Technical Documentation

## Architecture Overview

Farmer Rice is a MERN stack application with the following components:

1. **Frontend**: React.js with Redux for state management
2. **Backend**: Express.js REST API
3. **Database**: MongoDB with Mongoose ODM
4. **Authentication**: JWT-based authentication
5. **Payment**: Razorpay integration
6. **Email**: SendGrid for transactional emails
7. **File Storage**: Cloudinary for image uploads

### System Architecture Diagram

```
┌─────────────┐    HTTP    ┌─────────────┐    Mongoose   ┌─────────────┐
│   React.js  │ ─────────> │  Express.js │ ────────────> │   MongoDB   │
│   Frontend  │ <───────── │   Backend   │ <───────────  │  Database   │
└─────────────┘            └─────────────┘               └─────────────┘
       │                         │  │                           
       │                         │  │                           
       │                  ┌──────┘  └───────┐                   
       │                  │               │                   
       │             ┌────▼─────┐    ┌────▼─────┐            
       └───────────> │ Razorpay │    │ SendGrid │            
                     │ Payments │    │  Emails  │            
                     └──────────┘    └──────────┘            
```

## Backend API Documentation

### Authentication Endpoints

- **POST /api/auth/register** - User registration
- **POST /api/auth/login** - User login
- **POST /api/auth/refresh-token** - Refresh access token
- **POST /api/auth/forgot-password** - Password reset request
- **PUT /api/auth/reset-password** - Reset password with token
- **GET /api/auth/me** - Get current user

### User Endpoints

- **GET /api/users** - Get all users (admin)
- **GET /api/users/:id** - Get user by ID
- **PUT /api/users/:id** - Update user
- **DELETE /api/users/:id** - Delete user
- **GET /api/users/farmers** - Get all farmers (admin)
- **GET /api/users/staff** - Get all staff (admin)
- **PUT /api/users/:id/status** - Update user status (approve/block)

### Product Endpoints

- **GET /api/products** - Get all products
- **GET /api/products/:id** - Get product by ID
- **POST /api/products** - Create product (farmer)
- **PUT /api/products/:id** - Update product (farmer/admin)
- **DELETE /api/products/:id** - Delete product (admin)
- **GET /api/products/farmer/:farmerId** - Get products by farmer

### Order Endpoints

- **GET /api/orders** - Get all orders (admin/staff)
- **GET /api/orders/:id** - Get order by ID
- **POST /api/orders** - Create order (customer)
- **PUT /api/orders/:id/status** - Update order status
- **GET /api/orders/customer/:customerId** - Get orders by customer
- **GET /api/orders/metrics** - Get order metrics (admin)

### Payment Endpoints

- **POST /api/payments/razorpay/create** - Create Razorpay order
- **POST /api/payments/razorpay/verify** - Verify Razorpay payment
- **GET /api/payments** - Get all payments (admin)
- **GET /api/payments/:id** - Get payment by ID
- **GET /api/payments/my-payments** - Get user's payments
- **POST /api/payments/:id/refund** - Process refund (admin)
- **POST /api/payments/:id/invoice** - Generate invoice
- **GET /api/payments/analytics** - Get payment analytics (admin)

### Notification Endpoints

- **GET /api/notifications** - Get user's notifications
- **PUT /api/notifications/:id/read** - Mark notification as read
- **PUT /api/notifications/read-all** - Mark all notifications as read
- **DELETE /api/notifications/:id** - Delete notification

### Announcement Endpoints

- **GET /api/announcements** - Get all announcements
- **POST /api/announcements** - Create new announcement (admin)
- **DELETE /api/announcements/:id** - Delete announcement (admin)
- **POST /api/announcements/:id/resend** - Resend announcement (admin)

## Database Schema

### User Schema
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String, // customer, farmer, staff, admin
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  phone: String,
  isVerified: Boolean,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  images: [String],
  category: String,
  farmer: ObjectId, // Reference to User
  stockQuantity: Number,
  quality: {
    grade: String,
    moisture: Number,
    broken: Number
  },
  createdAt: Date
}
```

### Order Schema
```javascript
{
  user: ObjectId, // Reference to User
  items: [{
    product: ObjectId, // Reference to Product
    name: String,
    quantity: Number,
    price: Number,
    image: String
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  paymentMethod: String,
  paymentResult: {
    id: String,
    status: String,
    updateTime: String,
    emailAddress: String
  },
  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  isPaid: Boolean,
  paidAt: Date,
  status: String, // Pending, Processing, Shipped, Delivered, Cancelled
  isDelivered: Boolean,
  deliveredAt: Date,
  trackingNumber: String,
  courierProvider: String,
  createdAt: Date
}
```

### Notification Schema
```javascript
{
  user: ObjectId, // Reference to User
  title: String,
  message: String,
  type: String, // order, payment, inventory, etc.
  isRead: Boolean,
  link: String,
  createdAt: Date
}
```

## Frontend Architecture

### State Management with Redux

The frontend uses Redux with Redux Toolkit for state management:

- **Store**: Centralized application state
- **Slices**: Feature-based state and logic organization
- **Thunks**: Async actions for API calls
- **Selectors**: Efficient state access

### Component Hierarchy

```
App
├── Layouts
│   ├── MainLayout (Public pages)
│   └── DashboardLayout (Protected pages)
├── Pages
│   ├── Public Pages
│   │   ├── HomePage
│   │   ├── LoginPage
│   │   └── RegisterPage
│   ├── Customer Pages
│   │   ├── CustomerDashboard
│   │   ├── ShopPage
│   │   ├── CartPage
│   │   └── OrdersPage
│   ├── Farmer Pages
│   │   ├── FarmerDashboard
│   │   ├── ProductsListPage
│   │   └── SalesHistoryPage
│   └── Admin Pages
│       ├── AdminDashboard
│       ├── UsersPage
│       └── OrderManagementPage
└── Components
    ├── Common
    │   ├── Header
    │   ├── Footer
    │   └── NotificationPanel
    ├── Forms
    │   ├── LoginForm
    │   └── RegisterForm
    └── UI
        ├── Button
        ├── Card
        └── Table
```

## Authentication Flow

1. User registration:
   - User submits registration form
   - Server validates and creates user
   - JWT token generated and returned

2. User login:
   - User submits login credentials
   - Server validates and authenticates
   - JWT token generated and returned
   - Token stored in local storage
   - User redirected to role-specific dashboard

3. Protected routes:
   - JWT token verified for protected routes
   - Role-based access control implemented
   - Unauthorized users redirected to login

## Payment Integration

The application uses Razorpay for payment processing:

1. Order creation
2. Razorpay order initialization
3. Payment processing using Razorpay checkout
4. Server-side payment verification
5. Order status update
6. Invoice generation

## Notification System

The application has a comprehensive notification system:

1. In-app notifications stored in database
2. Real-time notification updates
3. Email notifications via SendGrid
4. Push notifications (future implementation)

## Deployment Strategy

The application follows a CI/CD deployment approach:

1. GitHub Actions for CI/CD pipeline
2. Automated testing before deployment
3. Frontend deployed to Netlify
4. Backend deployed to Render/Railway
5. Docker containers for consistent environments

## Security Measures

1. JWT-based authentication
2. Password hashing with bcrypt
3. Input validation and sanitization
4. CORS configuration
5. Helmet for HTTP security headers
6. Rate limiting to prevent abuse
7. Environment variable protection

## Performance Optimizations

1. Frontend:
   - Code splitting and lazy loading
   - Memoization of expensive computations
   - Asset optimization and caching
   - Service worker for caching

2. Backend:
   - Database indexing for frequent queries
   - Query optimization
   - Response caching
   - Compression middleware

## Monitoring and Logging

1. Error tracking with logging systems
2. Performance monitoring
3. API request logging
4. Database query logging
5. User activity auditing

## Maintenance Procedures

1. Regular database backups
2. Security updates
3. Dependency updates
4. Performance monitoring
5. Bug tracking and resolution

## Known Limitations and Future Improvements

1. Implement real-time updates with WebSockets
2. Add mobile app with React Native
3. Implement advanced analytics dashboard
4. Add multi-language support
5. Implement inventory forecasting 