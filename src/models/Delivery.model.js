import { Schema, model } from 'mongoose';

const deliverySchema = new Schema(
  {
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    bookTitle: { type: String, required: true },
    userEmail: { type: String, required: true },
    librarianEmail: { type: String, required: true },
    deliveryFee: { type: Number, required: true },
    transactionId: { type: String, required: true },
    paymentStatus: { type: String, default: 'paid' },
    deliveryStatus: {
      type: String,
      enum: ['Pending', 'Dispatched', 'Delivered'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export const Delivery = model('Delivery', deliverySchema);