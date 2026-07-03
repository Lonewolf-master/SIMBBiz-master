const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

// Pre-save hook to normalize email and hash password
userSchema.pre('save', async function(next) {
  if (this.email) {
    this.email = this.email.trim().toLowerCase();
  }

  if (!this.isModified('password')) return next();

  if (!this.password) return next();

  try {
    const isHashed = /^\$2[aby]\$/i.test(this.password);
    if (!isHashed) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!candidatePassword || !this.password) return false;

  const isHashed = /^\$2[aby]\$/i.test(this.password);
  if (isHashed) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  if (candidatePassword === this.password) {
    if (this.isNew) {
      return true;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(candidatePassword, salt);
    await this.save({ validateBeforeSave: false });
    return true;
  }

  return false;
};

module.exports = mongoose.model('User', userSchema);
