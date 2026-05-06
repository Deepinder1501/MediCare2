import React, { useEffect, useState } from "react";
import API from "../api";
import { getUserIdFromToken } from "../utils/jwt";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");
  const userId = getUserIdFromToken();

  const fetchCart = async () => {
    if (!userId) return;

    try {
      const res = await API.get(`/cart/${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const removeItem = async (cartId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      const res = await API.delete(`/cart/remove/${cartId}`);
      setMessage(res.data.message);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (cartId, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await API.put(`/cart/update/${cartId}`, { quantity });
      setMessage(res.data.message);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  };

  return (
    <div className="cart-page">
      <h1 className="animate-fade">Shopping Cart</h1>
      
      {message && <p className="message success-message">{message}</p>}
      
      {cartItems.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "4rem" }}>
          <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>Your cart is empty.</p>
          <a href="/products" className="btn btn-primary" style={{ marginTop: "2rem" }}>Browse Products</a>
        </div>
      ) : (
        <div className="cart-content animate-fade">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.cartId} className="cart-item">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="item-meta">Schedule: {item.schedule_type}</p>
                  {item.schedule_type !== "none" && (
                    <p className="item-meta">Next Order: {new Date(item.next_order_date).toLocaleDateString()}</p>
                  )}
                </div>

                <div className="item-price">
                  ₹{Number(item.price).toFixed(2)}
                </div>

                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="cart-quantity">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="item-actions">
                  <button className="btn btn-remove" onClick={() => removeItem(item.cartId)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <hr style={{ margin: "1.5rem 0", opacity: 0.1 }} />
            <div className="summary-row total">
              <span>Total</span>
              <span style={{ color: "var(--primary-color)", fontSize: "1.5rem", fontWeight: "700" }}>₹{calculateTotal().toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-checkout" style={{ width: "100%", marginTop: "2rem" }}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
