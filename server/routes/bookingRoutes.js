import express from 'express';
import Booking from '../models/Booking.js';
import Tutor from '../models/Tutor.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Book a new tutoring session
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  const { tutorId, studentPhone, paymentMethod, transactionId, paymentScreenshot } = req.body;

  if (!tutorId || !studentPhone) {
    return res.status(400).json({ message: 'Tutor ID and student phone number are required' });
  }

  if (!paymentMethod || !transactionId) {
    return res.status(400).json({ message: 'Payment method and Transaction ID are required to confirm booking' });
  }

  try {
    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }

    // 1. SLOT RESTRICTION
    if (tutor.totalSlot === 0) {
      return res.status(400).json({
        message: 'No available slots left. This session is fully booked. You can\'t join at the moment.'
      });
    }

    // 2. SESSION DATE RESTRICTION
    const todayStr = new Date().toISOString().split('T')[0];
    if (tutor.sessionDate > todayStr) {
      return res.status(400).json({
        message: `Booking is not available yet for this tutor. Session starts ${tutor.sessionDate}.`
      });
    }

    // Check if already booked active session
    const existingActiveBooking = await Booking.findOne({
      tutorId,
      studentEmail: req.user.email,
      bookingStatus: { $ne: 'cancelled' }
    });

    if (existingActiveBooking) {
      return res.status(400).json({ message: 'You have already booked an active session with this tutor' });
    }

    // 3. SUCCESSFUL BOOKING: Atomically decrease slot count
    tutor.totalSlot -= 1;
    await tutor.save();

    const booking = await Booking.create({
      tutorId: tutor._id,
      tutorName: tutor.tutorName,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentPhone,
      bookingStatus: 'confirmed',
      paymentMethod,
      transactionId,
      paymentScreenshot: paymentScreenshot || ''
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create Booking Error:', error);
    res.status(500).json({ message: 'Server error processing booking' });
  }
});

// @desc    Get user's booked sessions
// @route   GET /api/bookings/my-bookings
// @access  Private
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ studentEmail: req.user.email }).sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Fetch Bookings Error:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
});

// @desc    Cancel a booked session
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify ownership or admin role
    if (booking.studentEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Cancel booking status
    booking.bookingStatus = 'cancelled';
    await booking.save();

    // Increment slot count back for the tutor
    const tutor = await Tutor.findById(booking.tutorId);
    if (tutor) {
      tutor.totalSlot += 1;
      await tutor.save();
    }

    res.json(booking);
  } catch (error) {
    console.error('Cancel Booking Error:', error);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
});

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized, admin access required' });
  }

  try {
    const bookings = await Booking.find({});
    res.json(bookings);
  } catch (error) {
    console.error('Fetch All Bookings Error:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
});

export default router;
