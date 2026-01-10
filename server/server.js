const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Initialize Stripe after environment variables are loaded
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? null : ['http://localhost:3000', 'http://127.0.0.1:3000'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * DATABASE CONNECTION
 * Mongoose v9 automatically handles URL parsing and topology.
 * No additional options are needed in the connect() call.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leaflink';
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Drop the problematic username index if it exists
    try {
      await conn.connection.db.collection('users').dropIndex('username_1').catch(() => {});
    } catch (err) {
      // Index might not exist, which is fine
    }
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Import routes
const authRoutes = require('./routes/auth');
const plantRoutes = require('./routes/plantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

/**
 * ROUTES
 */
// 1. Health Check Route (Verify server status)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is running correctly' });
});

// 2. Auth Routes
app.use('/api/auth', authRoutes);

// 3. Plant Routes
app.use('/api/plants', plantRoutes);

// 4. Order Routes
app.use('/api/orders', orderRoutes);

// 5. Cart Routes
app.use('/api/cart', cartRoutes);

// 6. Admin Routes
app.use('/api/admin', adminRoutes);

// 7. Payment Routes
app.use('/api/payment', paymentRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

 app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000; // Standardize to 5000 if not set

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer().catch(error => {
  console.error('💥 Fatal error starting server:', error);
});
