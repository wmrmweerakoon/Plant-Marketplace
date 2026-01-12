const User = require('../models/User');
const Plant = require('../models/Plant');
const Order = require('../models/Order');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin role required.' 
      });
    }

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get total listings count
    const totalListings = await Plant.countDocuments();

    // Get total sales (sum of all order amounts)
    const orders = await Order.find({});
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get pending reviews (assuming we have a review system or pending orders)
    // For now, counting orders with "Processing" status as pending
    const pendingReviews = await Order.countDocuments({ orderStatus: 'Processing' });

    // Get recent users (last 5 registered)
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .select('name email role createdAt');

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalListings,
        totalSales: totalSales.toFixed(2),
        pendingReviews,
        recentUsers: recentUsers.map(user => ({
          name: user.name,
          email: user.email,
          role: user.role,
          date: user.createdAt.toISOString().split('T')[0] // Format as YYYY-MM-DD
        }))
      }
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching dashboard statistics' 
    });
  }
};

module.exports = {
  getDashboardStats
};