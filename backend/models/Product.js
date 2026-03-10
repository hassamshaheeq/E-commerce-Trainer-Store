import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a product title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description']
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['men', 'women', 'children', 'latest']
    },
    brand: {
        type: String,
        required: [true, 'Please provide a brand name'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: 0
    },
    images: [{
        type: String,
        required: true
    }],
    sizes: [{
        size: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        }
    }],
    totalStock: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate total stock before saving
productSchema.pre('save', function (next) {
    this.totalStock = this.sizes.reduce((total, size) => total + size.stock, 0);
    next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
