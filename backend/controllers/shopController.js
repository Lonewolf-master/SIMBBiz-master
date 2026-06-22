const Business = require('../models/Business');
const Category = require('../models/Category');
const Product = require('../models/Product');

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
