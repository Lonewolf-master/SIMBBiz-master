const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  image_url: { type: String },
  in_stock: { type: Boolean, default: true },
  stock_qty: { type: Number }, // null means unlimited
  discount: { type: Number, default: 0 }, // % discount
  min_qty: { type: Number, default: 1 },
  max_qty: { type: Number }, // null means no max limit
  is_promotion: { type: Boolean, default: false },
  added_date: { type: Date, default: Date.now },
  views: { type: Number, default: 0 } // Incorporated from product_views table
}, { timestamps: true });

productSchema.index({ business_id: 1, in_stock: 1 });

module.exports = mongoose.model('Product', productSchema);
