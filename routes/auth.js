const express = require('express');
const bcrypt = require('bcryptjs'); // Importing bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken for token generation
const User = require('../models/user'); // Importing the User model
const Authrouter = express.Router();


Authrouter.post('/register', async (req, res) => {
  try {
    const { fullName, email, state, city, locality, password } = req.body;

   const existingEmail = await User.findOne({ email });
   if (existingEmail) {
     return res.status(400).json({ message: 'Email already exists' });
   }

   // Hash the password before saving
   const hashedPassword = await bcrypt.hash(password, 10);

   const newUser = new User({
     fullName,
     email,
     state,
     city,
     locality,
     password: hashedPassword
   });

   await newUser.save();
   res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

Authrouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    // Exclude the password from the user object before sending it in the response
    const { password: userPassword, ...userWithoutPassword } = user._doc;
    res.status(200).json({ 
      message: 'Login successful!', 
      token, 
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//put route for updating users state,city and locality

Authrouter.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { state, city, locality } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { state, city, locality },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = Authrouter;