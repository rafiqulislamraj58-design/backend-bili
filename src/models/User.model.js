import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    photoURL: { type: String, default: '' },
    role: {
      type: String,
      enum: ['user', 'librarian', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

export const User = model('User', userSchema);