// Role-based access control.
// Usage: router.post('/gigs', authenticate, requireRole('freelancer'), createGig)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to do this' });
    }
    return next();
  };
}

module.exports = requireRole;
