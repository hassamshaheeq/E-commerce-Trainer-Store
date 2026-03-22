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
        <div className="min-h-screen bg-black pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-zinc-900/50 backdrop-blur-3xl rounded-[40px] shadow-2xl overflow-hidden border border-white/5 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                        {/* Images */}
                        <div className="p-8">
                            <ImageGallery images={product.images} productName={product.title} />
                        </div>

                        {/* Details */}
                        <div className="p-10 lg:p-16 flex flex-col justify-center">
                            <p className="text-primary-400 font-black uppercase tracking-[0.2em] text-sm mb-4">{product.brand}</p>
                            <h1 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter mb-6 leading-none">{product.title}</h1>

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
                                    <span className="ml-3 text-zinc-500 font-bold uppercase tracking-widest text-xs">({product.numReviews} reviews)</span>
                                </div>
                            )}

                            <div className="mb-10">
                                <span className="text-5xl font-black text-white tracking-tighter">£{product.price}</span>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-zinc-500 font-black uppercase tracking-widest text-sm mb-4">Description</h3>
                                <p className="text-zinc-400 text-lg leading-relaxed font-medium">{product.description}</p>
                            </div>

                            {/* Size Selection */}
                            <div className="mb-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-zinc-500 font-black uppercase tracking-widest text-sm">Select Size</h3>
                                    {selectedSize && (
                                        <span className="text-primary-400 font-bold">Selected: {selectedSize}</span>
                                    )}
                                </div>
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size.size}
                                            onClick={() => setSelectedSize(size.size)}
                                            disabled={size.stock === 0}
                                            className={`py-4 rounded-xl font-black transition-all duration-300 border-2 ${selectedSize === size.size
                                                ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/50 scale-105'
                                                : size.stock > 0
                                                    ? 'bg-zinc-800/50 border-white/5 text-zinc-400 hover:border-primary-500/50 hover:text-white'
                                                    : 'bg-zinc-900 border-transparent text-zinc-700 cursor-not-allowed line-through'
                                                }`}
                                        >
                                            {size.size}
                                        </button>
                                    ))}
                                </div>
                                {selectedSizeInfo && (
                                    <p className="text-sm text-zinc-500 mt-3 font-bold uppercase tracking-widest px-1">
                                        Only {selectedSizeInfo.stock} units left in stock
                                    </p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div className="mb-10">
                                <h3 className="text-zinc-500 font-black uppercase tracking-widest text-sm mb-4">Quantity</h3>
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center bg-zinc-800/50 rounded-2xl p-1 border border-white/5">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition-colors"
                                        >
                                            <span className="text-2xl">-</span>
                                        </button>
                                        <span className="w-12 text-center text-xl font-black text-white">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(selectedSizeInfo?.stock || 1, quantity + 1))}
                                            className="w-12 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition-colors"
                                        >
                                            <span className="text-2xl">+</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {message.text && (
                                <div className={`mb-8 p-6 rounded-3xl font-bold uppercase tracking-widest text-xs border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                <Button
                                    variant="primary"
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || product.totalStock === 0 || !selectedSize}
                                    className="flex-1 py-6 text-xl"
                                >
                                    {addingToCart ? 'Adding...' : product.totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </Button>
                                <Button variant="outline" onClick={() => navigate(-1)} className="px-8 border-white/10 text-zinc-400 hover:bg-white/5 uppercase tracking-widest font-black text-xs">
                                    Go Back
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Related Products Section */}
                    <div className="p-10 lg:p-16 border-t border-white/5 bg-black/20">
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
