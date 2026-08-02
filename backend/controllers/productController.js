const Product = require('../models/Product');
const Business = require('../models/Business');


exports.list = async (req, res) => {
  try {
    const { category_id, in_stock } = req.query;
    const query = { business_id: req.params.id };
    if (category_id) query.category_id = category_id;
    if (in_stock === 'true') query.in_stock = true;

    const products = await Product.find(query).populate('category_id', 'name').sort('-added_date -createdAt');
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSingle = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category_id', 'name').populate('business_id', 'name phone');
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { category_id, name, description, price, image_url, in_stock, stock_qty, discount, min_qty, max_qty } = req.body;
    if (!name || price == null || price < 0) return res.status(400).json({ success: false, error: 'Valid name and price are required' });
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ success: false, error: 'Business not found' });
    
    if (business.item_slots_available <= 0) {
      return res.status(403).json({ success: false, error: 'Item limit reached. Please buy more spaces to add products.' });
    }

    const product = new Product({
      business_id: req.params.id, category_id: category_id || null, name, description, price, image_url, in_stock: in_stock ?? true, stock_qty, discount, min_qty, max_qty
    });
    await product.save();

    business.item_slots_available -= 1;
    await business.save();

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    
    await Product.findByIdAndDelete(req.params.id);
    
    const business = await Business.findById(product.business_id);
    if (business) {
      business.item_slots_available += 1;
      await business.save();
    }
    
    res.json({ success: true, data: { message: 'Product deleted and slot restored' } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
