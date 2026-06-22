const Payment = require('../models/Payment');
const Customer = require('../models/Customer');

exports.list = async (req, res) => {
  try {
    const payments = await Payment.find({ business_id: req.params.id }).sort('-payment_date -createdAt');
    res.json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { customer_name, amount, notes } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, error: 'valid amount is required' });

    let customerId = null;
    if (customer_name) {
      const customer = await Customer.findOne({ business_id: req.params.id, name: customer_name });
      if (customer) customerId = customer._id;
    }

    const payment = new Payment({
      business_id: req.params.id,
      customer_id: customerId,
      customer_name,
      amount,
      notes
    });

    await payment.save();
    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
