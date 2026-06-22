const mongoose = require('mongoose');

const sentMessageSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  sent_to: { type: String, required: true },
  type: { type: String }, // 'debt', 'catalogue', 'reply', 'creditor'
  preview: { type: String },
  sent_date: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

module.exports = mongoose.model('SentMessage', sentMessageSchema);
