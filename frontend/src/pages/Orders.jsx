import { useState, useEffect } from 'react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold gradient-text mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="bg-gray-800 rounded-2xl shadow-2xl p-12 text-center border border-gray-700">
                        <svg className="w-24 h-24 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-2xl font-semibold text-gray-200 mb-2">No orders yet</h3>
                        <p className="text-gray-400">Start shopping to see your orders here!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm opacity-90">Order ID</p>
                                            <p className="font-semibold">{order._id}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm opacity-90">Order Date</p>
                                            <p className="font-semibold">{new Date(order.orderDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                        <span className="text-2xl font-bold text-primary-600">${order.totalAmount.toFixed(2)}</span>
                                    </div>

                                    <div className="space-y-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-4 border-t pt-4">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-white">{item.title}</p>
                                                    <p className="text-sm text-gray-400">Size: {item.size} × {item.quantity}</p>
                                                </div>
                                                <span className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-4 border-t">
                                        <h4 className="font-semibold text-white mb-2">Shipping Address</h4>
                                        <p className="text-gray-300 text-sm">
                                            {order.shippingAddress.fullName}<br />
                                            {order.shippingAddress.address}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                                            {order.shippingAddress.country}<br />
                                            Phone: {order.shippingAddress.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
