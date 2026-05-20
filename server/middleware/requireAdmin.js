const Admin = require('../models/Admin');

async function requireAdmin(req, res, next) {
  const { uid, email } = req.user || {};

  if (!uid && !email) {
    return res.status(401).json({ error: 'Missing user context' });
  }

  try {
    const admin = await Admin.findOne({
      isActive: true,
      $or: [{ uid }, { email }]
    }).lean();

    if (!admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.admin = admin;
    return next();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to verify admin access' });
  }
}

module.exports = { requireAdmin };
