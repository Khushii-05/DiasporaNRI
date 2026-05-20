const express = require('express');
const Admin = require('../models/Admin');
const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');
const { requireAdmin } = require('../middleware/requireAdmin');

const router = express.Router();

router.get('/check', verifyFirebaseToken, async (req, res) => {
  const { uid, email } = req.user;

  try {
    // Normalize email to lowercase for comparison
    const normalizedEmail = email ? email.toLowerCase() : null;
    
    let admin = await Admin.findOne({
      isActive: true,
      $or: [
        { uid },
        { email: normalizedEmail }
      ]
    }).lean();

    // Debug log
    console.log(`[Admin Check] uid=${uid}, email=${normalizedEmail}, found=${!!admin}`);

    // If admin found but no uid, update it from Firebase
    if (admin && !admin.uid && uid) {
      await Admin.updateOne(
        { _id: admin._id },
        { uid }
      );
      admin.uid = uid;
      console.log(`[Admin Check] Updated uid for ${admin.email}`);
    }

    if (!admin) {
      // Log available admins for debugging
      const allAdmins = await Admin.find({ isActive: true }).select('email uid').lean();
      console.log(`[Admin Check] No match found. Available admins:`, allAdmins);
      return res.status(403).json({ isAdmin: false });
    }

    return res.json({ isAdmin: true, admin });
  } catch (error) {
    console.error('[Admin Check] Error:', error.message);
    return res.status(500).json({ error: 'Failed to check admin access' });
  }
});

// Add/register a new admin (requires existing admin or first-time setup)
router.post('/register', verifyFirebaseToken, async (req, res) => {
  const { uid, email } = req.user;
  const { targetEmail, targetUid } = req.body;

  if (!targetEmail) {
    return res.status(400).json({ error: 'targetEmail is required' });
  }

  try {
    // Check if this is the first admin
    const adminCount = await Admin.countDocuments();
    
    // If there are existing admins, verify current user is admin
    if (adminCount > 0) {
      const currentAdmin = await Admin.findOne({
        isActive: true,
        $or: [{ uid }, { email }]
      }).lean();

      if (!currentAdmin) {
        return res.status(403).json({ error: 'Admin access required to add new admins' });
      }
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: targetEmail.toLowerCase()
    });

    if (existingAdmin) {
      if (existingAdmin.isActive) {
        return res.status(409).json({ error: 'Admin with this email already exists' });
      } else {
        // Reactivate inactive admin
        existingAdmin.isActive = true;
        if (targetUid) {
          existingAdmin.uid = targetUid;
        }
        await existingAdmin.save();
        return res.json({ message: 'Admin reactivated', admin: existingAdmin });
      }
    }

    // Create new admin
    const newAdmin = new Admin({
      email: targetEmail.toLowerCase(),
      uid: targetUid || null,
      role: 'admin',
      isActive: true
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Admin with this email already exists' });
    }
    res.status(500).json({ error: 'Failed to create admin', details: error.message });
  }
});

// Get admin list (admin only)
router.get('/list', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const admins = await Admin.find({ isActive: true }).select('-__v').lean();
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

module.exports = { adminRouter: router };
