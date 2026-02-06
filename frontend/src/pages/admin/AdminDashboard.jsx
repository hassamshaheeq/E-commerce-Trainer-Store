import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [orderStats, setOrderStats] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [orders, users] = await Promise.all([
                api.get('/orders/admin/stats'),
                api.get('/users/stats')
            ]);

            setOrderStats(orders.data.data);
            setUserStats(users.data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    const statCards = [
        { label: 'Total Orders', value: orderStats?.totalOrders || 0, color: 'from-blue-600 to-blue-700', icon: '📦' },
        { label: 'Total Revenue', value: `$${orderStats?.totalRevenue?.toFixed(2) || 0}`, color: 'from-green-600 to-green-700', icon: '💰' },
        { label: 'Total Users', value: userStats?.totalUsers || 0, color: 'from-purple-600 to-purple-700', icon: '👥' },
        { label: 'Pending Orders', value: orderStats?.pendingOrders || 0, color: 'from-orange-600 to-orange-700', icon: '⏳' }
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="gradient-text">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to your admin panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className={`bg-gradient-to-r ${stat.color} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm">{stat.label}</p>
                                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                            </div>
                            <div className="text-4xl">{stat.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Order Status Breakdown</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-3xl font-bold text-yellow-600">{orderStats?.pendingOrders || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">Pending</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">{orderStats?.processingOrders || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">Processing</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-3xl font-bold text-purple-600">{orderStats?.shippedOrders || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">Shipped</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">{orderStats?.deliveredOrders || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">Delivered</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-3xl font-bold text-red-600">{orderStats?.cancelledOrders || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">Cancelled</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
