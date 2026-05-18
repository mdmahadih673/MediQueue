import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (uid) => {
  return jwt.sign(
    { uid },
    process.env.JWT_SECRET || 'mediqueue_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user (local fallback)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, photoURL } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Create random UID if standard email registration
    const uid = `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const finalPhoto = photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=a855f7&color=fff&size=200`;

    const user = await User.create({
      uid,
      email,
      name,
      photoURL: finalPhoto,
      passwordHash
    });

    if (user) {
      res.status(201).json({
        uid: user.uid,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.email === 'mdmahadih673@gmail.com' ? 'admin' : (user.role || 'user'),
        token: generateToken(user.uid)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @desc    Authenticate user & get token (local fallback)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !user.passwordHash) {
      return res.status(400).json({ message: 'Invalid credentials. Please register first.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (isMatch) {
      res.json({
        uid: user.uid,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.email === 'mdmahadih673@gmail.com' ? 'admin' : (user.role || 'user'),
        token: generateToken(user.uid)
      });
    } else {
      res.status(400).json({ message: 'Incorrect password. Please try again.' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @desc    Sync Google / Firebase Login User & generate local JWT
// @route   POST /api/auth/sync
// @access  Public
router.post('/sync', async (req, res) => {
  const { uid, email, displayName, photoURL } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ message: 'Firebase UID and email are required' });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      // Update info if it changed
      user.name = displayName || user.name;
      user.photoURL = photoURL || user.photoURL;
      // Sync UID if it is different
      user.uid = uid;
      await user.save();
    } else {
      // Register new synced user
      const name = displayName || email.split('@')[0];
      const finalPhoto = photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=a855f7&color=fff&size=200`;
      
      user = await User.create({
        uid,
        email,
        name,
        photoURL: finalPhoto
      });
    }

    res.json({
      uid: user.uid,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      role: user.email === 'mdmahadih673@gmail.com' ? 'admin' : (user.role || 'user'),
      token: generateToken(user.uid)
    });
  } catch (error) {
    console.error('Auth Sync Error:', error);
    res.status(500).json({ message: 'Server error syncing user data' });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    uid: req.user.uid,
    name: req.user.name,
    email: req.user.email,
    photoURL: req.user.photoURL,
    role: req.user.role || 'user',
    createdAt: req.user.createdAt
  });
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
router.get('/users', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized, admin access required' });
  }

  try {
    let users;
    if (!global.isMockDB) {
      users = await User.find({}).sort({ createdAt: -1 });
    } else {
      users = await User.find({});
      // Sort mock users by createdAt descending
      users.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    res.json(users);
  } catch (error) {
    console.error('Fetch Users Error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

export default router;
