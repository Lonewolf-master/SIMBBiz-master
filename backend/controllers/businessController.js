const Business = require('../models/Business');

// Create a new business for the logged-in user
exports.createBusiness = async (req, res) => {
  try {
    const { name, location, phone, lang, category, description } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'name is required' });
    
    // Auto-generate slug handled by mongoose pre-validate hook
    const business = new Business({ 
      owner_id: req.user._id,
      name,
      description,
      category, 
      location, 
      phone, 
      lang: lang || 'en' 
    });
    
    await business.save();
    res.status(201).json({ success: true, data: business });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, error: 'A store with this generated URL already exists. Please choose a different name.' });
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all businesses owned by the logged-in user
exports.getMyBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ owner_id: req.user._id });
    res.json({ success: true, data: businesses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const business = await Business.findOne({ slug: req.params.slug });
    if (!business) return res.status(404).json({ success: false, error: 'Business not found' });
    res.json({ success: true, data: business });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const business = await Business.findOneAndUpdate(
      { _id: req.params.id, owner_id: req.user._id }, 
      req.body, 
      { new: true }
    );
    if (!business) return res.status(404).json({ success: false, error: 'Business not found or unauthorized' });
    res.json({ success: true, data: business });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updatePin = async (req, res) => {
  try {
    const { pin_hash } = req.body;
    if (!pin_hash) return res.status(400).json({ success: false, error: 'pin_hash is required' });
    const business = await Business.findOneAndUpdate({ _id: req.params.id, owner_id: req.user._id }, { pin_hash });
    if (!business) return res.status(404).json({ success: false, error: 'Business not found or unauthorized' });
    res.json({ success: true, data: { message: 'PIN updated' } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.verifyPin = async (req, res) => {
  try {
    const { pin_hash } = req.body;
    const business = await Business.findOne({ _id: req.params.id, owner_id: req.user._id });
    if (!business) return res.status(404).json({ success: false, error: 'Business not found or unauthorized' });
    res.json({ success: true, data: { verified: business.pin_hash === pin_hash } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
