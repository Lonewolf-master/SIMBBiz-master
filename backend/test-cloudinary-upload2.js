const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: './.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const fs = require('fs');
fs.writeFileSync('dummy.jpg', 'fake image content');

cloudinary.uploader.upload('dummy.jpg', { resource_type: 'image' })
  .then(res => console.log('Upload successful:', res.secure_url))
  .catch(err => console.error('Upload failed:', err));
