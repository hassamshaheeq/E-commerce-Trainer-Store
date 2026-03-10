import express from 'express';
import Hero from '../models/Hero.js';
import HeroSettings from '../models/HeroSettings.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get hero settings and active slides
// @route   GET /api/hero
// @access  Public
router.get('/', async (req, res) => {
    try {
        let settings = await HeroSettings.findOne();
        if (!settings) {
            settings = await HeroSettings.create({});
        }

        const slides = await Hero.find({ isActive: true }).sort({ order: 1 });

        res.json({
            success: true,
            data: {
                settings,
                slides
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching hero data',
            error: error.message
        });
    }
});

// @desc    Get all hero data (Admin)
// @route   GET /api/hero/admin
// @access  Private/Admin
router.get('/admin', protect, authorize('admin'), async (req, res) => {
    try {
        let settings = await HeroSettings.findOne();
        if (!settings) {
            settings = await HeroSettings.create({});
        }

        const slides = await Hero.find({}).sort({ order: 1 });

        res.json({
            success: true,
            data: {
                settings,
                slides
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching hero data',
            error: error.message
        });
    }
});

// @desc    Update hero settings
// @route   PUT /api/hero/settings
// @access  Private/Admin
router.put('/settings', protect, authorize('admin'), async (req, res) => {
    try {
        let settings = await HeroSettings.findOne();
        if (!settings) {
            settings = new HeroSettings();
        }

        settings.title = req.body.title || settings.title;
        settings.subtitle = req.body.subtitle || settings.subtitle;

        const updatedSettings = await settings.save();
        res.json({
            success: true,
            data: updatedSettings
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating settings',
            error: error.message
        });
    }
});

// @desc    Create new hero slides (Bulk)
// @route   POST /api/hero
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { images } = req.body; // Expecting array of image paths

        if (!images || !Array.isArray(images)) {
            return res.status(400).json({
                success: false,
                message: 'Images array is required'
            });
        }

        const createdSlides = await Promise.all(images.map(async (image, index) => {
            return await Hero.create({
                image,
                order: index, // Simple ordering
                isActive: true
            });
        }));

        res.status(201).json({
            success: true,
            data: createdSlides
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating hero slides',
            error: error.message
        });
    }
});

// @desc    Delete a hero slide
// @route   DELETE /api/hero/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const slide = await Hero.findById(req.params.id);

        if (slide) {
            await slide.deleteOne();
            res.json({
                success: true,
                message: 'Slide removed'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Slide not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting hero slide',
            error: error.message
        });
    }
});

export default router;
