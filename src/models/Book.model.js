import { Schema, model } from 'mongoose';

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    deliveryFee: { type: Number, required: true },
    coverImage: { type: String, required: true },
    librarianEmail: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending Approval', 'Published', 'Unpublished'],
      default: 'Pending Approval', 
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Book = model('Book', bookSchema);