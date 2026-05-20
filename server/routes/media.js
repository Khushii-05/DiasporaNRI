const express = require('express');
const multer = require('multer');
const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');
const { requireAdmin } = require('../middleware/requireAdmin');
const Media = require('../models/Media');
const { buildObjectKey, uploadToR2, deleteFromR2 } = require('../r2Client');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.get('/', async (req, res) => {
  try {
    const items = await Media.find().sort({ createdAt: -1 }).lean();
    return res.json({ media: items });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load media' });
  }
});

router.post('/admin', verifyFirebaseToken, requireAdmin, upload.single('file'), async (req, res) => {
  const { title, description, type } = req.body || {};

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  try {
    let fileUrl = '';
    let fileKey = '';

    if (req.file) {
      fileKey = buildObjectKey('media', req.file.originalname);
      fileUrl = await uploadToR2(req.file.buffer, fileKey, req.file.mimetype);
    }

    const media = await Media.create({
      title,
      description,
      type: type || 'image',
      fileUrl,
      fileKey
    });

    return res.json({ media });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add media' });
  }
});

router.delete('/admin/:id', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    if (media.fileKey) {
      await deleteFromR2(media.fileKey);
    }

    await Media.deleteOne({ _id: id });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete media' });
  }
});

module.exports = { mediaRouter: router };
