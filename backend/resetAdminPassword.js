import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config({ path: './.env' });

const resetAdminPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected\n');

        // Find admin user
        const admin = await User.findOne({ email: 'admin@shoestore.com' });

        if (!admin) {
            console.log('❌ Admin user not found!');
            process.exit(1);
            return;
        }

        // Reset password
        const newPassword = 'admin123';
        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save();

        console.log('✅ Password reset successfully!\n');
        console.log('📧 Email: admin@shoestore.com');
        console.log('🔑 Password: admin123');
        console.log('\nYou can now log in at http://localhost:5173/admin/login\n');

        process.exit();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

resetAdminPassword();
