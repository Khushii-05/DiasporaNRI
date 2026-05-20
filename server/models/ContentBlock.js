const mongoose = require('mongoose');

const ContentBlockSchema = new mongoose.Schema({
  page: { type: String, required: true },
  key: { type: String, required: true },
  value: { type: String, default: '' },
  valueType: { type: String, default: 'text' }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

ContentBlockSchema.index({ page: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('ContentBlock', ContentBlockSchema);
