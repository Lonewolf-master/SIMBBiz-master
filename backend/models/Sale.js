const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  qty: { type: Number, required: true, min: 1, default: 1 },
  unit_price: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 }
});

const saleSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customer_name: { type: String }, // denormalized
  customer_phone: { type: String }, // denormalized
  type: { type: String, required: true, enum: ['cash', 'credit', 'transfer'] },
  total: { type: Number, required: true, min: 0 },
  notes: { type: String },
  sale_date: { type: Date, default: Date.now, index: true },
  items: [saleItemSchema] // Embedded instead of separate table
}, { timestamps: true });

saleSchema.index({ business_id: 1, sale_date: 1 });
saleSchema.index({ business_id: 1, type: 1 });

module.exports = mongoose.model('Sale', saleSchema);
