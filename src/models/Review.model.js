import { Schema, model } from 'mongoose';

const reviewSchema = new Schema(
  {
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    userPhoto: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export const Review = model('Review', reviewSchema);