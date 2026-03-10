import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist function
const ensureDir = (dir) => {
    const fullPath = path.join(__dirname, dir);
    fs.mkdirSync(fullPath, { recursive: true });
    return fullPath;
};

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '../uploads/products';
        if (req.originalUrl.includes('/hero')) {
            uploadPath = '../uploads/hero';
        }
        const fullPath = ensureDir(uploadPath);
        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const prefix = req.originalUrl.includes('/hero') ? 'hero-' : 'product-';
        cb(null, `${prefix}${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File filter allowing any image MIME type
const fileFilter = (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
        return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter
});

export default upload;
