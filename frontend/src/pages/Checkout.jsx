import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { getUserIdFromToken } from "../utils/jwt";
import "./Checkout.css";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    shippingAddress: "",
    phone: "",
    paymentMethod: "cod", // Cash on Delivery as default
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const userId = getUserIdFromToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await API.get(`/cart/${userId}`);
        setCartItems(res.data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        if (res.data.user) {
          setFormData(prev => ({
            ...prev,
            shippingAddress: res.data.user.address || "",
            phone: res.data.user.phone || ""
          }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (userId) {
      fetchCart();
      fetchUserProfile();
    }
  }, [userId]);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);
    try {
      const orderPayload = {
        userId,
        items: cartItems,
        totalAmount: calculateTotal(),
        shippingAddress: formData.shippingAddress,
        phone: formData.phone,
        paymentMethod: formData.paymentMethod,
      };

      const res = await API.post("/orders", orderPayload);

      if (res.status === 201) {
        setMessage("Order placed successfully! 🎉");
        // Clear cart handled by backend or manually here if needed
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setMessage(err.response?.data?.error || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !loading && !message) {
    return (
      <div className="checkout-page empty-checkout">
        <div className="checkout-container">
          <h2>Your cart is empty</h2>
          <button className="btn btn-primary" onClick={() => navigate("/products")}>Back to Medicines</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container animate-fade">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-content">
          <div className="checkout-form-section card">
            <h2>Shipping Information</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label>Shipping Address</label>
                <textarea
                  name="shippingAddress"
                  placeholder="Enter your full address"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  required
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <div className="payment-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleInputChange}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={handleInputChange}
                    />
                    <span>Credit/Debit Card (Mock)</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-place-order" 
                disabled={loading || cartItems.length === 0}
              >
                {loading ? "Placing Order..." : `Confirm Order (₹${calculateTotal().toFixed(2)})`}
              </button>
            </form>
            {message && <p className={`status-message ${message.includes("successfully") ? "success" : "error"}`}>{message}</p>}
          </div>

          <div className="order-summary-section card">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.cartId} className="summary-item">
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="item-price">₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-footer">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
