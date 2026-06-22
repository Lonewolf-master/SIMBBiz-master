const mongoose = require('mongoose');

const liabilityPaymentSchema = new mongoose.Schema({
  creditor_name: { type: String },
  amount: { type: Number, required: true, min: 0 },
  notes: { type: String },
  payment_date: { type: Date, default: Date.now }
}, { timestamps: true });

const liabilitySchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  creditor: { type: String, required: true },
  phone: { type: String },
  type: { type: String }, // e.g. 'loan', 'supplier'
  item: { type: String },
  amount: { type: Number, required: true, min: 0 },
  notes: { type: String },
  entry_date: { type: Date, default: Date.now },
  payments: [liabilityPaymentSchema] // embedded liability_payments
}, { timestamps: true });

liabilitySchema.index({ business_id: 1, creditor: 1 });

module.exports = mongoose.model('Liability', liabilitySchema);
