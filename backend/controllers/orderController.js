import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { generateVerificationToken, generateQRCode, createVerificationUrl } from '../utils/qrCodeService.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, totalAmount } = req.body;

        // Validate stock for all items
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.product} not found`
                });
            }

            const sizeInfo = product.sizes.find(s => s.size === item.size);
            if (!sizeInfo || sizeInfo.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.title} - Size ${item.size}`
                });
            }
        }

        // Generate verification token and order number
        const verificationToken = generateVerificationToken();
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items,
            shippingAddress,
            totalAmount,
            paymentMethod: 'Cash on Delivery',
            verificationToken,
            orderNumber
        });

        // Update stock
        for (const item of items) {
            const product = await Product.findById(item.product);
            const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
            product.sizes[sizeIndex].stock -= item.quantity;
            await product.save();
        }

        // Clear user's cart
        await Cart.findOneAndUpdate(
            { user: req.user.id },
            { items: [] }
        );

        // Populate user data for email
        await order.populate('user', 'name email');

        // Generate QR code with verification URL
        const verificationUrl = createVerificationUrl(verificationToken);
        const qrCodeDataUrl = await generateQRCode(verificationUrl);

        // Send confirmation email with QR code (don't wait for it)
        sendOrderConfirmationEmail(order, qrCodeDataUrl).catch(err => {
            console.error('Failed to send confirmation email:', err);
        });

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product')
            .sort({ orderDate: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user owns this order or is admin
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        let query = {};
        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('items.product')
            .sort({ orderDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            count: orders.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.status = status;

        // Set delivery date if status is delivered
        if (status === 'delivered') {
            order.deliveryDate = Date.now();
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
export const getOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const processingOrders = await Order.countDocuments({ status: 'processing' });
        const shippedOrders = await Order.countDocuments({ status: 'shipped' });
        const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
        const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

        // Calculate total revenue
        const revenueData = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                pendingOrders,
                processingOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,
                totalRevenue
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

// @desc    Delete order (Admin)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        await order.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Order removed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
