import Stripe from 'stripe';
import env from '../config/env.js';
import { Delivery } from '../models/Delivery.model.js';
import { Book } from '../models/Book.model.js';

const stripe = new Stripe(env.stripeSecretKey);

export const createPaymentIntent = async (req, res) => {
  try {
    const { deliveryFee } = req.body;

    if (!deliveryFee || deliveryFee <= 0) {
      return res.status(400).json({ message: 'A valid delivery fee is required' });
    }

    const amount = Math.round(Number(deliveryFee) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment intent', error: error.message });
  }
};

export const createDeliveryOrder = async (req, res) => {
  try {
    const { bookId, deliveryFee, transactionId } = req.body;
    const userEmail = req.user.email;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.isAvailable) {
      return res.status(400).json({ message: 'The book is currently unavailable' });
    }

    if (book.librarianEmail === userEmail) {
      return res.status(400).json({ message: 'You cannot order your own book' });
    }

    const delivery = await Delivery.create({
      bookId,
      bookTitle: book.title,
      userEmail,
      librarianEmail: book.librarianEmail,
      deliveryFee: Number(deliveryFee),
      transactionId,
      paymentStatus: 'paid',
      deliveryStatus: 'Pending',
    });

    book.isAvailable = false;
    await book.save();

    res.status(201).json({
      success: true,
      message: 'Delivery order placed successfully',
      data: delivery,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create delivery order', error: error.message });
  }
};

export const getMyDeliveries = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const deliveries = await Delivery.find({ userEmail }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: deliveries });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch delivery history', error: error.message });
  }
};

export const getLibrarianDeliveries = async (req, res) => {
  try {
    const librarianEmail = req.user.email;
    const deliveries = await Delivery.find({ librarianEmail }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: deliveries });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load delivery records', error: error.message });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const librarianEmail = req.user.email;

    if (!['Pending', 'Dispatched', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const delivery = await Delivery.findOne({ _id: id, librarianEmail });
    if (!delivery) {
      return res.status(404).json({ message: 'Order not found or unauthorized access' });
    }

    delivery.deliveryStatus = status;
    await delivery.save();

    res.status(200).json({
      success: true,
      message: `Delivery status updated to '${status}'`,
      data: delivery,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update delivery status', error: error.message });
  }
};

export const getAllTransactionsAdmin = async (req, res) => {
  try {
    const transactions = await Delivery.find()
      .select('transactionId userEmail librarianEmail deliveryFee createdAt paymentStatus')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
};