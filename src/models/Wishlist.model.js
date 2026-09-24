import { Schema, model } from 'mongoose';

const wishlistSchema = new Schema(
  {
    userEmail: { type: String, required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  },
  { timestamps: true }
);


wishlistSchema.index({ userEmail: 1, bookId: 1 }, { unique: true });

export const Wishlist = model('Wishlist', wishlistSchema);