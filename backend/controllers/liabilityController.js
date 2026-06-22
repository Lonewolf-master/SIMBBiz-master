const Liability = require('../models/Liability');

exports.list = async (req, res) => {
  try {
    const liabilities = await Liability.find({ business_id: req.params.id }).sort('-entry_date -createdAt');
    // Compute total repaid dynamically for each liability
    const data = liabilities.map(l => {
      const doc = l.toObject();
      doc.total_repaid = doc.payments ? doc.payments.reduce((sum, p) => sum + p.amount, 0) : 0;
      return doc;
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { creditor, phone, type, item, amount, notes } = req.body;
    if (!creditor || amount == null) return res.status(400).json({ success: false, error: 'creditor and amount are required' });
    
    const liability = new Liability({
      business_id: req.params.id, creditor, phone, type, item, amount, notes
    });
    await liability.save();
    res.status(201).json({ success: true, data: liability });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addPayment = async (req, res) => {
  try {
    const { liability_id, creditor_name, amount, notes } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, error: 'valid amount is required' });

    const liability = await Liability.findOne({ _id: liability_id, business_id: req.params.id });
    if (!liability) return res.status(404).json({ success: false, error: 'Liability not found' });

    liability.payments.push({ creditor_name, amount, notes });
    await liability.save();
    res.status(201).json({ success: true, data: liability });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
