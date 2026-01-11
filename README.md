# E-Commerce Application

A full-stack e-commerce application built with React, Express, and MongoDB.

## Features

### User Features

- Browse products with category filtering
- View detailed product information
- Add products to shopping cart
- Manage cart items (update quantity, remove items)
- Place orders with shipping information

### Admin Features

- Add new products
- Edit existing products
- Delete products
- View all orders
- Update order status

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Styling**: Modern CSS with gradient designs

## Project Structure

```
e-commerce/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (Cart)
│   │   └── App.jsx        # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
└── package.json          # Root package.json
```

## Setup Instructions

1. **Install dependencies:**

   ```bash
   npm run install-all
   ```

2. **Set up MongoDB Atlas:**

   - Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster and database
   - Get your connection string from the cluster
   - Connection string format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`

3. **Set environment variables:**
   Create a `.env` file in the root directory:

   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecommerce?retryWrites=true&w=majority
   PORT=5001
   ADMIN_PASSWORD=admin123
   ```

   Replace `<username>`, `<password>`, and `<cluster>` with your MongoDB Atlas credentials.

4. **Seed the database with sample products (optional):**

   ```bash
   npm run seed
   ```

   This will add 8 sample products to your database for testing.

5. **Run the application:**

   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5001) and frontend dev server (port 3000).

   **Note**: Port 5001 is used by default because macOS often reserves port 5000 for AirPlay Receiver.

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001/api

## Admin Access

- **Password**: `admin123`
- Navigate to `/admin` route and enter the password to access admin features

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart

- `GET /api/cart/:sessionId` - Get cart
- `POST /api/cart/:sessionId/items` - Add item to cart
- `PUT /api/cart/:sessionId/items/:itemId` - Update cart item
- `DELETE /api/cart/:sessionId/items/:itemId` - Remove item from cart
- `DELETE /api/cart/:sessionId` - Clear cart

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order

### Admin (requires authentication)

- `POST /api/admin/products` - Add product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

## Notes

- The application uses session-based cart management (stored in localStorage)
- Admin authentication is simplified for demo purposes
- All images should be provided as URLs

