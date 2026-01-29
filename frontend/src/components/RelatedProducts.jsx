import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const RelatedProducts = ({ currentProductId, category, brand }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        fetchRelatedProducts();
    }, [currentProductId, category]);

    const fetchRelatedProducts = async () => {
        try {
            setLoading(true);
            // Fetch products from the same category
            const response = await api.get(`/products?category=${category}`);

            // Filter out the current product and limit to 8 items
            const filtered = response.data.data
                .filter(product => product._id !== currentProductId)
                .slice(0, 8);

            setRelatedProducts(filtered);
        } catch (error) {
            console.error('Error fetching related products:', error);
        } finally {
            setLoading(false);
        }
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="py-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            </div>
        );
    }

    if (relatedProducts.length === 0) {
        return null; // Don't show section if no related products
    }

    return (
        <div className="py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">You May Also Like</h2>

                {/* Scroll Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                        aria-label="Scroll left"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                        aria-label="Scroll right"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {relatedProducts.map((product) => (
                    <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="flex-shrink-0 w-64 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-primary-600 transition-all group hover:shadow-xl hover:shadow-primary-600/20"
                    >
                        {/* Product Image */}
                        <div className="relative aspect-square overflow-hidden">
                            <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {product.totalStock === 0 && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm uppercase">Out of Stock</span>
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="p-4">
                            <p className="text-xs font-medium text-primary-400 uppercase tracking-wider mb-1">
                                {product.brand}
                            </p>
                            <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                                {product.title}
                            </h3>
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-white">${product.price}</span>
                                {product.rating > 0 && (
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                        <span className="text-sm text-gray-300">{product.rating.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* CSS for hiding scrollbar */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default RelatedProducts;
