const mongoose = require('mongoose');

const ContactSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  media: {
    type: new mongoose.Schema({
      name: String,
      type: String,
      size: Number,
      fileUrl: String,
      fileKey: String
    }, { _id: false }),
    default: null
  },
  read: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('ContactSubmission', ContactSubmissionSchema);
