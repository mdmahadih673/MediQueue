import express from 'express';
import Tutor from '../models/Tutor.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get featured tutors (ONLY 6 tutors using MongoDB $limit)
// @route   GET /api/tutors/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    // MongoDB limit operation
    const featuredTutors = await Tutor.find({}).sort({ createdAt: -1 }).limit(6);
    res.json(featuredTutors);
  } catch (error) {
    console.error('Fetch Featured Tutors Error:', error);
    res.status(500).json({ message: 'Server error fetching featured tutors' });
  }
});

// @desc    Get all tutors (with advanced search & filters)
// @route   GET /api/tutors
// @access  Public
router.get('/', async (req, res) => {
  const { searchText, subject, startDate, endDate, teachingMode, email } = req.query;

  let query = {};

  // Real-time case-insensitive search by tutorName (MongoDB $regex)
  if (searchText) {
    query.tutorName = {
      $regex: searchText,
      $options: 'i'
    };
  }

  // Filter by Subject
  if (subject && subject !== 'All') {
    query.subject = subject;
  }

  // Filter by logged-in user's email (My Tutors page)
  if (email) {
    query.createdByEmail = email;
  }

  // Filter by Teaching Mode
  if (teachingMode && teachingMode !== 'All') {
    query.teachingMode = teachingMode;
  }

  // Filter by sessionDate range ($gte and $lte)
  if (startDate || endDate) {
    query.sessionDate = {};
    if (startDate) {
      query.sessionDate.$gte = startDate;
    }
    if (endDate) {
      query.sessionDate.$lte = endDate;
    }
  }

  try {
    const tutors = await Tutor.find(query).sort({ createdAt: -1 });
    res.json(tutors);
  } catch (error) {
    console.error('Fetch Tutors Error:', error);
    res.status(500).json({ message: 'Server error fetching tutors' });
  }
});

// @desc    Get single tutor details
// @route   GET /api/tutors/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.id || req.params.id);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }
    res.json(tutor);
  } catch (error) {
    console.error('Fetch Single Tutor Error:', error);
    res.status(500).json({ message: 'Server error fetching tutor profile' });
  }
});

// @desc    Add a new tutor profile
// @route   POST /api/tutors
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only administrators are authorized to add new tutor profiles.' });
  }

  const {
    tutorName, tutorImage, subject, availableTime, availableDays,
    fee, totalSlot, sessionDate, institution, experience, location,
    teachingMode, description
  } = req.body;

  if (!tutorName || !subject || !fee || totalSlot === undefined || !sessionDate || !teachingMode) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  try {
    const tutor = await Tutor.create({
      tutorName,
      tutorImage: tutorImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutorName)}&background=a855f7&color=fff&size=400`,
      subject,
      availableTime,
      availableDays,
      fee: Number(fee),
      totalSlot: Number(totalSlot),
      sessionDate,
      institution,
      experience,
      location,
      teachingMode,
      description,
      createdByEmail: req.user.email,
      createdByName: req.user.name
    });

    res.status(201).json(tutor);
  } catch (error) {
    console.error('Add Tutor Error:', error);
    res.status(500).json({ message: 'Server error adding tutor' });
  }
});

// @desc    Update a tutor profile
// @route   PUT /api/tutors/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }

    // Verify creator ownership or admin role
    if (tutor.createdByEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to update this tutor profile' });
    }

    const {
      tutorName, subject, fee, totalSlot, availableTime, location,
      experience, teachingMode, sessionDate, availableDays, description
    } = req.body;

    tutor.tutorName = tutorName || tutor.tutorName;
    tutor.subject = subject || tutor.subject;
    tutor.fee = fee !== undefined ? Number(fee) : tutor.fee;
    tutor.totalSlot = totalSlot !== undefined ? Number(totalSlot) : tutor.totalSlot;
    tutor.availableTime = availableTime || tutor.availableTime;
    tutor.location = location || tutor.location;
    tutor.experience = experience || tutor.experience;
    tutor.teachingMode = teachingMode || tutor.teachingMode;
    tutor.sessionDate = sessionDate || tutor.sessionDate;
    tutor.availableDays = availableDays || tutor.availableDays;
    tutor.description = description || tutor.description;

    const updatedTutor = await tutor.save();
    res.json(updatedTutor);
  } catch (error) {
    console.error('Update Tutor Error:', error);
    res.status(500).json({ message: 'Server error updating tutor profile' });
  }
});

// @desc    Delete a tutor profile
// @route   DELETE /api/tutors/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }

    // Verify ownership or admin role
    if (tutor.createdByEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to delete this tutor profile' });
    }

    await tutor.deleteOne();
    res.json({ message: 'Tutor profile removed successfully' });
  } catch (error) {
    console.error('Delete Tutor Error:', error);
    res.status(500).json({ message: 'Server error removing tutor profile' });
  }
});

export default router;
