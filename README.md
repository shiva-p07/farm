# FarmeRice 🌾

A comprehensive agricultural e-commerce platform connecting farmers and customers for rice trading.

## 🌟 Features

### For Customers
- Browse and purchase high-quality rice products
- Real-time order tracking
- Secure payment processing
- Order history and management
- Profile management
- Rating and review system

### For Farmers
- Product listing and management
- Inventory tracking
- Order fulfillment
- Sales analytics
- Profile and store management

### For Administrators
- User management
- Product approval
- Order oversight
- Analytics dashboard
- Announcement system
- System monitoring

## 🚀 Tech Stack

- **Frontend**: React.js with Redux
- **Backend**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Payment Processing**: Razorpay
- **Email Service**: SendGrid

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker (optional)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/farmerice.git
   cd farmerice
   ```

2. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp config.env.example config.env
   
   # Edit the config.env file with your credentials
   ```

3. **Install Dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   ```

4. **Database Setup**
   ```bash
   # Create admin user
   node create-admin.js
   ```

5. **Start the Application**
   ```bash
   # Using npm
   npm run start
   
   # Using Docker
   docker-compose up
   ```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

## 🔑 Environment Variables

Create a `config.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
SENDGRID_API_KEY=your_sendgrid_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## 📚 API Documentation

Detailed API documentation can be found in `DOCUMENTATION.md`

## 🧪 Testing

```bash
# Run backend tests
npm run test

# Run frontend tests
cd client
npm run test
```

For detailed testing information, refer to `TESTING_WORKFLOW.md`

## 📦 Deployment

For deployment instructions, please refer to `DEPLOYMENT.md`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- All the farmers and customers who provided valuable feedback
- The open-source community
- Contributors and testers
