import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config({ path: './.env' });

const checkAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected\n');

        // Find all admin users
        const admins = await User.find({ role: 'admin' });

        console.log(`Found ${admins.length} admin user(s):\n`);

        admins.forEach((admin, index) => {
            console.log(`Admin ${index + 1}:`);
            console.log(`  Email: ${admin.email}`);
            console.log(`  Name: ${admin.name}`);
            console.log(`  Verified: ${admin.isVerified}`);
            console.log(`  Role: ${admin.role}`);
            console.log('');
        });

        if (admins.length === 0) {
            console.log('⚠️  No admin users found!');
            console.log('Run this to create one:');
            console.log('node createAdmin.js\n');
        }

        process.exit();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkAdmins();
