import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    global.isMockDB = false;
  } catch (error) {
    console.warn(`⚠️ Local MongoDB connection failed: ${error.message}`);
    console.warn('🚀 Falling back to premium In-Memory Database Mode for full features! 🚀');
    global.isMockDB = true;
  }
};

export default connectDB;
