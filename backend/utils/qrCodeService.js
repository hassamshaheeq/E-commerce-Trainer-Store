import QRCode from 'qrcode';
import crypto from 'crypto';

// Generate unique verification token
export const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Generate QR code as data URL
export const generateQRCode = async (data) => {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(data, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 300
        });
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};

// Create verification URL with token
export const createVerificationUrl = (token) => {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return `${baseUrl}/verify/${token}`;
};
