const Customer = require('../models/Customer');

exports.list = async (req, res) => {
  try {
    const customers = await Customer.find({ business_id: req.params.id }).sort('name');
    res.json({ success: true, data: customers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.upsert = async (req, res) => {
  try {
    const { name, phone, notes } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'name is required' });
    const customer = await Customer.findOneAndUpdate(
      { business_id: req.params.id, name },
      { phone, notes },
      { new: true, upsert: true }
    );
    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Customer deleted' } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
