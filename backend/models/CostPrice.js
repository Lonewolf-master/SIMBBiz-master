const mongoose = require('mongoose');

const costPriceSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  product_name: { type: String, required: true },
  cost_price: { type: Number, required: true, min: 0 }
}, { timestamps: true });

costPriceSchema.index({ business_id: 1, product_name: 1 }, { unique: true });

module.exports = mongoose.model('CostPrice', costPriceSchema);
