import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <h1>🛍️ E-Commerce</h1>
          </Link>
          <div className="navbar-links">
            <Link to="/" className="nav-link">Products</Link>
            <Link to="/cart" className="nav-link cart-link">
              Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <Link to="/admin" className="nav-link">Admin</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

