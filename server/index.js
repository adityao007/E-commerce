const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5001;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\nPort ${PORT} is already in use!`);
        console.error('\nTo fix this, run one of the following:');
        console.error(`  lsof -ti:${PORT} | xargs kill -9`);
        console.error(`  Or use a different port by setting PORT in .env file\n`);
        process.exit(1);
      } else {
        throw error;
      }
    });
  })
  .catch((error) => {
    console.error('\nMongoDB connection error:');
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\nCannot connect to MongoDB!');
      console.error('\nPlease ensure MongoDB is running or check your connection string.');
      console.error('See README.md for setup instructions.\n');
    } else {
      console.error(error.message);
    }
    console.error('\nServer will continue to run but database operations will fail.\n');
  });

module.exports = app;

