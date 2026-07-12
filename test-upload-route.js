const fs = require('fs');
const path = require('path');

// Create a dummy image file
fs.writeFileSync('dummy.jpg', 'fake image content');

const FormData = require('form-data');
const form = new FormData();
form.append('image', fs.createReadStream('dummy.jpg'));

// Since it's protected, we need to mock the token or disable protect for this test.
// Wait, we can't easily mock the token unless we login. Let's login first.
