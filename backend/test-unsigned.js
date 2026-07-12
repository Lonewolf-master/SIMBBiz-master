const fs = require('fs');
fs.writeFileSync('dummy.jpg', 'image content');

const FormData = require('form-data');
const form = new FormData();
form.append('file', fs.createReadStream('dummy.jpg'));
form.append('upload_preset', '-LrmGJZkORwd6UnzQZe7kRJV7ug');

fetch('https://api.cloudinary.com/v1_1/djuruagij/image/upload', {
  method: 'POST',
  body: form
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error(err));
