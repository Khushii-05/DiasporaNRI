const Admin = require('../models/Admin');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function findActiveAdmin({ uid, email }) {
  const conditions = [];

  if (uid) {
    conditions.push({ uid });
  }

  if (email) {
    const normalizedEmail = email.trim().toLowerCase();
    conditions.push({
      email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, 'i')
    });
  }

  if (conditions.length === 0) {
    return null;
  }

  return Admin.findOne({
    isActive: true,
    $or: conditions
  }).lean();
}

module.exports = { findActiveAdmin };
