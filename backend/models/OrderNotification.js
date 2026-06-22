const mongoose = require('mongoose');

const orderNotificationSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  product_name: { type: String },
  order_ref: { type: String, required: true, index: true },
  customer: { type: String },
  is_read: { type: Boolean, default: false },
  notif_date: { type: Date, default: Date.now }
}, { timestamps: true });

orderNotificationSchema.index({ business_id: 1, is_read: 1 });

module.exports = mongoose.model('OrderNotification', orderNotificationSchema);
