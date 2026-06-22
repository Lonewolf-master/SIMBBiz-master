const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  location: { type: String },
  phone: { type: String },
  lang: { type: String, default: 'en' },
  pin_hash: { type: String },
  auto_lock_min: { type: Number, default: 0 }
}, { timestamps: true });

// Auto-generate slug from name if not provided
businessSchema.pre('validate', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    // Append random string to ensure uniqueness if needed, but for now just use name
  }
  next();
});

module.exports = mongoose.model('Business', businessSchema);
