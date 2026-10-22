const express = require('express');
const Booking = require('../models/Booking');
const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');
const { requireAdmin } = require('../middleware/requireAdmin');
const { 
  sendBookingConfirmationEmail, 
  sendBookingCancellationEmail,
  sendBookingRejectionEmail 
} = require('../services/emailService');

const router = express.Router();

// User: Create a new booking (requires Firebase token)
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const { userName, userEmail, userPhone, meetingDate, meetingTime, duration, timeZone, serviceType, preparationDetails, additionalInfo } = req.body;
    const userId = req.user.uid;

    // Validate required fields
    if (!userName || !userEmail || !userPhone || !meetingDate || !meetingTime || !serviceType || !preparationDetails) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const booking = await Booking.create({
      userId,
      userName,
      userEmail,
      userPhone,
      meetingDate,
      meetingTime,
      duration: duration || 45,
      timeZone: timeZone || 'Asia/Kolkata',
      serviceType,
      preparationDetails,
      additionalInfo: additionalInfo || '',
      status: 'pending'
    });

    console.log(`[Booking] New booking created: ${booking._id}`);
    return res.json({ booking });
  } catch (error) {
    console.error('[Booking] Creation error:', error.message);
    return res.status(500).json({ error: 'Failed to create booking', details: error.message });
  }
});

// User: Get their own bookings (requires Firebase token)
router.get('/my-bookings', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const bookings = await Booking.find({ userId })
      .sort({ meetingDate: -1 })
      .lean();

    return res.json({ bookings });
  } catch (error) {
    console.error('[Booking] Fetch error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
});

// User: Get a specific booking (verify ownership)
router.get('/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const booking = await Booking.findById(id).lean();

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    return res.json({ booking });
  } catch (error) {
    console.error('[Booking] Fetch error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch booking', details: error.message });
  }
});

// User: Cancel their booking
router.patch('/:id/cancel', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ error: `Cannot cancel a ${booking.status} booking` });
    }

    booking.status = 'cancelled';
    await booking.save();

    console.log(`[Booking] Booking cancelled: ${booking._id}`);
    return res.json({ booking });
  } catch (error) {
    console.error('[Booking] Cancel error:', error.message);
    return res.status(500).json({ error: 'Failed to cancel booking', details: error.message });
  }
});

// Admin: Get all bookings
router.get('/admin/all', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const filter = req.query.filter || 'all';

  try {
    const query = {};
    if (filter !== 'all') {
      query.status = filter;
    }

    const bookings = await Booking.find(query)
      .sort({ meetingDate: 1 })
      .lean();

    return res.json({ bookings });
  } catch (error) {
    console.error('[Booking] Admin fetch error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
});

// Admin: Update booking status and details
router.patch('/admin/:id', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, meetingLink, meetingDetails } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const previousStatus = booking.status;
    const isStatusChanging = status && status !== previousStatus;

    if (status) booking.status = status;
    if (adminNotes !== undefined) booking.adminNotes = adminNotes;
    if (meetingLink !== undefined) booking.meetingLink = meetingLink;
    if (meetingDetails !== undefined) booking.meetingDetails = meetingDetails;

    await booking.save();

    // Send email notifications based on status change
    if (isStatusChanging) {
      try {
        if (status === 'confirmed') {
          await sendBookingConfirmationEmail(booking);
        } else if (status === 'cancelled') {
          await sendBookingCancellationEmail(booking);
        } else if (status === 'no-show' || previousStatus === 'pending' && status !== 'confirmed') {
          await sendBookingRejectionEmail(booking);
        }
      } catch (emailError) {
        console.error('[Booking] Email notification failed:', emailError.message);
        // Continue without failing the booking update
      }
    }

    console.log(`[Booking] Booking updated: ${booking._id}`);
    return res.json({ booking });
  } catch (error) {
    console.error('[Booking] Update error:', error.message);
    return res.status(500).json({ error: 'Failed to update booking', details: error.message });
  }
});

// Admin: Delete a booking
router.delete('/admin/:id', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log(`[Booking] Booking deleted: ${booking._id}`);
    return res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('[Booking] Delete error:', error.message);
    return res.status(500).json({ error: 'Failed to delete booking', details: error.message });
  }
});

module.exports = { bookingRouter: router };
