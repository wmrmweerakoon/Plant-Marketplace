const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret');

      // Get user from token and attach to request
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
 }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Authorization middleware to check user role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user found' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role '${req.user.role}' is not authorized to access this route` });
    }
    
    next();
  };
};

module.exports = { protect, authorize };
