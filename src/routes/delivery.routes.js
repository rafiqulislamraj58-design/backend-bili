import express from 'express';
import {
  createPaymentIntent,
  createDeliveryOrder,
  getMyDeliveries,
  getLibrarianDeliveries,
  updateDeliveryStatus,
  getAllTransactionsAdmin,
} from '../controllers/delivery.controller.js';
import { verifyToken, verifyLibrarian, verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create-payment-intent', verifyToken, createPaymentIntent);
router.post('/order', verifyToken, createDeliveryOrder);
router.get('/my-orders', verifyToken, getMyDeliveries);

router.get('/librarian/orders', verifyToken, verifyLibrarian, getLibrarianDeliveries);
router.patch('/librarian/order-status/:id', verifyToken, verifyLibrarian, updateDeliveryStatus);

router.get('/admin/transactions', verifyToken, verifyAdmin, getAllTransactionsAdmin);

export default router;