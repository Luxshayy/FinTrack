const { test } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const protect = require('../middleware/authMiddleware');

process.env.JWT_SECRET = 'fintrack-test-secret';

function runMiddleware(authorization) {
  const req = { headers: authorization ? { authorization } : {} };
  let statusCode;
  let responseBody;
  let nextCalled = false;
  const res = {
    status: (code) => { statusCode = code; return res; },
    json: (body) => { responseBody = body; },
  };
  protect(req, res, () => { nextCalled = true; });
  return { req, statusCode, responseBody, nextCalled };
}

test('allows a valid JWT and exposes its user id', () => {
  const token = jwt.sign({ userId: 'user-123' }, process.env.JWT_SECRET);
  const result = runMiddleware(`Bearer ${token}`);
  assert.equal(result.nextCalled, true);
  assert.equal(result.req.userId, 'user-123');
  assert.equal(result.statusCode, undefined);
});

test('rejects missing, malformed and invalid tokens', () => {
  for (const authorization of [undefined, 'Token abc', 'Bearer invalid-token']) {
    const result = runMiddleware(authorization);
    assert.equal(result.nextCalled, false);
    assert.equal(result.statusCode, 401);
    assert.match(result.responseBody.message, /Authentication|required|session/i);
  }
});
