const mongoose = require('mongoose');

const dailyCostSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  category: { type: String, required: true }, // e.g. 'Rice', 'Transport'
  amount: { type: Number, required: true, min: 0 },
  cost_date: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

dailyCostSchema.index({ business_id: 1, cost_date: 1 });

module.exports = mongoose.model('DailyCost', dailyCostSchema);
