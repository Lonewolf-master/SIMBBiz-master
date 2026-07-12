const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: './.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const fs = require('fs');
fs.writeFileSync('dummy.txt', 'not an image');

cloudinary.uploader.upload('dummy.txt', { resource_type: 'auto' })
  .then(res => console.log('Upload successful:', res.secure_url))
  .catch(err => console.error('Upload failed:', err));
