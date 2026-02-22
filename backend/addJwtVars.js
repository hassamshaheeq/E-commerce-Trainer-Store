import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');

// Read existing .env file
let envContent = '';
try {
    envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
    console.log('⚠️ .env file not found, will create it');
}

// Check if JWT variables already exist
const hasJwtExpire = envContent.includes('JWT_EXPIRE');
const hasJwtRefreshSecret = envContent.includes('JWT_REFRESH_SECRET');
const hasJwtRefreshExpire = envContent.includes('JWT_REFRESH_EXPIRE');

let updates = [];

if (!hasJwtExpire) {
    updates.push('JWT_EXPIRE=30d');
}

if (!hasJwtRefreshSecret) {
    updates.push('JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here_make_it_different');
}

if (!hasJwtRefreshExpire) {
    updates.push('JWT_REFRESH_EXPIRE=90d');
}

if (updates.length > 0) {
    // Add new lines if file doesn't end with newline
    if (!envContent.endsWith('\n') && envContent.length > 0) {
        envContent += '\n';
    }

    // Add missing variables
    envContent += '\n# JWT Configuration (Auto-added)\n';
    envContent += updates.join('\n') + '\n';

    // Write back to .env
    fs.writeFileSync(envPath, envContent);

    console.log('✅ Added missing JWT environment variables:');
    updates.forEach(v => console.log('  - ' + v.split('=')[0]));
    console.log('\n⚠️  IMPORTANT: Please restart your backend server for changes to take effect!');
    console.log('   Press Ctrl+C in the backend terminal and run: npm run dev\n');
} else {
    console.log('✅ All JWT environment variables are already present!');
}
