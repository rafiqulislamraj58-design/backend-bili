import mongoose from 'mongoose';
import env from './env.js';

const uri = `mongodb+srv://${env.dbUser}:${env.dbPass}@cluster0.mongodb.net/biblioDropDB?retryWrites=true&w=majority`;

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully via Mongoose.');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};