const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Important Security: Ensure that if a user sends role: 'admin', the server forces it to buyer or seller
    let userRole = 'buyer'; // Default role
    if (role === 'seller') {
      userRole = 'seller';
    }
    // Note: Explicitly NOT allowing role to be set to 'admin' during registration

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole
    });

    console.log(`New user created: ${user.email}, Password field exists: ${!!user.password}, Role: ${user.role}`);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_jwt_secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'buyer' // Default to buyer if role is not defined
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user - explicitly select the password field (which is normally hidden)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(`User found: ${user.email}, Password field exists: ${!!user.password}, Role: ${user.role}`);

    // Check if password exists
    if (!user.password) {
      console.log(`Password field is empty for user: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match result: ${isMatch} for user: ${email}`);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    try {
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'fallback_jwt_secret',
        { expiresIn: '30d' }
      );

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'buyer' // Default to buyer if role is not defined
        }
      });
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      res.status(500).json({ message: 'Token generation failed' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error getting profile' });
  }
});

module.exports = router;