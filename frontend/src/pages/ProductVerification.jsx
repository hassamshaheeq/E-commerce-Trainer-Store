import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductVerification = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [verification, setVerification] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        verifyProduct();
    }, [token]);

    const verifyProduct = async () => {
        try {
            const response = await api.get(`/orders/verify/${token}`);
            setVerification(response.data.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid verification code');
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {error ? (
                    <div className="bg-gray-800 rounded-2xl shadow-2xl p-12 text-center border border-gray-700">
                        <div className="w-24 h-24 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-red-400 mb-4">Verification Failed</h1>
                        <p className="text-gray-400 text-lg">{error}</p>
                        <p className="text-gray-500 mt-4">This QR code may be invalid or expired.</p>
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2">✓ AUTHENTIC PRODUCT</h1>
                            <p className="text-green-100 text-lg">Verified by ShoeStore</p>
                        </div>

                        {/* Order Details */}
                        <div className="p-8">
                            <div className="bg-gray-900 rounded-xl p-6 mb-6">
                                <h2 className="text-2xl font-bold text-white mb-4">Order Information</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-400 text-sm">Order Number</p>
                                        <p className="text-white font-semibold text-lg">{verification.orderNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Order Date</p>
                                        <p className="text-white font-semibold">{new Date(verification.orderDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${verification.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                                                verification.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                                                    verification.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {verification.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Total Amount</p>
                                        <p className="text-white font-bold text-xl">${verification.totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Products */}
                            <h3 className="text-xl font-bold text-white mb-4">Verified Products</h3>
                            <div className="space-y-4">
                                {verification.items.map((item, index) => (
                                    <div key={index} className="bg-gray-900 rounded-xl p-6 flex items-center space-x-4">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                                            <p className="text-gray-400 text-sm">
                                                {item.product.brand} • {item.product.category}
                                            </p>
                                            <p className="text-gray-300 mt-1">
                                                Size: {item.size} | Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                                            <div className="mt-2 inline-flex items-center px-3 py-1 bg-green-500/20 rounded-full">
                                                <svg className="w-4 h-4 text-green-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-green-400 text-xs font-semibold">VERIFIED</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Authenticity Message */}
                            <div className="mt-8 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-2">Authenticity Guaranteed</h4>
                                        <p className="text-gray-300">
                                            This product has been verified as an authentic purchase from ShoeStore.
                                            The QR code contains a unique verification token that confirms the legitimacy of your order.
                                        </p>
                                        <p className="text-indigo-400 mt-2 font-semibold">
                                            ✓ Genuine Product • ✓ Verified Purchase • ✓ Quality Assured
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductVerification;
