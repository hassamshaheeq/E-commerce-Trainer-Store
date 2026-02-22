import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config({ path: './.env' });

const updateProductImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Find the first product (or a specific one like Golden Goose)
        const product = await Product.findOne();

        if (product) {
            console.log(`Updating images for product: ${product.title}`);

            product.images = [
                '/sample-shoe/front.png',
                '/sample-shoe/side.png',
                '/sample-shoe/back.png',
                '/sample-shoe/top.png',
                '/sample-shoe/detail.png'
            ];

            await product.save();
            console.log('Product images updated successfully');
        } else {
            console.log('No products found to update');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateProductImages();
