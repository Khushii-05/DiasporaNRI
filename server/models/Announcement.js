const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
