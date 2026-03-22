import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import Hero from './models/Hero.js';
import HeroSettings from './models/HeroSettings.js';
import { products } from './utils/seedData.js';
import connectDB from './config/database.js';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        await Hero.deleteMany();
        await HeroSettings.deleteMany();

        console.log('🗑️ Existing data cleared');

        // Create Hero Settings
        await HeroSettings.create({
            title: 'STEP INTO STYLE',
            subtitle: 'NEW ARRIVAL'
        });
        console.log('🖼️ Hero settings created');

        // Create Hero Slides
        const heroSlides = [
            { image: '/uploads/products/sample-nike-1.jpg', order: 0 },
            { image: '/uploads/products/sample-adidas-1.jpg', order: 1 },
            { image: '/uploads/products/sample-nike-women-1.jpg', order: 2 }
        ];
        await Hero.insertMany(heroSlides);
        console.log('🎞️ Hero slides added');

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Admin',
            email: 'admin@primekicks.com',
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });

        console.log('👤 Admin user created');

        // Create initial products
        await Product.insertMany(products);

        console.log('👟 Sample products added');

        console.log('✅ Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error with seeding: ${error.message}`);
        process.exit(1);
    }
};

seedData();
