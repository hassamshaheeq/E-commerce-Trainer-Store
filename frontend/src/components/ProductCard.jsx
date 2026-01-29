import { Link } from 'react-router-dom';

const ProductCard = ({ product, variant = 'standard' }) => {
    const isOverlayVariant = variant === 'featured' || variant === 'tall';
    const isWideVariant = variant === 'wide';

    // Dynamic classes based on variant
    const containerClasses = `group relative block h-full w-full overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200 border border-gray-200 hover:border-gray-300 ${isWideVariant ? 'flex flex-row bg-white' : 'flex flex-col bg-white'
        }`;

    const imageContainerClasses = `relative overflow-hidden ${isOverlayVariant ? 'absolute inset-0 h-full w-full' :
            isWideVariant ? 'w-1/2 h-full' :
                'w-full aspect-[4/5]'
        }`;

    const contentClasses = `relative z-10 flex flex-col justify-end transition-all duration-300 ${isOverlayVariant ? 'h-full p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90' :
            isWideVariant ? 'w-1/2 p-6 justify-center' :
                'p-5 flex-1'
        }`;

    return (
        <Link to={`/product/${product._id}`} className={containerClasses}>
            {/* Image Section */}
            <div className={imageContainerClasses}>
                <img
                    src={product.images[0]}
                    alt={product.title}
                    className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOverlayVariant ? '' : ''
                        }`}
                />

                {/* Overlay for non-overlay variants (standard/wide) to add depth */}
                {!isOverlayVariant && (
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                    {product.featured && (
                        <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Featured
                        </div>
                    )}
                    {product.totalStock === 0 && (
                        <div className="bg-white/90 backdrop-blur-sm text-black px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                            Out of Stock
                        </div>
                    )}
                </div>

                {/* Quick View Button (Hidden on mobile, visible on hover) */}
                <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 ${isOverlayVariant ? 'mb-12' : ''}`}>
                    <div className="bg-white text-black px-6 py-3 rounded-full text-sm font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-100">
                        View Details
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className={contentClasses}>
                <div className="space-y-2">
                    {/* Brand & Rating */}
                    <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold uppercase tracking-widest ${isOverlayVariant ? 'text-gray-300' : 'text-gray-500'}`}>
                            {product.brand}
                        </p>
                        {product.rating > 0 && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isOverlayVariant ? 'bg-white/20 backdrop-blur-sm' : 'bg-gray-100'}`}>
                                <svg className={`w-3 h-3 ${isOverlayVariant ? 'text-yellow-400' : 'text-yellow-500'} fill-current`} viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className={`text-xs font-bold ${isOverlayVariant ? 'text-white' : 'text-gray-900'}`}>{product.rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className={`font-bold leading-tight transition-colors duration-300 ${variant === 'featured' ? 'text-3xl text-white mb-2' :
                            variant === 'tall' ? 'text-2xl text-white' :
                                'text-lg text-gray-900 group-hover:text-gray-700 line-clamp-2'
                        }`}>
                        {product.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className={`font-extrabold ${isOverlayVariant ? 'text-white' : 'text-gray-900'
                            } ${variant === 'featured' ? 'text-3xl' : 'text-2xl'}`}>
                            ${product.price}
                        </span>
                        <span className={`text-sm line-through ${isOverlayVariant ? 'text-gray-400' : 'text-gray-400'}`}>
                            ${(product.oldPrice || product.price * 1.3).toFixed(2)}
                        </span>
                    </div>

                    {/* Sizes */}
                    {!isOverlayVariant && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 mt-2">
                            {product.sizes.slice(0, isWideVariant ? 6 : 4).map((size, index) => (
                                <span
                                    key={index}
                                    className={`text-[10px] px-2 py-1 rounded-md font-semibold ${size.stock > 0
                                            ? 'bg-gray-100 text-gray-900 border border-gray-200'
                                            : 'bg-gray-50 text-gray-400 border border-gray-100 line-through'
                                        }`}
                                >
                                    {size.size}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
