const test = require('node:test');
const assert = require('node:assert/strict');
const User = require('../models/User');

test('comparePassword accepts legacy plain text passwords', async () => {
  const user = new User({
    name: 'Test User',
    email: 'test@example.com',
    password: 'secret123'
  });

  const isMatch = await user.comparePassword('secret123');

  assert.equal(isMatch, true);
});
