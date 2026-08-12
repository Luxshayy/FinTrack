const { test } = require('node:test');
const assert = require('node:assert/strict');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

test('user model requires a valid account shape', async () => {
  const user = new User({ email: 'person@example.com' });
  const error = await user.validate().catch((validationError) => validationError);
  assert.ok(error.errors.name);
  assert.ok(error.errors.password);
});

test('transaction model only permits income or expense with a positive amount', async () => {
  const transaction = new Transaction({ type: 'transfer', amount: 0, category: '', user: '507f1f77bcf86cd799439011' });
  const error = await transaction.validate().catch((validationError) => validationError);
  assert.ok(error.errors.type);
  assert.ok(error.errors.amount);
  assert.ok(error.errors.category);
});
