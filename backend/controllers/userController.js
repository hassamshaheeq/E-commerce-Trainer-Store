import User from '../models/User.js';

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -twoFactorSecret');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get user statistics (Admin)
// @route   GET /api/users/stats
// @access  Private/Admin
export const getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const regularUsers = await User.countDocuments({ role: 'user' });
        const verifiedUsers = await User.countDocuments({ isVerified: true });
        const twoFactorEnabled = await User.countDocuments({ twoFactorEnabled: true });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                adminUsers,
                regularUsers,
                verifiedUsers,
                twoFactorEnabled
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
