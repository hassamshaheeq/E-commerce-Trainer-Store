import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const [featured, latest] = await Promise.all([
                api.get('/products?featured=true'),
                api.get('/products?category=latest&sort=newest')
            ]);

            setFeaturedProducts(featured.data.data.slice(0, 4));
            setLatestProducts(latest.data.data.slice(0, 8));
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black pt-16">
            {/* Hero Section */}
            {/* Hero Section */}
            <HeroCarousel />

            {/* Categories Section */}
            <section className="py-20 bg-black border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center mb-16 text-5xl font-black uppercase tracking-tighter text-white">
                        Shop by Category
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Men', category: 'men', image: '/images/hero/mens_shoes.png' },
                            { name: 'Women', category: 'women', image: '/images/hero/womens_shoes.png' },
                            { name: 'Children', category: 'children', image: '/images/hero/kids_shoes.png' }
                        ].map((cat) => (
                            <Link
                                key={cat.category}
                                to={`/products/${cat.category}`}
                                className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${cat.image})` }}
                                ></div>
                                {/* Dark Overlay for text readability */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all"></div>
                                {/* Category Name */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-white drop-shadow-2xl text-4xl md:text-5xl font-black uppercase tracking-tighter">{cat.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="py-20 bg-zinc-900/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-12 border-l-4 border-primary-600 pl-6">
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
                                Featured Products
                            </h2>
                            <Link to="/products/latest" className="text-primary-400 hover:text-white font-black tracking-widest text-sm flex items-center transition-colors uppercase">
                                View Full Collection
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Latest Arrivals */}
            {latestProducts.length > 0 && (
                <section className="py-20 bg-black border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-center mb-16 text-5xl font-black uppercase tracking-tighter text-white">
                            Latest Arrivals
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {latestProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="py-24 bg-zinc-900/50 backdrop-blur-3xl border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div className="text-center p-10 bg-black/40 rounded-3xl border border-white/5 hover:border-primary-500/30 transition-all duration-300 group">
                            <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-500/20 group-hover:scale-110 transition-transform">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="mb-4 font-black uppercase text-white leading-tight text-xl lg:text-2xl tracking-normal break-words px-4">Quality <br className="hidden md:block" /> Guaranteed</h3>
                            <p className="text-zinc-500 max-w-[200px] mx-auto">Premium materials and craftsmanship in every pair</p>
                        </div>

                        <div className="text-center p-10 bg-black/40 rounded-3xl border border-white/5 hover:border-primary-500/30 transition-all duration-300 group">
                            <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-500/20 group-hover:scale-110 transition-transform">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="mb-4 font-black uppercase text-white leading-tight text-xl lg:text-2xl tracking-normal break-words px-4">Cash on <br className="hidden md:block" /> Delivery</h3>
                            <p className="text-zinc-500 max-w-[200px] mx-auto">Pay when you receive your order</p>
                        </div>

                        <div className="text-center p-10 bg-black/40 rounded-3xl border border-white/5 hover:border-primary-500/30 transition-all duration-300 group">
                            <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-500/20 group-hover:scale-110 transition-transform">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h3 className="mb-4 font-black uppercase text-white leading-tight text-xl lg:text-2xl tracking-normal break-words px-4">Secure <br className="hidden md:block" /> Shopping</h3>
                            <p className="text-zinc-500 max-w-[200px] mx-auto">Your data is protected with advanced security</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
