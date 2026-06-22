const DailyCost = require('../models/DailyCost');

exports.list = async (req, res) => {
  try {
    const { date } = req.query;
    const query = { business_id: req.params.id };
    if (date) query.cost_date = new Date(date);

    const costs = await DailyCost.find(query).sort('-cost_date createdAt');
    res.json({ success: true, data: costs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.upsertDate = async (req, res) => {
  try {
    const { date, entries } = req.body;
    if (!date || !entries) return res.status(400).json({ success: false, error: 'date and entries are required' });

    // Delete existing costs for that date
    await DailyCost.deleteMany({ business_id: req.params.id, cost_date: new Date(date) });

    // Insert new ones
    const docs = entries.map((e) => ({
      business_id: req.params.id,
      category: e.category,
      amount: e.amount,
      cost_date: new Date(date)
    }));

    const inserted = await DailyCost.insertMany(docs);
    res.status(201).json({ success: true, data: inserted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
