import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isVerified: true // Auto-verify for simplicity (can add email verification later)
        });

        // Generate tokens
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    twoFactorEnabled: user.twoFactorEnabled
                },
                token,
                refreshToken
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password, twoFactorCode } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password +twoFactorSecret');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if 2FA is enabled
        if (user.twoFactorEnabled) {
            if (!twoFactorCode) {
                return res.status(200).json({
                    success: true,
                    requiresTwoFactor: true,
                    message: 'Please provide 2FA code'
                });
            }

            // Verify 2FA code
            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token: twoFactorCode,
                window: 2
            });

            if (!verified) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid 2FA code'
                });
            }
        }

        // Generate tokens
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    twoFactorEnabled: user.twoFactorEnabled
                },
                token,
                refreshToken
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
};

// @desc    Setup 2FA
// @route   POST /api/auth/2fa/setup
// @access  Private
export const setup2FA = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+twoFactorSecret');

        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `Shoe Store (${user.email})`
        });

        // Save secret to user (but don't enable 2FA yet)
        user.twoFactorSecret = secret.base32;
        await user.save();

        // Return the otpauth URL for the frontend to generate QR code
        res.status(200).json({
            success: true,
            data: {
                secret: secret.base32,
                otpauthUrl: secret.otpauth_url
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during 2FA setup',
            error: error.message
        });
    }
};

// @desc    Verify and enable 2FA
// @route   POST /api/auth/2fa/verify
// @access  Private
export const verify2FA = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findById(req.user.id).select('+twoFactorSecret');

        if (!user.twoFactorSecret) {
            return res.status(400).json({
                success: false,
                message: 'Please setup 2FA first'
            });
        }

        // Verify token
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token,
            window: 2
        });

        if (!verified) {
            return res.status(401).json({
                success: false,
                message: 'Invalid 2FA code'
            });
        }

        // Enable 2FA
        user.twoFactorEnabled = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: '2FA enabled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during 2FA verification',
            error: error.message
        });
    }
};

// @desc    Disable 2FA
// @route   POST /api/auth/2fa/disable
// @access  Private
export const disable2FA = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        user.twoFactorEnabled = false;
        user.twoFactorSecret = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: '2FA disabled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during 2FA disable',
            error: error.message
        });
    }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Generate new access token
        const token = generateToken(decoded.id);

        res.status(200).json({
            success: true,
            data: { token }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                twoFactorEnabled: user.twoFactorEnabled
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
