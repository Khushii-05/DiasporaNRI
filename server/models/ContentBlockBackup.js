const mongoose = require('mongoose');

const ContentBlockBackupSchema = new mongoose.Schema({
  backupName: { type: String, required: true },
  description: { type: String, default: '' },
  blocks: [
    {
      page: String,
      key: String,
      value: String,
      valueType: { type: String, default: 'text' }
    }
  ]
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('ContentBlockBackup', ContentBlockBackupSchema);
