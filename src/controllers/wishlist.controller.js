import { Wishlist } from '../models/Wishlist.model.js';
import { Book } from '../models/Book.model.js';

export const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userEmail = req.user.email;

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const existingItem = await Wishlist.findOne({ userEmail, bookId });
    if (existingItem) {
      return res.status(400).json({ message: 'Book is already in the wishlist' });
    }

    const wishlistItem = await Wishlist.create({ userEmail, bookId });

    res.status(201).json({
      success: true,
      message: 'Book successfully added to wishlist',
      data: wishlistItem,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add book to wishlist', error: error.message });
  }
};


export const getMyWishlist = async (req, res) => {
  try {
    const userEmail = req.user.email;

    const wishlist = await Wishlist.find({ userEmail })
      .populate('bookId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load wishlist data', error: error.message });
  }
};


export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.user.email;

    const deletedItem = await Wishlist.findOneAndDelete({ _id: id, userEmail });

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found or unauthorized access' });
    }

    res.status(200).json({ success: true, message: 'Removed from wishlist successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item from wishlist', error: error.message });
  }
};