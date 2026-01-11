import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="order-success">
        <div className="container">
          <div className="error">Order not found</div>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success">
      <div className="container">
        <div className="success-content card">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p className="success-message">
            Thank you for your order. We've received your order and will process it shortly.
          </p>
          <div className="order-details">
            <div className="detail-row">
              <span>Order ID:</span>
              <strong>#{order._id.slice(-8).toUpperCase()}</strong>
            </div>
            <div className="detail-row">
              <span>Customer:</span>
              <strong>{order.customerName}</strong>
            </div>
            <div className="detail-row">
              <span>Email:</span>
              <strong>{order.customerEmail}</strong>
            </div>
            <div className="detail-row">
              <span>Status:</span>
              <strong className={`status-${order.status}`}>{order.status}</strong>
            </div>
            <div className="detail-row">
              <span>Total Amount:</span>
              <strong className="total-amount">${order.totalAmount.toFixed(2)}</strong>
            </div>
          </div>
          <div className="order-items-summary">
            <h3>Order Items:</h3>
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item-summary">
                <span>{item.product.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="success-actions">
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

