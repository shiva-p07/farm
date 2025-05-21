// Simple script to create an admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

async function main() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Get the User model
    const User = require('./models/user.model');
    
    // Define admin user
    const email = 'tharun@gmail.com';
    const password = 'Tharun@123';
    const name = 'Tharun Admin';
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`User ${email} already exists. Updating to admin role...`);
      existingUser.role = 'admin';
      await existingUser.save();
      console.log('User updated to admin role successfully');
    } else {
      // Create new user with admin role
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        isVerified: true
      });
      
      await newUser.save();
      console.log('Admin user created successfully!');
    }
    
    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 