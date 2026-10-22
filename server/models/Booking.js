const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Firebase UID
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  
  // Meeting Details
  meetingDate: { type: Date, required: true },
  meetingTime: { type: String, required: true }, // Format: HH:MM
  duration: { type: Number, default: 45, enum: [30, 45, 60] }, // minutes
  timeZone: { type: String, default: 'Asia/Kolkata' },
  
  // Service/Topic Information
  serviceType: { type: String, required: true },
  preparationDetails: { type: String, required: true }, // User's description of needs
  
  // Status Management
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  
  // Admin Notes
  adminNotes: { type: String, default: '' },
  
  // Meeting Link/Details (added by admin after confirmation)
  meetingLink: { type: String, default: '' },
  meetingDetails: { type: String, default: '' },
  
  // Additional Info
  additionalInfo: { type: String, default: '' },
  
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Booking', BookingSchema);
