import { User } from '../models/User.model.js';
import { Book } from '../models/Book.model.js';
import { Delivery } from '../models/Delivery.model.js';
import { Review } from '../models/Review.model.js';

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalDeliveries = await Delivery.countDocuments();

    const revenueResult = await Delivery.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$deliveryFee' } } },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const categoryStats = await Book.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);

    const deliveryStatusStats = await Delivery.aggregate([
      { $group: { _id: '$deliveryStatus', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBooks,
        totalDeliveries,
        totalRevenue,
        categoryStats,
        deliveryStatusStats,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load admin stats.', error: error.message });
  }
};

export const getLibrarianStats = async (req, res) => {
  try {
    const librarianEmail = req.user.email;

    const totalMyBooks = await Book.countDocuments({ librarianEmail });
    const pendingBooks = await Book.countDocuments({ librarianEmail, status: 'Pending Approval' });
    const publishedBooks = await Book.countDocuments({ librarianEmail, status: 'Published' });
    const totalOrders = await Delivery.countDocuments({ librarianEmail });

    const earningsResult = await Delivery.aggregate([
      { $match: { librarianEmail } },
      { $group: { _id: null, totalEarnings: { $sum: '$deliveryFee' } } },
    ]);
    const totalEarnings = earningsResult[0]?.totalEarnings || 0;

    res.status(200).json({
      success: true,
      data: {
        totalMyBooks,
        pendingBooks,
        publishedBooks,
        totalOrders,
        totalEarnings,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load librarian stats.', error: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userEmail = req.user.email;

    const totalOrders = await Delivery.countDocuments({ userEmail });
    const activeOrders = await Delivery.countDocuments({
      userEmail,
      deliveryStatus: { $in: ['Pending', 'Dispatched'] },
    });
    const totalReviews = await Review.countDocuments({ userEmail });

    const spentResult = await Delivery.aggregate([
      { $match: { userEmail } },
      { $group: { _id: null, totalSpent: { $sum: '$deliveryFee' } } },
    ]);
    const totalSpent = spentResult[0]?.totalSpent || 0;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        activeOrders,
        totalReviews,
        totalSpent,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load user stats.', error: error.message }); 
  }
};