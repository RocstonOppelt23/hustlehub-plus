const jwt = require('jsonwebtoken');

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'change_me') {
    throw new Error('JWT_SECRET is missing or still the placeholder value in .env');
  }
  return secret;
}

// Token carries only the user id and role, nothing sensitive
function signToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    algorithm: 'HS256',
  });
}

function verifyToken(token) {
  return jwt.verify(token, getSecret(), { algorithms: ['HS256'] });
}

module.exports = { signToken, verifyToken };
