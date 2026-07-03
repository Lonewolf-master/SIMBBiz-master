const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Generate JWT and send in cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE
  });

  const options = {
    expires: new Date(Date.now() + config.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax',
    path: '/'
  };

  // Secure cookie in production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'name, email, and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = new User({
      name,
      email: normalizedEmail,
      password
    });

    await user.save();
    sendTokenResponse(user, 201, res);

  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, error: 'Email already exists' });
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check for user
    const user = await User.findOne({
      email: { $regex: `^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
    });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

exports.getMe = async (req, res) => {
  try {
    // req.user is already populated by the auth middleware
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
