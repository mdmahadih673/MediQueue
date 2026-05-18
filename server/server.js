import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Configure CORS
app.use(cors({
  origin: '*', // Allow all origins for local development and testing
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

// Body parser (Increased limit to support base64 file uploads)
app.use(express.json({ limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'MediQueue MERN Backend API is running! 🚀' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({ message: 'An unhandled server error occurred' });
});

// Set port
const PORT = process.env.PORT || 5000;

// Start listening
app.listen(PORT, () => {
  console.log(`⚡ Server running on port http://localhost:${PORT}`);
});
