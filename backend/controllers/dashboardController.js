const Product = require('../models/Product');
const CustomOrder = require('../models/CustomOrder');
const Lead = require('../models/Lead');
const Review = require('../models/Review');
const Blog = require('../models/Blog');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await CustomOrder.countDocuments();
    const totalLeads = await Lead.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalBlogs = await Blog.countDocuments();

    const pendingOrders = await CustomOrder.countDocuments({ status: 'Pending' });
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const approvedReviews = await Review.countDocuments({ approved: true });

    const recentOrders = await CustomOrder.find().sort({ createdAt: -1 }).limit(5);
    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalLeads,
        totalReviews,
        totalBlogs,
        pendingOrders,
        newLeads,
        approvedReviews
      },
      recentOrders,
      recentLeads
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
