import express from 'express';
import {
  getPublishedBooks,
  getFeaturedBooks,
  getBookById,
  addBook,
  getLibrarianBooks,
  updateLibrarianBookStatus,
  updateBook,
  deleteBook,
  getAdminApprovalQueue,
  approveBook,
  getAllBooksAdmin,
  adminUpdateBookStatus,
  adminDeleteBook,
} from '../controllers/book.controller.js';
import { verifyToken, verifyLibrarian, verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getPublishedBooks);
router.get('/featured', getFeaturedBooks);

router.post('/', verifyToken, verifyLibrarian, addBook);
router.get('/librarian/my-inventory', verifyToken, verifyLibrarian, getLibrarianBooks);
router.patch('/librarian/:id/status', verifyToken, verifyLibrarian, updateLibrarianBookStatus);
router.put('/librarian/:id', verifyToken, verifyLibrarian, updateBook);
router.delete('/librarian/:id', verifyToken, verifyLibrarian, deleteBook);


router.get('/admin/queue', verifyToken, verifyAdmin, getAdminApprovalQueue);
router.patch('/admin/:id/approve', verifyToken, verifyAdmin, approveBook);
router.get('/admin/all', verifyToken, verifyAdmin, getAllBooksAdmin);
router.patch('/admin/:id/status', verifyToken, verifyAdmin, adminUpdateBookStatus);
router.delete('/admin/:id', verifyToken, verifyAdmin, adminDeleteBook);


router.get('/:id', getBookById);

export default router;