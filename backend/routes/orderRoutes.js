import express from 'express';
import {
    createOrder,
    getUserOrders,
    getOrder,
    getAllOrders,
    updateOrderStatus,
    getOrderStats,
    deleteOrder
} from '../controllers/orderController.js';
import { verifyProduct } from '../controllers/verificationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateOrder } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public verification route
router.get('/verify/:token', verifyProduct);

router.use(protect); // All other order routes require authentication

// User routes
router.post('/', validateOrder, createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrder);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllOrders);
router.get('/admin/stats', authorize('admin'), getOrderStats);
router.put('/:id/status', authorize('admin'), updateOrderStatus);
router.delete('/:id', authorize('admin'), deleteOrder);

export default router;
