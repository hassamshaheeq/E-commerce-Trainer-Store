import Order from '../models/Order.js';

// @desc    Verify product authenticity
// @route   GET /api/orders/verify/:token
// @access  Public
export const verifyProduct = async (req, res) => {
    try {
        const { token } = req.params;

        const order = await Order.findOne({ verificationToken: token })
            .populate('user', 'name email')
            .populate('items.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Invalid verification token'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                orderNumber: order.orderNumber,
                orderDate: order.orderDate,
                status: order.status,
                items: order.items.map(item => ({
                    title: item.title,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image,
                    product: {
                        brand: item.product?.brand,
                        category: item.product?.category
                    }
                })),
                totalAmount: order.totalAmount,
                verified: true,
                message: 'This product is authentic and verified by ShoeStore'
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
