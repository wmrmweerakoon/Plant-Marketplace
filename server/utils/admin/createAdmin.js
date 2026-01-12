const User = require('../../models/User');
const bcrypt = require('bcryptjs');

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return existingAdmin;
    }

    // Create admin user with default credentials
    const adminData = {
      name: 'Admin User',
      email: 'admin@leaflink.com',
      password: 'admin123', // Default password - should be changed after first login
      role: 'admin'
    };

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create the admin user
    const adminUser = await User.create({
      ...adminData,
      password: hashedPassword
    });

    console.log('Admin user created successfully!');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password, '(CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN)');
    
    return adminUser;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

// If this script is run directly, execute the function
if (require.main === module) {
  const mongoose = require('mongoose');
  const dotenv = require('dotenv');
  
  dotenv.config();
  
  const connectDB = async () => {
    try {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leaflink';
      await mongoose.connect(mongoURI);
      console.log('MongoDB connected for admin creation');
      
      await createAdminUser();
      
      await mongoose.disconnect();
      console.log('MongoDB disconnected');
    } catch (error) {
      console.error('Database connection error:', error);
      process.exit(1);
    }
  };
  
  connectDB();
}

module.exports = createAdminUser;
