const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'electronics',
    stock: 50
  },
  {
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with fitness tracking, heart rate monitor, and smartphone notifications.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'electronics',
    stock: 30
  },
  {
    name: 'Running Shoes',
    description: 'Comfortable and durable running shoes with advanced cushioning technology for maximum performance.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'fashion',
    stock: 75
  },
  {
    name: 'Leather Jacket',
    description: 'Classic leather jacket with modern design. Perfect for any season and occasion.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
    category: 'fashion',
    stock: 25
  },
  // {
  //   name: 'Coffee Maker',
  //   description: 'Programmable coffee maker with thermal carafe. Brews perfect coffee every time.',
  //   price: 89.99,
  //   image: 'https://images.unsplash.com/photo-1517668808823-f6c0ff58c5a0?w=500',
  //   category: 'home',
  //   stock: 40
  // },
  {
    name: 'Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness and color temperature. Perfect for home office.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    category: 'home',
    stock: 60
  },
  // {
  //   name: 'Yoga Mat',
  //   description: 'Non-slip yoga mat with extra cushioning. Ideal for yoga, pilates, and fitness exercises.',
  //   price: 39.99,
  //   image: 'https://images.unsplash.com/photo-1601925260368-ae2f83d34b08?w=500',
  //   category: 'sports',
  //   stock: 100
  // },
  {
    name: 'Backpack',
    description: 'Durable and spacious backpack with multiple compartments. Perfect for travel and daily use.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'fashion',
    stock: 45
  }
];

async function seedDatabase() {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`Inserted ${sampleProducts.length} products`);

    console.log('\nDatabase seeded successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\nError seeding database:');
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\nMongoDB connection failed!');
      console.error('\nPossible solutions:');
      console.error('1. Make sure MongoDB is installed and running on your system');
      console.error('   - macOS: brew services start mongodb-community');
      console.error('   - Linux: sudo systemctl start mongod');
      console.error('   - Windows: Start MongoDB service from Services');
      console.error('\n3. Check your connection string:');
      console.error(`   Current: ${MONGODB_URI}`);
    } else {
      console.error(error.message);
    }
    
    process.exit(1);
  }
}

seedDatabase();

