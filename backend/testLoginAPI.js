import axios from 'axios';

const testLoginAPI = async () => {
    try {
        console.log('Testing login API at http://localhost:5000/api/auth/login\n');

        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@shoestore.com',
            password: 'admin123'
        });

        console.log('✅ SUCCESS!');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log('❌ ERROR!');
        console.log('Status:', error.response?.status);
        console.log('Error message:', error.response?.data?.message || error.message);
        console.log('Full error:', JSON.stringify(error.response?.data, null, 2));
    }
};

testLoginAPI();
