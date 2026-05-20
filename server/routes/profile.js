const express = require('express');
const multer = require('multer');
const { uploadToR2, deleteFromR2 } = require('../r2Client');
const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload profile picture
router.post('/picture', verifyFirebaseToken, upload.single('profilePicture'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    const userId = req.user.uid;
    const fileName = `profile-pictures/${userId}/${Date.now()}-${req.file.originalname}`;
    
    // Upload to R2
    const fileUrl = await uploadToR2(req.file.buffer, fileName, req.file.mimetype);
    
    return res.json({ 
      url: fileUrl,
      fileName: fileName
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    return res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

// Delete profile picture
router.delete('/picture/:fileName', verifyFirebaseToken, async (req, res) => {
  try {
    const { fileName } = req.params;
    const userId = req.user.uid;
    
    // Verify file belongs to user
    if (!fileName.startsWith(`profile-pictures/${userId}`)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete from R2
    await deleteFromR2(fileName);
    
    return res.json({ ok: true });
  } catch (error) {
    console.error('Profile picture delete error:', error);
    return res.status(500).json({ error: 'Failed to delete profile picture' });
  }
});

module.exports = { profileRouter: router };
