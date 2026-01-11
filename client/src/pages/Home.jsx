import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    setAddingToCart({ ...addingToCart, [productId]: true });
    const result = await addToCart(productId, 1);
    setAddingToCart({ ...addingToCart, [productId]: false });
    if (result.success) {
      setSuccessMessage("Product added to cart");
      setTimeout(() => setSuccessMessage(null), 2500);
    } else {
      setError(result.error || "Failed to add to cart");
      setTimeout(() => setError(null), 3000);
    }
  };

  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const filteredProducts =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="home">
      <div className="container">
        <div className="home-header">
          <h1>Welcome to Our Store</h1>
          <p>Discover amazing products at great prices</p>
        </div>

        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <div className="filter-section">
          <label>Filter by category:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found in this category.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-card card">
                <Link to={`/product/${product._id}`} className="product-link">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    {product.stock === 0 && (
                      <div className="out-of-stock-badge">Out of Stock</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-description">{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="product-stock">
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </Link>
                <button
                  className="btn btn-primary add-to-cart-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(product._id);
                  }}
                  disabled={product.stock === 0 || addingToCart[product._id]}
                >
                  {addingToCart[product._id] ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
