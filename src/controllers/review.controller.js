import { Review } from '../models/Review.model.js';
import { Delivery } from '../models/Delivery.model.js';


export const addReview = async (req, res) => {
  try {
    const { bookId, rating, comment, userName, userPhoto } = req.body;
    const userEmail = req.user.email;

    if (!bookId || !rating || !comment) {
      return res.status(400).json({ message: 'Book ID, rating, and comment are required.' });
    }
    const isDelivered = await Delivery.findOne({
      bookId,
      userEmail,
      deliveryStatus: 'Delivered',
    });

    if (!isDelivered) {
      return res.status(403).json({
        message: 'Unauthorized: You can only review books that have been successfully delivered.',
      });
    }
    const existingReview = await Review.findOne({ bookId, userEmail });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already submitted a review for this book.' });
    }

    const newReview = await Review.create({
      bookId,
      userEmail,
      userName: userName || req.user.name || 'Anonymous Reader',
      userPhoto: userPhoto || '',
      rating: Number(rating),
      comment,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add review.', error: error.message });
  }
};

export const getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;
    const reviews = await Review.find({ bookId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load reviews.', error: error.message });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const reviews = await Review.find({ userEmail })
      .populate('bookId', 'title coverImage author')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve review history.', error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userEmail = req.user.email;

    const review = await Review.findOneAndUpdate(
      { _id: id, userEmail },
      { rating: Number(rating), comment },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found or you are unauthorized.' });
    }

    res.status(200).json({
      success: true,
      message: 'Review updated successfully.',
      data: review,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update review.', error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.user.email;

    const review = await Review.findOneAndDelete({ _id: id, userEmail });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or you are unauthorized.' });
    }

    res.status(200).json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete review.', error: error.message });
  }
};