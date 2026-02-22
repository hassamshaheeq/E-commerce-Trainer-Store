import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected\n');

        const email = 'admin@shoestore.com';
        const password = 'admin123'; // Default password from createAdmin.js

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('❌ User not found');
            process.exit(1);
        }

        console.log('User found:', user.email);
        console.log('Password hash:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('\nPassword "admin123" matches:', isMatch);

        if (isMatch) {
            console.log('\n✅ LOGIN WORKS!');
            console.log('\nUse these credentials:');
            console.log('Email:', email);
            console.log('Password: admin123');
        } else {
            console.log('\n❌ Password does not match');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

testLogin();
