import express from 'express';
import {
  addReview,
  getBookReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} from '../controllers/review.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/book/:bookId', getBookReviews);

router.post('/', verifyToken, addReview);
router.get('/my-reviews', verifyToken, getMyReviews);
router.patch('/:id', verifyToken, updateReview);
router.delete('/:id', verifyToken, deleteReview);

export default router;