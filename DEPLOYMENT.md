# Farmer Rice Application Deployment Guide

This document provides comprehensive instructions for deploying the Farmer Rice application in production, staging, and development environments.

## Prerequisites

- Node.js 16.x or later
- MongoDB 5.x or later
- Git
- Docker and Docker Compose (optional, for containerized deployment)
- Netlify account (for frontend hosting)
- Render/Railway account (for backend hosting)
- GitHub account (for CI/CD)
- Domain name (optional)

## Environment Variables

### Backend Environment Variables

Create a `config.env` file in the server directory with the following variables:

```
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@farmerrice.com
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Environment Variables

Create a `.env` file in the client directory with the following variables:

```
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Deployment Options

### Option 1: Manual Deployment

#### Backend Deployment (Render/Railway)

1. Push your code to GitHub
2. Create a new Web Service on Render/Railway:
   - Connect your GitHub repository
   - Set the build command: `cd server && npm install && npm run build`
   - Set the start command: `cd server && node server.js`
   - Set all required environment variables
   - Choose an appropriate instance type
3. Deploy the service

#### Frontend Deployment (Netlify)

1. Push your code to GitHub
2. Create a new site on Netlify:
   - Connect your GitHub repository
   - Set the build command: `cd client && npm install && npm run build`
   - Set the publish directory: `client/build`
   - Set environment variables
   - Configure custom domain (optional)
3. Deploy the site

### Option 2: CI/CD Pipeline Deployment

1. Configure GitHub Actions in your repository using the `.github/workflows/ci-cd.yml` file
2. Add the following secrets to your GitHub repository:
   - `NETLIFY_AUTH_TOKEN`: Your Netlify auth token
   - `NETLIFY_SITE_ID`: Your Netlify site ID
   - `RENDER_DEPLOY_HOOK`: Your Render deploy hook URL (for backend)
3. Push your code to trigger the deployment

### Option 3: Containerized Deployment

#### Local Development with Docker

1. Install Docker and Docker Compose
2. Run: `docker-compose up`
3. Access frontend at http://localhost:3000 and backend at http://localhost:5000

#### Production Deployment with Docker

1. Build server image: `docker build -t farmer-rice-server ./server`
2. Build client image: `docker build -t farmer-rice-client ./client`
3. Deploy images to your cloud provider (AWS, GCP, Azure, etc.)

## Post-Deployment Verification

After deployment, perform the following checks:

1. Verify API connectivity
2. Test user registration and login
3. Verify role-based access control
4. Test order creation and processing
5. Test payment gateway integration
6. Verify email notifications

## Monitoring and Maintenance

1. Set up application monitoring using services like:
   - New Relic
   - Sentry for error tracking
   - Uptime Robot for uptime monitoring
2. Set up database backups
3. Implement a log retention policy
4. Schedule regular security updates

## Troubleshooting

### Common Issues

1. **API Connection Error**:
   - Check API URL configuration
   - Verify CORS settings in backend
   - Check network rules and firewall settings

2. **Database Connection Issues**:
   - Verify MongoDB connection string
   - Check MongoDB Atlas network access settings
   - Verify database user credentials

3. **Payment Gateway Issues**:
   - Verify Razorpay credentials
   - Check webhook configurations
   - Test with test accounts

4. **Email Notification Issues**:
   - Verify SendGrid API key
   - Check email templates
   - Test with your own email

## Rollback Procedure

In case of deployment failure:

1. For Netlify: Roll back to previous deploy from the Netlify dashboard
2. For Render/Railway: Revert to previous deployment from the dashboard
3. For containerized deployment: Roll back to previous image version

## Contacts

For deployment assistance, contact:
- DevOps Team: devops@farmerrice.com
- Technical Support: support@farmerrice.com 