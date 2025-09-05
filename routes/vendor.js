const express = require("express");
const Vendor = require("../models/vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const vendorRouter = express.Router();

// Create a new vendor
vendorRouter.post('/vendor/register', async (req, res) => {
  try {
    const { fullName, email, state, city, locality, password } = req.body;

   const existingEmail = await Vendor.findOne({ email });
   if (existingEmail) {
     return res.status(400).json({ message: 'Vendor already exists' });
   }
   
   // Hash the password before saving
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt);

   const newVendor = new Vendor({
     fullName,
     email,
     state,
     city,
     locality,
     role: "vendor", // Default role for vendor
     password: hashedPassword
   });

   await newVendor.save();
   res.status(201).json({ message: 'Vendor registered successfully!' });
  } catch (error) {
    console.error('Error registering vendor:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: errors 
      });
    }
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already exists' 
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});


vendorRouter.post('/vendor/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find vendor by email
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token (using a more secure secret in production)
    const jwtSecret = process.env.JWT_SECRET || 'multistore_vendor_secret_key_2024';
    const token = jwt.sign(
      { 
        vendorId: vendor._id, 
        email: vendor.email,
        role: vendor.role 
      }, 
      jwtSecret, 
      { expiresIn: '24h' }
    );

    // Exclude password from response
    const { password: vendorPassword, ...vendorWithoutPassword } = vendor._doc;
    
    res.status(200).json({ 
      message: 'Login successful!', 
      token, 
      vendor: vendorWithoutPassword 
    });

  } catch (error) {
    console.error('Error logging in vendor:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

module.exports = vendorRouter;