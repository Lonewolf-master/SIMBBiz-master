const Sale = require('../models/Sale');
const Customer = require('../models/Customer');

exports.list = async (req, res) => {
  try {
    const { from, to, type } = req.query;
    const query = { business_id: req.params.id };
    if (from && to) query.sale_date = { $gte: new Date(from), $lte: new Date(to) };
    if (type) query.type = type;

    const sales = await Sale.find(query).sort('-sale_date -createdAt');
    res.json({ success: true, data: sales });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { customer_name, customer_phone, type, total, notes, items } = req.body;
    if (!type || total == null) return res.status(400).json({ success: false, error: 'type and total are required' });

    let customerId = null;
    if (customer_name) {
      const customer = await Customer.findOneAndUpdate(
        { business_id: req.params.id, name: customer_name },
        { phone: customer_phone },
        { new: true, upsert: true }
      );
      customerId = customer._id;
    }

    const sale = new Sale({
      business_id: req.params.id,
      customer_id: customerId,
      customer_name,
      customer_phone,
      type,
      total,
      notes,
      items: items || []
    });

    await sale.save();
    res.status(201).json({ success: true, data: sale });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Sale deleted' } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
