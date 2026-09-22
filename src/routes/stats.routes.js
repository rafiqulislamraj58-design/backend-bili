import express from 'express';
import {
  getAdminStats,
  getLibrarianStats,
  getUserStats,
} from '../controllers/stats.controller.js';
import { verifyToken, verifyAdmin, verifyLibrarian } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/admin', verifyToken, verifyAdmin, getAdminStats);
router.get('/librarian', verifyToken, verifyLibrarian, getLibrarianStats);
router.get('/user', verifyToken, getUserStats);

export default router;