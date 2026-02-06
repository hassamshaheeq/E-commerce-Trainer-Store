import { useState, useEffect } from 'react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        try {
            const url = filter === 'all' ? '/orders/admin/all' : `/orders/admin/all?status=${filter}`;
            const response = await api.get(url);
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update order status');
        }
    };

    const handleDelete = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                await api.delete(`/orders/${orderId}`);
                fetchOrders();
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete order');
            }
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
        <div>
            <h1 className="gradient-text mb-8">Manage Orders</h1>

            <div className="mb-6">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="input-field max-w-xs"
                >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm opacity-90">Order ID</p>
                                    <p className="font-semibold">{order._id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm opacity-90">Customer</p>
                                    <p className="font-semibold">{order.user?.name || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm opacity-90">Date</p>
                                    <p className="font-semibold">{new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(order.status)}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-2xl font-bold text-primary-600">${order.totalAmount.toFixed(2)}</span>
                                    <button
                                        onClick={() => handleDelete(order._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Order"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4 border-t pt-3">
                                        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                                        <div className="flex-1">
                                            <p className="font-semibold">{item.title}</p>
                                            <p className="text-sm text-gray-500">Size: {item.size} × {item.quantity}</p>
                                        </div>
                                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Shipping Address</h4>
                                <p className="text-gray-600 text-sm">
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
        </div>
    );
};

export default AdminOrders;
