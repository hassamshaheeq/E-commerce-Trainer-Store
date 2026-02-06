import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const AdminAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/analytics/overview');
            setAnalyticsData(response.data.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!analyticsData) return <div className="text-center text-gray-600">No analytics data available</div>;

    const { summary, salesTrend, topProducts, categoryDistribution, ordersByStatus, userGrowth, recentOrders } = analyticsData;

    // Format data for charts
    const salesChartData = salesTrend.map(item => ({
        date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: item.sales,
        revenue: item.revenue.toFixed(2)
    }));

    const categoryChartData = categoryDistribution.map(item => ({
        name: item._id,
        value: item.count
    }));

    const statusChartData = ordersByStatus.map(item => ({
        name: item._id,
        value: item.count
    }));

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="gradient-text">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-2">Comprehensive store performance metrics</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Total Orders</p>
                            <p className="text-3xl font-bold mt-2">{summary.totalOrders}</p>
                        </div>
                        <div className="text-4xl">📦</div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">Total Revenue</p>
                            <p className="text-3xl font-bold mt-2">${summary.totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="text-4xl">💰</div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Total Users</p>
                            <p className="text-3xl font-bold mt-2">{summary.totalUsers}</p>
                        </div>
                        <div className="text-4xl">👥</div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm">Avg Order Value</p>
                            <p className="text-3xl font-bold mt-2">${summary.averageOrderValue.toFixed(2)}</p>
                        </div>
                        <div className="text-4xl">📊</div>
                    </div>
                </div>
            </div>

            {/* Charts Row 1 - Sales Trend */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Sales Trend (Last 30 Days)</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={salesChartData}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="sales" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Charts Row 2 - Revenue & Category Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">Revenue Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">Product Category Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={(entry) => `${entry.name} (${entry.value})`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 3 - Order Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Order Status Breakdown</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statusChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top Products Table */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Top Selling Products</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {topProducts.map((product, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-lg object-cover mr-3" src={product.image} alt={product.name} />
                                            <div className="font-medium text-gray-900">{product.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.totalSold}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">${product.revenue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">#{order._id.slice(-6)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.user?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">${order.totalAmount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
