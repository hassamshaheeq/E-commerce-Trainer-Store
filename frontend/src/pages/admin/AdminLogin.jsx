import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '', twoFactorCode: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [requires2FA, setRequires2FA] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(formData.email, formData.password, formData.twoFactorCode || null);

            if (result.requiresTwoFactor) {
                setRequires2FA(true);
                setLoading(false);
                return;
            }

            // Check if user is admin
            const user = JSON.parse(localStorage.getItem('user'));
            if (user.role !== 'admin') {
                setError('Access denied. Admin privileges required.');
                return;
            }

            navigate('/admin/dashboard');
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 animate-scale-in">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Admin Access</h2>
                        <p className="text-gray-600 mt-2">Sign in to admin panel</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="admin@example.com"
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />

                        {requires2FA && (
                            <Input
                                label="2FA Code"
                                type="text"
                                name="twoFactorCode"
                                value={formData.twoFactorCode}
                                onChange={handleChange}
                                required
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                            />
                        )}

                        <Button type="submit" variant="primary" disabled={loading} className="w-full">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
