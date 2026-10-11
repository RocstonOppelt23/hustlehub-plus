const { verifyToken } = require('../utils/jwt');

// Checks the "Authorization: Bearer <token>" header and sets req.user = { id, role }
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticate;
