import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart');
            setCart(response.data.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        try {
            const response = await api.put(`/cart/${itemId}`, { quantity: newQuantity });
            setCart(response.data.data);
        } catch (error) {
            console.error('Error updating cart:', error);
            alert(error.response?.data?.message || 'Failed to update quantity');
        }
    };

    const removeItem = async (itemId) => {
        try {
            const response = await api.delete(`/cart/${itemId}`);
            setCart(response.data.data);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const calculateTotal = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                {!cart?.items || cart.items.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                        <p className="text-gray-500 mb-6">Add some products to get started!</p>
                        <Link to="/products/latest">
                            <Button variant="primary" className="bg-black text-white hover:bg-gray-800">Start Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item) => (
                                <div key={item._id} className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 border border-gray-200">
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.title}
                                        className="w-24 h-24 object-cover rounded-lg border border-gray-100"
                                    />

                                    <div className="flex-1">
                                        <Link to={`/product/${item.product._id}`} className="font-semibold text-lg text-gray-900 hover:text-gray-600">
                                            {item.product.title}
                                        </Link>
                                        <p className="text-gray-500 text-sm">{item.product.brand}</p>
                                        <p className="text-gray-600 mt-1">Size: {item.size}</p>
                                        <p className="text-black font-bold mt-1">${item.price}</p>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-900"
                                        >
                                            -
                                        </button>
                                        <span className="font-semibold text-gray-900 w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-900"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item._id)}
                                        className="text-red-500 hover:text-red-700 p-2"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold text-gray-900">${calculateTotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-semibold text-green-600">FREE</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3 flex justify-between text-lg">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="font-bold text-black">${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/checkout')}
                                    className="w-full mb-3 bg-black text-white hover:bg-gray-800"
                                >
                                    Proceed to Checkout
                                </Button>

                                <Link to="/products/latest">
                                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                                        Continue Shopping
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
