import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/user.controller.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.middleware.js';
const router = express.Router();
router.get('/', verifyToken, verifyAdmin, getAllUsers);
router.patch('/:id/role', verifyToken, verifyAdmin, updateUserRole);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

export default router;