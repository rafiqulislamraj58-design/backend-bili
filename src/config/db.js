import mongoose from 'mongoose';
import env from './env.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log('MongoDB connected successfully via Mongoose.');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};