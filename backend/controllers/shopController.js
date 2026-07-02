const Business = require('../models/Business');
const Category = require('../models/Category');
const Product = require('../models/Product');

exports.getAllStores = async (req, res) => {
  try {
    const businesses = await Business.find({}).select('name slug category description location phone createdAt');
    res.json({ success: true, data: businesses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getDiscoveryData = async (req, res) => {
  try {
    // 1. Get random products
    const randomProducts = await Product.aggregate([
      { $match: { in_stock: true } },
      { $sample: { size: 24 } },
      { $lookup: { from: 'businesses', localField: 'business_id', foreignField: '_id', as: 'business' } },
      { $unwind: '$business' }
    ]);

    // 2. Get latest products
    const latestProducts = await Product.find({ in_stock: true })
      .sort({ added_date: -1 })
      .limit(12)
      .populate('business_id', 'name slug phone location');

    // 3. Get featured stores
    const topStores = await Business.aggregate([
      { $sample: { size: 6 } }
    ]);

    res.json({ success: true, data: { randomProducts, latestProducts, topStores } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getStorefront = async (req, res) => {
  try {
    const business = await Business.findOne({ slug: req.params.slug }).select('id name slug location phone');
    if (!business) return res.status(404).json({ success: false, error: 'Shop not found' });

    const categories = await Category.find({ business_id: business._id }).sort('sort_order createdAt');
    const products = await Product.find({ business_id: business._id, in_stock: true }).sort('-added_date -createdAt');

    // Group products
    const cats = categories.map(c => {
      const doc = c.toObject();
      doc.products = products.filter(p => p.category_id && p.category_id.toString() === doc._id.toString());
      return doc;
    });

    const uncategorised = products.filter(p => !p.category_id);

    res.json({ success: true, data: { business, categories: cats, uncategorised } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
