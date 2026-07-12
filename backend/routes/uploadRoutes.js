const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/auth');

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'simbbiz_products', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

// POST /api/upload - Upload an image to Cloudinary and return the URL
router.post('/', protect, (req, res) => {
  const uploader = upload.single('image');
  
  uploader(req, res, function (err) {
    if (err) {
      console.error('Upload Error:', err);
      return res.status(500).json({ 
        success: false, 
        error: err.message || 'Image upload failed. Check Cloudinary credentials.' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }
    
    // req.file.path contains the secure Cloudinary URL
    res.status(200).json({
      success: true,
      secure_url: req.file.path,
    });
  });
});

module.exports = router;
