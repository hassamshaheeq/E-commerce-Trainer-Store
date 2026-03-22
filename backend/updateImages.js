import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const updates = [
  { title: "Womens Air Force 1", images: ["/uploads/products/w-nike-af1.png"] },
  { title: "Adidas NMD_R1", images: ["/uploads/products/w-adidas-nmd.png"] },
  { title: "Puma Mayze Thrifted", images: ["/uploads/products/w-puma-mayze.png"] },
  { title: "Nike Pegasus 40", images: ["/uploads/products/w-nike-pegasus.png"] },
  { title: "New Balance 574", images: ["/uploads/products/w-nb-574.png"] }
];

const updateDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const item of updates) {
      const result = await Product.updateMany(
        { title: item.title, category: 'women' },
        { $set: { images: item.images } }
      );
      console.log(`Updated ${item.title}: ${result.modifiedCount} documents`);
    }

    console.log('Update complete');
    process.exit(0);
  } catch (err) {
    console.error('Error updating:', err);
    process.exit(1);
  }
};

updateDB();
