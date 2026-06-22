const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  name: { type: String, required: true },
  phone: { type: String },
  since_date: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: true });

customerSchema.index({ business_id: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Customer', customerSchema);
