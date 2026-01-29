import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageGallery from '../components/ImageGallery';
import BarcodeDisplay from '../components/BarcodeDisplay';
import RelatedProducts from '../components/RelatedProducts';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data.data);
            // Set first available size as default
            const availableSize = response.data.data.sizes.find(s => s.stock > 0);
            if (availableSize) {
                setSelectedSize(availableSize.size);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!selectedSize) {
            setMessage({ type: 'error', text: 'Please select a size' });
            return;
        }

        setAddingToCart(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/cart', {
                productId: product._id,
                quantity,
                size: selectedSize
            });
            setMessage({ type: 'success', text: 'Added to cart successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add to cart' });
        } finally {
            setAddingToCart(false);
        }
    };

    const selectedSizeInfo = product?.sizes.find(s => s.size === selectedSize);

    if (loading) return <LoadingSpinner />;
    if (!product) return <div className="text-center py-12">Product not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Images */}
                        <div className="p-8">
                            <ImageGallery images={product.images} productName={product.title} />
                        </div>

                        {/* Details */}
                        <div className="p-8">
                            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{product.brand}</p>
                            <h1 className="mb-3">{product.title}</h1>

                            {/* Barcode - Inline below title */}
                            <div className="mb-4">
                                <BarcodeDisplay productId={product._id} />
                            </div>

                            {product.rating > 0 && (
                                <div className="flex items-center mb-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="ml-2 text-gray-500">({product.numReviews} reviews)</span>
                                </div>
                            )}

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-black">${product.price}</span>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600">{product.description}</p>
                            </div>

                            {/* Size Selection */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Select Size</h3>
                                <div className="grid grid-cols-5 gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size.size}
                                            onClick={() => setSelectedSize(size.size)}
                                            disabled={size.stock === 0}
                                            className={`py-3 rounded-lg font-semibold transition-all ${selectedSize === size.size
                                                ? 'bg-black text-white'
                                                : size.stock > 0
                                                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                                    : 'bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                                                }`}
                                        >
                                            {size.size}
                                        </button>
                                    ))}
                                </div>
                                {selectedSizeInfo && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        {selectedSizeInfo.stock} in stock
                                    </p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-900"
                                    >
                                        -
                                    </button>
                                    <span className="text-xl font-semibold text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(selectedSizeInfo?.stock || 1, quantity + 1))}
                                        className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-900"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {message.text && (
                                <div className={`mb-4 px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="flex space-x-4">
                                <Button
                                    variant="primary"
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || product.totalStock === 0 || !selectedSize}
                                    className="flex-1 bg-black hover:bg-gray-800 text-white"
                                >
                                    {addingToCart ? 'Adding...' : product.totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </Button>
                                <Button variant="outline" onClick={() => navigate(-1)} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                                    Back
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Related Products Section */}
                    <div className="p-8 border-t border-gray-100">
                        <RelatedProducts
                            currentProductId={product._id}
                            category={product.category}
                            brand={product.brand}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
