import React, { useEffect, useState } from "react";
import { getUserIdFromToken } from "../utils/jwt";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");
  const userId = getUserIdFromToken();
  const navigate = useNavigate();

  const fetchCart = () => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/cart/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const removeItem = (cartId) => {
    fetch(`http://localhost:5000/api/cart/remove/${cartId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        fetchCart();
      });
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity < 1) return;
    fetch(`http://localhost:5000/api/cart/update/${cartId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ quantity }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        fetchCart();
      });
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (Number(item.total_price) || 0),
    0
  );

  return (
    <div className="cart-bg">
      <div className="cart-page">
        <h1>Your Cart</h1>
        {message && <p className="message">{message}</p>}
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.cartId} className="cart-item">
                  <h3>{item.name}</h3>
                  <p>Price per unit: ₹{Number(item.price).toFixed(2)}</p>
                  <p>Total: ₹{(Number(item.total_price) || 0).toFixed(2)}</p>
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
                  <p>Schedule: {item.schedule_type}</p>
                  {item.schedule_type !== "none" && (
                    <p>
                      Next Order: {new Date(item.next_order_date).toLocaleDateString()}
                    </p>
                  )}
                  <button onClick={() => removeItem(item.cartId)}>Remove</button>
                </div>
              ))}
            </div>
            <h2 style={{ marginTop: "30px", textAlign: "right" }}>
              Total Amount: ₹{totalAmount.toFixed(2)}
            </h2>
            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
              aria-label="Proceed to Checkout"
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
