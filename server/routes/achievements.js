const express = require('express');
const multer = require('multer');
const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');
const { requireAdmin } = require('../middleware/requireAdmin');
const Achievement = require('../models/Achievement');
const { buildObjectKey, uploadToR2, deleteFromR2 } = require('../r2Client');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.get('/', async (req, res) => {
  try {
    const items = await Achievement.find().sort({ date: -1 }).lean();
    return res.json({ achievements: items });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load achievements' });
  }
});

router.post('/admin', verifyFirebaseToken, requireAdmin, upload.single('file'), async (req, res) => {
  const { title, description, date } = req.body || {};

  if (!title || !description || !date) {
    return res.status(400).json({ error: 'Title, description, and date are required' });
  }

  try {
    let fileUrl = '';
    let fileKey = '';

    if (req.file) {
      fileKey = buildObjectKey('achievements', req.file.originalname);
      fileUrl = await uploadToR2(req.file.buffer, fileKey, req.file.mimetype);
    }

    const achievement = await Achievement.create({
      title,
      description,
      date: new Date(date),
      fileUrl,
      fileKey
    });

    return res.json({ achievement });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add achievement' });
  }
});

router.delete('/admin/:id', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    if (achievement.fileKey) {
      await deleteFromR2(achievement.fileKey);
    }

    await Achievement.deleteOne({ _id: id });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete achievement' });
  }
});

module.exports = { achievementsRouter: router };
