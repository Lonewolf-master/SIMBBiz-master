const User = require('../models/User');
const Business = require('../models/Business');
const Sale = require('../models/Sale');
const SubscriptionPayment = require('../models/SubscriptionPayment');

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

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    user.role = req.body.role;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().populate('owner_id', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: businesses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subs = await SubscriptionPayment.find().populate('business_id', 'name slug').sort({ createdAt: -1 });
    res.json({ success: true, data: subs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateSubscriptionStatus = async (req, res) => {
  try {
    const sub = await SubscriptionPayment.findById(req.params.id);
    if (!sub) return res.status(404).json({ success: false, error: 'Payment not found' });
    
    // Map status from frontend to backend payment_status
    sub.payment_status = req.body.status === 'successful' ? 'completed' : req.body.status;
    await sub.save();
    
    // If marking as successful manually, we should ideally allocate the slots
    if (sub.payment_status === 'completed') {
      const business = await Business.findById(sub.business_id);
      if (business) {
        business.item_slots_available += sub.slots_added || 0;
        await business.save();
      }
    }
    
    res.json({ success: true, data: sub });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
