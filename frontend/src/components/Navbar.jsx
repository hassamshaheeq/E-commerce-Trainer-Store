import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const Navbar = () => {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCartCount();
        }
    }, [isAuthenticated]);

    const fetchCartCount = async () => {
        try {
            const response = await api.get('/cart');
            const count = response.data.data.items.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(count);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            {/* Solid Dark Background (Light Black) */}
            <div className="absolute inset-0 bg-gray-900 shadow-lg"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-transform p-1.5">
                            <img src="/shoe-logo.png" alt="ShoeStore Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">ShoeStore</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/products/men" className="text-gray-300 hover:text-white font-medium transition-colors relative group">
                            Men
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link to="/products/women" className="text-gray-300 hover:text-white font-medium transition-colors relative group">
                            Women
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link to="/products/children" className="text-gray-300 hover:text-white font-medium transition-colors relative group">
                            Children
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link to="/products/latest" className="text-gray-300 hover:text-white font-medium transition-colors relative group">
                            Latest
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                {/* Cart Icon */}
                                <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <svg className="w-6 h-6 text-gray-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center ring-2 ring-white/20">
                                            <span className="text-white font-semibold text-sm">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                                        </div>
                                        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 animate-scale-in z-50">
                                            <div className="px-4 py-2 border-b border-gray-700">
                                                <p className="text-sm font-semibold text-white">{user?.name}</p>
                                                <p className="text-xs text-gray-400">{user?.email}</p>
                                            </div>
                                            <Link
                                                to="/orders"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                My Orders
                                            </Link>
                                            <Link
                                                to="/2fa-setup"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Security (2FA)
                                            </Link>
                                            {isAdmin && (
                                                <Link
                                                    to="/admin/dashboard"
                                                    className="block px-4 py-2 text-sm text-primary-400 hover:bg-gray-700 font-semibold"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    Admin Panel
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-6 py-2 border border-primary-500 text-primary-400 font-semibold rounded-lg hover:bg-primary-500/10 transition-all duration-200">
                                    Login
                                </Link>
                                <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-primary-500/30 transition-all duration-200">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-white/10"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800 animate-slide-down">
                    <div className="px-4 py-2 space-y-2">
                        <Link to="/products/men" className="block py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-2">
                            Men
                        </Link>
                        <Link to="/products/women" className="block py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-2">
                            Women
                        </Link>
                        <Link to="/products/children" className="block py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-2">
                            Children
                        </Link>
                        <Link to="/products/latest" className="block py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-2">
                            Latest
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/cart" className="block py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-2">
                                    Cart ({cartCount})
                                </Link>
                                <Link to="/orders" className="block py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-2">
                                    My Orders
                                </Link>
                                {isAdmin && (
                                    <Link to="/admin/dashboard" className="block py-2 text-primary-400 font-semibold hover:bg-white/5 rounded-lg px-2">
                                        Admin Panel
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="block w-full text-left py-2 text-red-400 hover:bg-white/5 rounded-lg px-2">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-2">
                                    Login
                                </Link>
                                <Link to="/register" className="block py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-2">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
