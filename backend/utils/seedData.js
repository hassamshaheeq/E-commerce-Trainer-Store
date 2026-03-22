import bcrypt from 'bcryptjs';

const products = [
  // MEN
  {
    title: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 delivers visible cushioning under every step. Updated for modern comfort, it nods to the original 180 Air Max from 1991.',
    category: 'men',
    brand: 'Nike',
    price: 150,
    images: ['/uploads/products/sample-nike-1.jpg'],
    sizes: [{ size: '40', stock: 10 }, { size: '41', stock: 15 }, { size: '42', stock: 20 }],
    rating: 4.5,
    numReviews: 12,
    featured: true
  },
  {
    title: 'Adidas Ultraboost 22',
    description: 'A little extra push. The Ultraboost running shoes serve up comfort and responsiveness at every pace and distance.',
    category: 'men',
    brand: 'Adidas',
    price: 180,
    images: ['/uploads/products/sample-adidas-1.jpg'],
    sizes: [{ size: '41', stock: 5 }, { size: '42', stock: 12 }, { size: '43', stock: 8 }],
    rating: 4.8,
    numReviews: 25,
    featured: true
  },
  {
    title: 'Puma Velocity Nitro 2',
    description: 'An all-in-one neutral running shoe for any distance, the Velocity Nitro 2 is a lightweight and sleek update to the ROUNNER roster.',
    category: 'men',
    brand: 'Puma',
    price: 120,
    images: ['/uploads/products/sample-adidas-1.jpg'], // Reusing professional placeholders
    sizes: [{ size: '42', stock: 15 }, { size: '43', stock: 10 }],
    rating: 4.3,
    numReviews: 18,
    featured: false
  },
  {
    title: 'Reebok Nano X3',
    description: 'Versatile training shoes for lunges, jumps and everything in between.',
    category: 'men',
    brand: 'Reebok',
    price: 140,
    images: ['/uploads/products/sample-nike-1.jpg'],
    sizes: [{ size: '40', stock: 10 }, { size: '44', stock: 10 }],
    rating: 4.6,
    numReviews: 30,
    featured: true
  },
  {
    title: 'Nike Jordan Stay Loyal 2',
    description: 'Inspired by generations of J\'s, these kicks are a classic in the making.',
    category: 'men',
    brand: 'Nike',
    price: 115,
    images: ['/uploads/products/sample-nike-1.jpg'],
    sizes: [{ size: '42', stock: 20 }],
    rating: 4.7,
    numReviews: 45,
    featured: false
  },
  {
    title: 'ASICS Gel-Kayano 29',
    description: 'Creates a stable running experience and a more responsive feel underfoot.',
    category: 'men',
    brand: 'ASICS',
    price: 160,
    images: ['/uploads/products/sample-adidas-1.jpg'],
    sizes: [{ size: '41', stock: 8 }, { size: '45', stock: 5 }],
    rating: 4.9,
    numReviews: 50,
    featured: true
  },

  // WOMEN
  {
    title: 'Womens Air Force 1',
    description: 'The radiance lives on in the Nike Air Force 1, the b-ball OG that puts a fresh spin on what you know best.',
    category: 'women',
    brand: 'Nike',
    price: 110,
    images: ['/uploads/products/w-nike-af1.png'],
    sizes: [{ size: '36', stock: 10 }, { size: '37', stock: 15 }, { size: '38', stock: 20 }],
    rating: 4.7,
    numReviews: 40,
    featured: true
  },
  {
    title: 'Adidas NMD_R1',
    description: 'Cloudlike comfort. These shoes take 80s racing style to the next level.',
    category: 'women',
    brand: 'Adidas',
    price: 130,
    images: ['/uploads/products/w-adidas-nmd.png'],
    sizes: [{ size: '37', stock: 12 }, { size: '39', stock: 8 }],
    rating: 4.4,
    numReviews: 22,
    featured: true
  },
  {
    title: 'Puma Mayze Thrifted',
    description: 'Designed for the hype girls, the street enthusiasts, the trend mavens.',
    category: 'women',
    brand: 'Puma',
    price: 100,
    images: ['/uploads/products/w-puma-mayze.png'],
    sizes: [{ size: '38', stock: 15 }],
    rating: 4.2,
    numReviews: 15,
    featured: false
  },
  {
    title: 'Nike Pegasus 40',
    description: 'A responsive ride for every run, the Pegasus’ familiar, just-for-you feel returns.',
    category: 'women',
    brand: 'Nike',
    price: 130,
    images: ['/uploads/products/w-nike-pegasus.png'],
    sizes: [{ size: '36', stock: 10 }, { size: '38', stock: 10 }],
    rating: 4.8,
    numReviews: 60,
    featured: true
  },
  {
    title: 'New Balance 574',
    description: 'The most New Balance shoe ever. Classic, versatile, and stylish.',
    category: 'women',
    brand: 'New Balance',
    price: 85,
    images: ['/uploads/products/w-nb-574.png'],
    sizes: [{ size: '37', stock: 25 }],
    rating: 4.5,
    numReviews: 100,
    featured: false
  },

  // CHILDREN / KIDS
  {
    title: 'Kids Revolution 6',
    description: 'Versatile for little athletes, from all-day play to anytime wear.',
    category: 'children',
    brand: 'Nike',
    price: 55,
    images: ['/uploads/products/sample-nike-1.jpg'],
    sizes: [{ size: '30', stock: 15 }, { size: '32', stock: 10 }],
    rating: 4.3,
    numReviews: 10,
    featured: true
  },
  {
    title: 'Adidas Superstar Kids',
    description: 'The iconic shell-toe shoe, sized down for the next generation.',
    category: 'children',
    brand: 'Adidas',
    price: 65,
    images: ['/uploads/products/sample-adidas-1.jpg'],
    sizes: [{ size: '31', stock: 20 }, { size: '33', stock: 5 }],
    rating: 4.7,
    numReviews: 35,
    featured: true
  },
  {
    title: 'Puma Smash v2',
    description: 'Clean, classic, and ready for everyday adventures.',
    category: 'children',
    brand: 'Puma',
    price: 45,
    images: ['/uploads/products/sample-adidas-1.jpg'],
    sizes: [{ size: '28', stock: 12 }],
    rating: 4.1,
    numReviews: 8,
    featured: false
  },
  {
    title: 'Sketchers Light-Up',
    description: 'Fun, bright, and comfortable for kids who love to move.',
    category: 'children',
    brand: 'Skechers',
    price: 50,
    images: ['/uploads/products/sample-nike-women-1.jpg'],
    sizes: [{ size: '29', stock: 18 }],
    rating: 4.6,
    numReviews: 50,
    featured: false
  },

  // LATEST / NEW ARRIVALS
  {
    title: 'Nike Invincible 3',
    description: 'With maximum cushioning to support every mile, the Invincible 3 gives you our highest level of comfort underfoot.',
    category: 'latest',
    brand: 'Nike',
    price: 180,
    images: ['/uploads/products/sample-nike-1.jpg'],
    sizes: [{ size: '42', stock: 10 }, { size: '44', stock: 10 }],
    rating: 4.9,
    numReviews: 5,
    featured: true
  },
  {
    title: 'Adidas Samba OG',
    description: 'Born on the pitch, the Samba is a timeless icon of street style.',
    category: 'latest',
    brand: 'Adidas',
    price: 100,
    images: ['/uploads/products/sample-adidas-1.jpg'],
    sizes: [{ size: '41', stock: 30 }],
    rating: 4.8,
    numReviews: 120,
    featured: true
  },
  {
    title: 'New Balance 1906R',
    description: 'Named for the year New Balance was conceived and inspired by 2000s running designs.',
    category: 'latest',
    brand: 'New Balance',
    price: 155,
    images: ['/uploads/products/sample-nike-1.jpg'],
    sizes: [{ size: '43', stock: 12 }],
    rating: 4.7,
    numReviews: 15,
    featured: true
  },
  {
    title: 'Crocs Classic Clog',
    description: 'The iconic clog that started a comfort revolution around the world.',
    category: 'latest',
    brand: 'Crocs',
    price: 50,
    images: ['/uploads/products/sample-adidas-1.jpg'],
    sizes: [{ size: 'M9', stock: 50 }],
    rating: 4.5,
    numReviews: 500,
    featured: false
  },
  {
    title: 'Converse Chuck 70',
    description: 'The Chuck 70 mixes the best details from the ’70s-era Chuck with impeccable craftsmanship and premium materials.',
    category: 'latest',
    brand: 'Converse',
    price: 90,
    images: ['/uploads/products/sample-nike-women-1.jpg'],
    sizes: [{ size: '42', stock: 25 }],
    rating: 4.8,
    numReviews: 85,
    featured: false
  },
  {
    title: 'Vans Old Skool',
    description: 'The Vans Old Skool, the classic skate shoe and first to bare the iconic sidestripe.',
    category: 'latest',
    brand: 'Vans',
    price: 70,
    images: ['/uploads/products/sample-adidas-1.jpg'],
    sizes: [{ size: '40', stock: 40 }],
    rating: 4.6,
    numReviews: 200,
    featured: true
  },
  {
    title: 'Under Armour Curry 11',
    description: 'Built for the greatest shooter of all time.',
    category: 'latest',
    brand: 'Under Armour',
    price: 160,
    images: ['/uploads/products/sample-nike-1.jpg'],
    sizes: [{ size: '44', stock: 15 }],
    rating: 4.9,
    numReviews: 20,
    featured: true
  }
];

export { products };
