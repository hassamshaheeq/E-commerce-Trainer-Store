import express from 'express';
import { getAllUsers, getUserStats } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin')); // All user routes require admin access

router.get('/', getAllUsers);
router.get('/stats', getUserStats);

export default router;
