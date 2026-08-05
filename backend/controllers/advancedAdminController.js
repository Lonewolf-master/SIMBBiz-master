const Announcement = require('../models/Announcement');
const Plan = require('../models/Plan');
const Ticket = require('../models/Ticket');
const Business = require('../models/Business');
const User = require('../models/User');
const Sale = require('../models/Sale');

// Store Suspension
exports.toggleBusinessSuspension = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ success: false, error: 'Business not found' });
    business.isSuspended = !business.isSuspended;
    await business.save();
    res.json({ success: true, data: business });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';
    const filter = isAdmin ? {} : { active: true };
    const announcements = await Announcement.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: announcements });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.create(req.body);
    res.json({ success: true, data: ann });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1 });
    res.json({ success: true, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Tickets
exports.getTickets = async (req, res) => {
  try {
    // If admin, see all. If user, see own.
    const isAdmin = req.user.role === 'admin';
    const filter = isAdmin ? {} : { user_id: req.user.id };
    const tickets = await Ticket.find(filter).populate('user_id', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: tickets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      user_id: req.user.id,
      subject: req.body.subject,
      replies: [{ sender: 'user', message: req.body.message }]
    });
    res.json({ success: true, data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.replyTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
    
    // Check permission
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && ticket.user_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    ticket.replies.push({
      sender: isAdmin ? 'admin' : 'user',
      message: req.body.message
    });
    
    if (req.body.status && isAdmin) {
      ticket.status = req.body.status;
    }
    
    await ticket.save();
    res.json({ success: true, data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Advanced Analytics (Time-series)
exports.getAdvancedAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Group sales by day
    const salesByDay = await Sale.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: '$total' } 
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
    // Group signups by day
    const signupsByDay = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 } 
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({ success: true, data: { salesByDay, signupsByDay } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
