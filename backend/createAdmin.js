import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config({ path: './.env' });

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@primekicks.com' });

        if (existingAdmin) {
            console.log('✅ Admin user already exists!');
            console.log('Email: admin@primekicks.com');
            console.log('Password: admin123');
            process.exit();
            return;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const adminUser = await User.create({
            name: 'Admin',
            email: 'admin@primekicks.com',
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });

        console.log('✅ Admin user created successfully!');
        console.log('\n📧 Email: admin@primekicks.com');
        console.log('🔑 Password: admin123');
        console.log('\nYou can now log in to the admin panel at http://localhost:5173/admin/login\n');

        process.exit();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createAdminUser();
