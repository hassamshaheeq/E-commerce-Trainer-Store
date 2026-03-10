import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getAnalyticsOverview } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/overview', protect, authorize('admin'), getAnalyticsOverview);

export default router;
