import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const Checkout = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phone: ''
    });

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart');
            if (!response.data.data.items || response.data.data.items.length === 0) {
                navigate('/cart');
                return;
            }
            setCart(response.data.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const calculateTotal = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const orderData = {
                items: cart.items.map(item => ({
                    product: item.product._id,
                    title: item.product.title,
                    quantity: item.quantity,
                    size: item.size,
                    price: item.price,
                    image: item.product.images[0]
                })),
                shippingAddress: formData,
                totalAmount: calculateTotal()
            };

            await api.post('/orders', orderData);
            navigate('/orders');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipping Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="Full Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="bg-gray-50 border-gray-300 text-gray-900"
                                />

                                <Input
                                    label="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    placeholder="123 Main St, Apt 4B"
                                    className="bg-gray-50 border-gray-300 text-gray-900"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        placeholder="New York"
                                        className="bg-gray-50 border-gray-300 text-gray-900"
                                    />

                                    <Input
                                        label="State/Province"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                        placeholder="NY"
                                        className="bg-gray-50 border-gray-300 text-gray-900"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Postal Code"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        required
                                        placeholder="10001"
                                        className="bg-gray-50 border-gray-300 text-gray-900"
                                    />

                                    <Input
                                        label="Country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                        placeholder="United States"
                                        className="bg-gray-50 border-gray-300 text-gray-900"
                                    />
                                </div>

                                <Input
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+1 (555) 123-4567"
                                    className="bg-gray-50 border-gray-300 text-gray-900"
                                />

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                                    <div className="flex items-start">
                                        <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <h3 className="font-semibold text-blue-900 mb-1">Payment Method</h3>
                                            <p className="text-blue-800 text-sm">Cash on Delivery - Pay when you receive your order</p>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" variant="primary" disabled={submitting} className="w-full mt-6 bg-black text-white hover:bg-gray-800">
                                    {submitting ? 'Placing Order...' : 'Place Order'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {cart?.items.map((item) => (
                                    <div key={item._id} className="flex items-center space-x-3">
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.title}
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-gray-900">{item.product.title}</p>
                                            <p className="text-xs text-gray-500">Size: {item.size} × {item.quantity}</p>
                                        </div>
                                        <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold text-gray-900">${calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold text-green-600">FREE</span>
                                </div>
                                <div className="border-t border-gray-100 pt-2 flex justify-between text-lg">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-black">${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
