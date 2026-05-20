const express = require('express');
const multer = require('multer');
const ContactSubmission = require('../models/ContactSubmission');
const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');
const { requireAdmin } = require('../middleware/requireAdmin');
const { buildObjectKey, uploadToR2 } = require('../r2Client');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public: submit contact form with optional file upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let mediaData = undefined;

    // Upload file to R2 if provided
    if (req.file) {
      try {
        console.log(`[Contact] Uploading file: ${req.file.originalname}`);
        const fileKey = buildObjectKey('contact-submissions', req.file.originalname);
        const fileUrl = await uploadToR2(
          req.file.buffer,
          fileKey,
          req.file.mimetype
        );

        mediaData = {
          name: req.file.originalname,
          type: req.file.mimetype,
          size: req.file.size,
          fileUrl,
          fileKey
        };
        console.log(`[Contact] File uploaded successfully: ${fileUrl}`);
      } catch (uploadError) {
        console.error('[Contact] File upload error:', uploadError.message);
        // Continue without file rather than failing completely
        console.log('[Contact] Proceeding without file attachment');
      }
    }

    const submission = await ContactSubmission.create({
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
      media: mediaData
    });

    console.log(`[Contact] Submission created: ${submission._id}`);
    return res.json({ submission });
  } catch (error) {
    console.error('[Contact] Submission error:', error.message);
    console.error('[Contact] Stack:', error.stack);
    return res.status(500).json({ error: 'Failed to submit contact form', details: error.message });
  }
});

// Admin: list contact submissions
router.get('/admin', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const filter = req.query.filter || 'all';

  try {
    const query = {};
    if (filter === 'read') query.read = true;
    if (filter === 'unread') query.read = false;

    const submissions = await ContactSubmission.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ submissions });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load submissions' });
  }
});

// Admin: toggle read state
router.patch('/admin/:id', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { read } = req.body || {};

  try {
    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      { read: Boolean(read) },
      { new: true }
    ).lean();

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    return res.json({ submission: { id: submission._id, read: submission.read } });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update submission' });
  }
});

// Admin: delete submission
router.delete('/admin/:id', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await ContactSubmission.deleteOne({ _id: id });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete submission' });
  }
});

module.exports = { contactRouter: router };
