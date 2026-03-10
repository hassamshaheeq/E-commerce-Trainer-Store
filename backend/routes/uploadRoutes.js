import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Upload product images
// @route   POST /api/upload/products
// @access  Private/Admin
router.post('/products', protect, authorize('admin'), upload.array('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please upload at least one image'
            });
        }

        // Return the file paths
        const imagePaths = req.files.map(file => `/uploads/products/${file.filename}`);

        res.status(200).json({
            success: true,
            message: 'Images uploaded successfully',
            data: imagePaths
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading images',
            error: error.message
        });
    }
});

// @desc    Upload hero images
// @route   POST /api/upload/hero
// @access  Private/Admin
router.post('/hero', protect, authorize('admin'), upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please upload at least one image'
            });
        }

        // Return the file paths
        const imagePaths = req.files.map(file => `/uploads/hero/${file.filename}`);

        res.status(200).json({
            success: true,
            message: 'Images uploaded successfully',
            data: imagePaths
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading images',
            error: error.message
        });
    }
});

export default router;
