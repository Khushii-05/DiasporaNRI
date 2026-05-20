const express = require('express');
const ContentBlock = require('../models/ContentBlock');
const ContentBlockBackup = require('../models/ContentBlockBackup');
const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');
const { requireAdmin } = require('../middleware/requireAdmin');

const router = express.Router();

// Public: get content blocks for a page
router.get('/', async (req, res) => {
  const page = (req.query.page || '').trim();

  if (!page) {
    return res.status(400).json({ error: 'Missing page query parameter' });
  }

  try {
    const blocks = await ContentBlock.find({ page }).sort({ key: 1 }).lean();
    return res.json({ page, blocks });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load content blocks' });
  }
});

// Admin: list content blocks for a page
router.get('/admin', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const page = (req.query.page || '').trim();

  if (!page) {
    return res.status(400).json({ error: 'Missing page query parameter' });
  }

  try {
    const blocks = await ContentBlock.find({ page }).sort({ key: 1 }).lean();
    return res.json({ page, blocks });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load content blocks' });
  }
});

// Admin: create or update a content block
router.post('/admin', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const { page, key, value, valueType } = req.body || {};

  if (!page || !key) {
    return res.status(400).json({ error: 'page and key are required' });
  }

  try {
    const block = await ContentBlock.findOneAndUpdate(
      { page, key },
      { value: value || '', valueType: valueType || 'text' },
      { new: true, upsert: true }
    ).lean();

    return res.json({ block });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save content block' });
  }
});

// Admin: delete a content block
router.delete('/admin/:id', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await ContentBlock.deleteOne({ _id: id });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete content block' });
  }
});

// Admin: create backup of all content blocks
router.post('/admin/backup', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const { backupName, description } = req.body || {};

  if (!backupName || !backupName.trim()) {
    return res.status(400).json({ error: 'backupName is required' });
  }

  try {
    const blocks = await ContentBlock.find().lean();
    const backup = new ContentBlockBackup({
      backupName: backupName.trim(),
      description: description || '',
      blocks
    });
    await backup.save();
    return res.json({ backup });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create backup' });
  }
});

// Admin: list all backups
router.get('/admin/backups', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const backups = await ContentBlockBackup.find()
      .select('_id backupName description createdAt')
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ backups });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load backups' });
  }
});

// Admin: restore from backup
router.post('/admin/restore/:backupId', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const { backupId } = req.params;

  try {
    const backup = await ContentBlockBackup.findById(backupId);
    if (!backup) {
      return res.status(404).json({ error: 'Backup not found' });
    }

    // Delete all current blocks
    await ContentBlock.deleteMany({});

    // Restore blocks from backup
    const blocks = backup.blocks.map(block => ({
      page: block.page,
      key: block.key,
      value: block.value,
      valueType: block.valueType
    }));
    await ContentBlock.insertMany(blocks);

    return res.json({ ok: true, restored: blocks.length });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to restore backup' });
  }
});

// Admin: delete backup
router.delete('/admin/backups/:backupId', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const { backupId } = req.params;

  try {
    await ContentBlockBackup.deleteOne({ _id: backupId });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete backup' });
  }
});

module.exports = { contentRouter: router };
