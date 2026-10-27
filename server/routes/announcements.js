const express = require('express');
const Announcement = require('../models/Announcement');
const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');
const { requireAdmin } = require('../middleware/requireAdmin');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ announcements });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load announcements' });
  }
});

router.get('/admin', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ announcements });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load announcements' });
  }
});

router.post('/admin', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';

  if (!text) {
    return res.status(400).json({ error: 'Announcement text is required' });
  }

  if (text.length > 240) {
    return res.status(400).json({ error: 'Announcement text must be 240 characters or fewer' });
  }

  try {
    const announcement = await Announcement.create({ text });
    return res.status(201).json({ announcement });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create announcement' });
  }
});

router.delete('/admin/:id', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const result = await Announcement.deleteOne({ _id: req.params.id });
    if (!result.deletedCount) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

module.exports = { announcementsRouter: router };
