import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(() => {
    let id = localStorage.getItem("sessionId");
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("sessionId", id);
    }
    return id;
  });

  const fetchCart = async () => {
    try {
      const response = await axios.get(`/api/cart/${sessionId}`);
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [sessionId]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post(`/api/cart/${sessionId}/items`, {
        productId,
        quantity,
      });
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to add to cart",
      };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await axios.put(
        `/api/cart/${sessionId}/items/${itemId}`,
        {
          quantity,
        }
      );
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to update cart",
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await axios.delete(
        `/api/cart/${sessionId}/items/${itemId}`
      );
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to remove from cart",
      };
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`/api/cart/${sessionId}`);
      setCart({ items: [] });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to clear cart",
      };
    }
  };

  const getCartItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      if (item.product && item.product.price) {
        return total + item.product.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const value = {
    cart,
    loading,
    sessionId,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
