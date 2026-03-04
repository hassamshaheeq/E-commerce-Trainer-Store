import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
// @access  Private/Admin
export const getAnalyticsOverview = async (req, res) => {
    try {
        // Get date range (default to last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        // Total statistics
        const [totalOrders, totalUsers, totalProducts, orders] = await Promise.all([
            Order.countDocuments(),
            User.countDocuments(),
            Product.countDocuments(),
            Order.find()
        ]);

        // Calculate total revenue
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Order status breakdown
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Sales trend (last 30 days)
        const salesTrend = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    sales: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Top selling products
        const topProducts = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $project: {
                    name: '$productDetails.title',
                    totalSold: 1,
                    revenue: 1,
                    image: { $arrayElemAt: ['$productDetails.images', 0] }
                }
            }
        ]);

        // Category distribution
        const categoryDistribution = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        // User growth (last 30 days)
        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Recent orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email');

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalOrders,
                    totalRevenue,
                    totalUsers,
                    totalProducts,
                    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
                },
                ordersByStatus,
                salesTrend,
                topProducts,
                categoryDistribution,
                userGrowth,
                recentOrders
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics data',
            error: error.message
        });
    }
};
