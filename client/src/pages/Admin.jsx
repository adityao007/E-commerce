import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (authenticated) {
      if (activeTab === 'products') {
        fetchProducts();
      } else {
        fetchOrders();
      }
    }
  }, [authenticated, activeTab]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple hardcoded password check (in real app, this would be a proper auth)
    if (password === 'admin123') {
      setAuthenticated(true);
      setError(null);
    } else {
      setError('Invalid password');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/orders', {
        headers: { Authorization: `Bearer admin123` }
      });
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock)
      };

      if (editingProduct) {
        await axios.put(`/api/admin/products/${editingProduct._id}`, productData, {
          headers: { Authorization: `Bearer admin123` }
        });
        setSuccess('Product updated successfully!');
      } else {
        await axios.post('/api/admin/products', productData, {
          headers: { Authorization: `Bearer admin123` }
        });
        setSuccess('Product added successfully!');
      }

      setProductForm({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        stock: ''
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      stock: product.stock.toString()
    });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer admin123` }
      });
      setSuccess('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer admin123` }
      });
      setSuccess('Order status updated!');
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  if (!authenticated) {
    return (
      <div className="admin">
        <div className="container">
          <div className="admin-login card">
            <h1>Admin Login</h1>
            <p>Enter password to access admin panel</p>
            <form onSubmit={handleLogin}>
              {error && <div className="error">{error}</div>}
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  required
                  placeholder="Enter admin password"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </form>
            <p className="hint">Hint: admin123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="container">
        <h1 className="admin-title">Admin Panel</h1>
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {activeTab === 'products' && (
          <div className="admin-content">
            <div className="admin-form-container card">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleProductSubmit} className="admin-form">
                <div className="input-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Description *</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="input"
                    rows="4"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Stock *</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Image URL *</label>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: '',
                        description: '',
                        price: '',
                        image: '',
                        category: '',
                        stock: ''
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            <div className="admin-products">
              <h2>All Products</h2>
              {loading ? (
                <div className="loading">Loading products...</div>
              ) : (
                <div className="products-list">
                  {products.map((product) => (
                    <div key={product._id} className="admin-product-card card">
                      <img src={product.image} alt={product.name} />
                      <div className="admin-product-info">
                        <h3>{product.name}</h3>
                        <p>{product.category}</p>
                        <p>${product.price.toFixed(2)} | Stock: {product.stock}</p>
                      </div>
                      <div className="admin-product-actions">
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-orders">
            <h2>All Orders</h2>
            {loading ? (
              <div className="loading">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="no-orders">No orders yet</div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="admin-order-card card">
                    <div className="order-header">
                      <div>
                        <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                        <p>{order.customerName} ({order.customerEmail})</p>
                        <p>{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="order-status">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    <div className="order-shipping">
                      <strong>Shipping Address:</strong> {order.shippingAddress}
                    </div>
                    <div className="order-items-list">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <span>{item.product.name} x {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-total">
                      <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

