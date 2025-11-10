import React, { useEffect, useState } from "react";
import { getUserIdFromToken } from "../utils/jwt";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");
  const userId = getUserIdFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setMessage("Please login to proceed to checkout");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    fetch(`http://localhost:5000/api/cart/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch(() => setMessage("Failed to load cart"));
  }, [userId, navigate]);

  // Safely convert total_price to number, default to 0 if invalid
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (Number(item.total_price) || 0),
    0
  );

  const handleCheckout = () => {
    alert("Checkout feature coming soon!");
  };

  return (
    <div className="checkout-bg">
      <div className="checkout-page">
        <h1>Checkout</h1>
        {message && <p className="message">{message}</p>}
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={item.cartId} className="checkout-item">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price per unit: ₹{Number(item.price).toFixed(2)}</p>
                  <p>Total: ₹{(Number(item.total_price) || 0).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <h2 className="total-amount">
              Total Amount: ₹{totalAmount.toFixed(2)}
            </h2>
            <button className="checkout-btn" onClick={handleCheckout}>
              Confirm & Pay
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
