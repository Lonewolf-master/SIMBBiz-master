const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customer_name: { type: String }, // denormalized
  amount: { type: Number, required: true, min: 0 },
  notes: { type: String },
  payment_date: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
