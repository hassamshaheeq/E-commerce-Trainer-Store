import { body, validationResult } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

// User registration validation
export const validateRegister = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidationErrors
];

// User login validation
export const validateLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

// Product validation
export const validateProduct = [
    body('title').trim().notEmpty().withMessage('Product title is required'),
    body('description').trim().notEmpty().withMessage('Product description is required'),
    body('category').isIn(['men', 'women', 'children', 'latest']).withMessage('Invalid category'),
    body('brand').trim().notEmpty().withMessage('Brand is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
    body('sizes').isArray({ min: 1 }).withMessage('At least one size is required'),
    handleValidationErrors
];

// Order validation
export const validateOrder = [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
    body('shippingAddress.address').trim().notEmpty().withMessage('Address is required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
    body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
    body('shippingAddress.postalCode').trim().notEmpty().withMessage('Postal code is required'),
    body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
    body('shippingAddress.phone').trim().notEmpty().withMessage('Phone number is required'),
    handleValidationErrors
];
