import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductListing = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');

    useEffect(() => {
        fetchProducts();
    }, [category, sort]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/products?category=${category}&sort=${sort}`);
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
    );

    const categoryTitles = {
        men: "Men's Shoes",
        women: "Women's Shoes",
        children: "Children's Shoes",
        latest: 'Latest Arrivals'
    };

    const categoryDescriptions = {
        men: "Discover premium footwear crafted for modern men",
        women: "Elegant and stylish shoes for every occasion",
        children: "Comfortable and playful shoes for active kids",
        latest: 'Browse the newest additions to our collection'
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-100 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Background Effect */}
                <div className="mb-12 relative">
                    <h1 className="mb-3 animate-fade-in">
                        {categoryTitles[category] || 'Products'}
                    </h1>
                    <p className="text-gray-500 text-lg">
                        {categoryDescriptions[category] || `Discover our collection of ${filteredProducts.length} premium shoes`}
                    </p>
                    <div className="mt-4 h-1 w-24 bg-black rounded-full"></div>
                </div>

                {/* Filters - Enhanced Design */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name or brand..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="relative">
                            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                            </svg>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all appearance-none cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Products Masonry Grid - Unique Aesthetic Layout */}
                {filteredProducts.length > 0 ? (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-500">
                                <span className="text-black font-bold">{filteredProducts.length}</span> products found
                            </p>
                        </div>
                        {/* Masonry Grid with Dynamic Sizing */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[320px] gap-4">
                            {filteredProducts.map((product, index) => {
                                // Pattern-based sizing: Creates a beautiful, asymmetric layout
                                const pattern = index % 8;
                                let gridClass = '';

                                switch (pattern) {
                                    case 0: // Large featured
                                        gridClass = 'col-span-2 row-span-2 md:col-span-2 md:row-span-2';
                                        break;
                                    case 1: // Standard
                                        gridClass = 'col-span-1 row-span-1';
                                        break;
                                    case 2: // Wide
                                        gridClass = 'col-span-2 row-span-1 md:col-span-2';
                                        break;
                                    case 3: // Tall
                                        gridClass = 'col-span-1 row-span-2';
                                        break;
                                    case 4: // Standard
                                        gridClass = 'col-span-1 row-span-1';
                                        break;
                                    case 5: // Wide
                                        gridClass = 'col-span-2 row-span-1 md:col-span-2';
                                        break;
                                    case 6: // Large
                                        gridClass = 'col-span-2 row-span-2 md:col-span-2 md:row-span-2';
                                        break;
                                    case 7: // Tall
                                        gridClass = 'col-span-1 row-span-2';
                                        break;
                                    default:
                                        gridClass = 'col-span-1 row-span-1';
                                }

                                return (
                                    <div
                                        key={product._id}
                                        className={`${gridClass} animate-fade-in group`}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <ProductCard
                                            product={product}
                                            variant={pattern === 0 || pattern === 6 ? 'featured' : pattern === 2 || pattern === 5 ? 'wide' : pattern === 3 || pattern === 7 ? 'tall' : 'standard'}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                            <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <h3 className="mb-3">No products found</h3>
                            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListing;
