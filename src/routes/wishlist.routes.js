import express from 'express';
import {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
} from '../controllers/wishlist.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', verifyToken, addToWishlist);
router.get('/my-wishlist', verifyToken, getMyWishlist);
router.delete('/:id', verifyToken, removeFromWishlist);

export default router;