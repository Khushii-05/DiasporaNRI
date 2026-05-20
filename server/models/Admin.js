const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  uid: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Admin', AdminSchema);
