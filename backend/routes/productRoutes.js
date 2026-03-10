import express from 'express';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateProduct } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, authorize('admin'), validateProduct, createProduct);
router.put('/:id', protect, authorize('admin'), validateProduct, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
