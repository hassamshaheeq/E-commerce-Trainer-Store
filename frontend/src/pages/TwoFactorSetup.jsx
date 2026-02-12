import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';

const TwoFactorSetup = () => {
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const response = await api.get('/auth/me');
            setIsEnabled(response.data.data.twoFactorEnabled);
        } catch (error) {
            console.error('Error checking 2FA status:', error);
        }
    };

    const handleSetup = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/2fa/setup');
            // Backend now returns otpauthUrl instead of qrCode image data
            setQrCode(response.data.data.otpauthUrl);
            setSecret(response.data.data.secret);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to setup 2FA');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/auth/2fa/verify', { token: verificationCode });
            setSuccess('2FA enabled successfully!');
            setIsEnabled(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid code');
        } finally {
            setLoading(false);
        }
    };

    const handleDisable = async () => {
        if (!window.confirm('Are you sure you want to disable 2FA?')) return;

        setLoading(true);
        try {
            await api.post('/auth/2fa/disable');
            setSuccess('2FA disabled successfully');
            setIsEnabled(false);
            setQrCode('');
            setSecret('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to disable 2FA');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="card-glass p-8">
                    <h2 className="text-3xl font-bold gradient-text mb-6">Two-Factor Authentication</h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                            {success}
                        </div>
                    )}

                    {isEnabled ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">2FA is Enabled</h3>
                            <p className="text-gray-600 mb-6">Your account is protected with two-factor authentication</p>
                            <Button variant="danger" onClick={handleDisable} disabled={loading}>
                                Disable 2FA
                            </Button>
                        </div>
                    ) : !qrCode ? (
                        <div className="text-center">
                            <p className="text-gray-600 mb-6">
                                Add an extra layer of security to your account by enabling two-factor authentication.
                            </p>
                            <Button variant="primary" onClick={handleSetup} disabled={loading}>
                                {loading ? 'Setting up...' : 'Setup 2FA'}
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <div className="bg-white p-6 rounded-lg mb-6">
                                <h3 className="font-semibold mb-4">Step 1: Scan QR Code</h3>
                                <p className="text-gray-600 mb-4">
                                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                                </p>
                                <div className="flex justify-center mb-4">
                                    <QRCodeSVG value={qrCode} size={200} />
                                </div>
                                <p className="text-sm text-gray-500 text-center">
                                    Or enter this code manually: <code className="bg-gray-100 px-2 py-1 rounded">{secret}</code>
                                </p>
                            </div>

                            <form onSubmit={handleVerify}>
                                <h3 className="font-semibold mb-4">Step 2: Verify Code</h3>
                                <Input
                                    label="Enter 6-digit code from your app"
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    required
                                    maxLength={6}
                                    placeholder="000000"
                                />
                                <Button type="submit" variant="primary" disabled={loading} className="w-full mt-4">
                                    {loading ? 'Verifying...' : 'Verify and Enable'}
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TwoFactorSetup;
