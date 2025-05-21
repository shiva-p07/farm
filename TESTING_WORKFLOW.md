# Farmer Rice Application Testing Workflow

This document provides a comprehensive testing workflow for the Farmer Rice application, guiding you through each user role and their respective features. Follow these steps to explore the complete functionality of the application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Authentication Testing](#authentication-testing)
3. [Customer Workflow](#customer-workflow)
4. [Farmer Workflow](#farmer-workflow) 
5. [Admin Workflow](#admin-workflow)
6. [Staff Workflow](#staff-workflow)
7. [Cross-Role Interactions](#cross-role-interactions)

## Prerequisites

Before beginning testing, ensure you have:

1. Access to both frontend and backend repositories
2. MongoDB connection is properly configured in `server/config.env`
3. Backend server running on port 5015
4. Frontend application running on port 3000
5. Test accounts for each user role

## Authentication Testing

### 1. Registration Process
1. Navigate to the homepage at `http://localhost:3000`
2. Click on "Register" button
3. Test registering as different user types:
   - Register as a Customer (regular user)
   - Register as a Farmer (requires admin approval)
   - Note: Admin accounts can only be created by existing admins

4. Verify validation works for:
   - Required fields
   - Password strength requirements
   - Email format validation

5. Verify email verification process:
   - Check if verification email is sent (check terminal logs in development)
   - Verify the verification link works correctly

### 2. Login Process
1. Navigate to the login page
2. Test login with:
   - Valid credentials for each user type
   - Invalid credentials to verify error handling
   - Locked accounts
3. Test "Forgot Password" functionality:
   - Request password reset
   - Verify reset email delivery
   - Complete the password reset process

## Customer Workflow

### 1. Browse and Search Products
1. Navigate to the Shop/Products page
2. Test the search functionality with different keywords
3. Apply various filters:
   - By rice variety
   - By price range
   - By quality parameters
   - By farmer ratings
4. Sort products by:
   - Price (low to high)
   - Price (high to low)
   - Rating
   - Newest

### 2. Product Interaction
1. Click on a product to view detailed information
2. Verify product details displayed:
   - Images
   - Description
   - Price and availability
   - Quality parameters
   - Farmer information
3. Read and scroll through product reviews
4. Test the "Add to Cart" functionality with different quantities

### 3. Shopping Cart Management
1. Add multiple products to cart
2. Navigate to cart page
3. Test cart functionality:
   - Update product quantities
   - Remove products
   - Clear entire cart
4. Verify cart calculations:
   - Individual product subtotals
   - Cart total
   - Applicable taxes or discounts

### 4. Checkout Process
1. Proceed to checkout from cart page
2. Enter or select shipping address
3. Choose delivery options if available
4. Enter billing details
5. Select payment method (Razorpay)
6. Complete test payment
7. Verify order confirmation page and email

### 5. Order Management
1. Navigate to "My Orders" section
2. View list of all orders with status
3. Click on an order to view details:
   - Order items
   - Shipping information
   - Payment details
   - Order status
4. Test order cancellation (if applicable)
5. Test order tracking functionality

### 6. Profile Management
1. Navigate to profile settings
2. Update personal information:
   - Name and contact details
   - Profile picture
   - Address information
3. Update password
4. Manage notification preferences

## Farmer Workflow

### 1. Dashboard Overview
1. Login as a farmer
2. Explore the farmer dashboard:
   - Sales metrics
   - Active orders
   - Inventory status
   - Payment summaries

### 2. Product Management
1. Navigate to "My Products" section
2. Add a new rice product:
   - Enter basic details (name, description, price)
   - Add quality parameters (grade, moisture, etc.)
   - Upload product images
   - Set inventory levels
3. Edit an existing product
4. Remove a product from listing
5. Update product inventory levels

### 3. Inventory Management
1. Navigate to Inventory section
2. View current stock levels
3. Update available quantities
4. Mark products as out of stock if needed

### 4. Sales History
1. View complete sales history
2. Filter sales by:
   - Date range
   - Product
   - Order status
3. View detailed breakdown of each sale
4. Export sales data (if available)

### 5. Payment Management
1. View pending payments
2. Check payment history
3. Verify payment calculations
4. Download payment statements

### 6. Communication
1. Check notifications
2. Use messaging system to contact admin
3. Respond to customer inquiries about products

## Admin Workflow

### 1. Dashboard Overview
1. Login as an admin
2. Explore admin dashboard with key metrics:
   - Total sales
   - New users
   - Pending approvals
   - Inventory status
   - Revenue graphs

### 2. User Management
1. Navigate to User Management section
2. Review list of all users
3. Test user management features:
   - View user details
   - Edit user information
   - Change user status (active/inactive)
   - Delete user accounts
4. Process farmer approval requests:
   - Review pending farmer applications
   - Approve or reject applications
   - Provide feedback for rejections
5. Create staff accounts

### 3. Product & Inventory Management
1. Review all products in the system
2. Edit or remove products if necessary
3. Monitor inventory levels
4. Purchase rice from farmers to central inventory
5. Set up low stock alerts
6. View inventory history and transactions

### 4. Order Management
1. View all customer orders
2. Process orders:
   - Update order status
   - Assign orders to staff
   - Handle special requests
3. Manage order issues and cancellations
4. Generate order reports

### 5. Payment Processing
1. View all payment transactions
2. Process refunds when necessary
3. Manage farmer payments
4. Generate financial reports
5. Reconcile payments

### 6. Announcement System
1. Create system-wide announcements
2. Target announcements to specific user groups
3. Schedule announcement publication
4. View announcement metrics

## Staff Workflow

### 1. Dashboard Access
1. Login as staff member
2. Explore staff dashboard with assigned tasks and metrics

### 2. Task Management
1. View assigned tasks
2. Update task status
3. Add comments to tasks
4. Complete assigned tasks

### 3. Order Processing
1. View assigned orders
2. Update order statuses
3. Coordinate with delivery system
4. Resolve order issues

### 4. Inventory Assistance
1. Monitor inventory levels
2. Update stock information
3. Process inventory transactions
4. Generate inventory reports

### 5. Customer Support
1. Respond to customer inquiries
2. Handle order-related questions
3. Escalate issues to admin when needed

## Cross-Role Interactions

### 1. Communication Testing
1. Test messaging between:
   - Customer to Admin
   - Farmer to Admin
   - Admin to All Users
2. Verify notification delivery for all user types

### 2. Order Lifecycle Testing
1. Complete full order lifecycle:
   - Customer places order
   - Admin/Staff processes order
   - Inventory updated
   - Farmer notified of sale
   - Order delivery tracked
   - Customer leaves review

### 3. Payment Flow Testing
1. Test complete payment cycle:
   - Customer makes payment
   - Order status updated
   - Farmer account credited
   - Admin can view complete transaction

## Final Verification

1. Ensure all user types can successfully:
   - Login and logout
   - Update profiles
   - Navigate all permitted sections
   - Perform role-specific actions

2. Verify system handles edge cases:
   - Out-of-stock products
   - Failed payments
   - Incorrect shipping details
   - Account issues

3. Test responsiveness on:
   - Desktop browsers
   - Tablet devices
   - Mobile phones

Follow this workflow to thoroughly test every aspect of the Farmer Rice application. The sequence is designed to test features in a logical order while ensuring all functionality across user roles is covered. 