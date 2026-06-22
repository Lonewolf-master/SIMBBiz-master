const Category = require('../models/Category');

exports.list = async (req, res) => {
  try {
    const categories = await Category.find({ business_id: req.params.id }).sort('sort_order createdAt');
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, sort_order } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'name is required' });
    const category = new Category({ business_id: req.params.id, name, sort_order });
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Category deleted' } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
