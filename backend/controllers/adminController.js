const User = require('../models/User');
const Business = require('../models/Business');
const Sale = require('../models/Sale');

exports.getPlatformStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const businessCount = await Business.countDocuments();
    
    // Aggregate total platform revenue and total sales
    const salesAggregation = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalSales: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      users: userCount,
      stores: businessCount,
      total_sales: salesAggregation.length > 0 ? salesAggregation[0].totalSales : 0,
      total_revenue: salesAggregation.length > 0 ? salesAggregation[0].totalRevenue : 0
    };

    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
