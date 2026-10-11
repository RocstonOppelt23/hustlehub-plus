const mongoose = require('mongoose');

// Makes sure the logged-in user owns the resource before they change or delete it.
// Admins are allowed through. The loaded document is put on req.resource so the
// controller does not have to fetch it again.
//
// Usage (Gig has a "freelancer" field holding the owner's user id):
//   router.put('/gigs/:id', authenticate, requireRole('freelancer'), checkOwnership(Gig, 'freelancer'), updateGig)
function checkOwnership(Model, ownerField = 'freelancer', paramName = 'id') {
  return async (req, res, next) => {
    const resourceId = req.params[paramName];

    if (!mongoose.isValidObjectId(resourceId)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const resource = await Model.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Not found' });
    }

    const ownerId = resource[ownerField] && resource[ownerField].toString();
    const isOwner = ownerId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You can only change your own resources' });
    }

    req.resource = resource;
    return next();
  };
}

module.exports = checkOwnership;
