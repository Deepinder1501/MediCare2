import React, { useState, useEffect } from "react";
import API from "../api";
import { getUserIdFromToken } from "../utils/jwt";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get(`/orders/user/${userId}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchOrders();
  }, [userId]);

  const toggleOrderDetails = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    if (!orderDetails[orderId]) {
      try {
        const res = await API.get(`/orders/${orderId}`);
        setOrderDetails(prev => ({ ...prev, [orderId]: res.data }));
      } catch (err) {
        console.error("Error fetching order details:", err);
      }
    }
    setExpandedOrder(orderId);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'shipped': return '#3b82f6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#64748b';
    }
  };

  if (loading) {
    return (
      <div className="order-history-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="history-container animate-fade">
        <div className="history-header">
          <h1 className="page-title">My Orders</h1>
          <div className="status-legend">
            <span className="legend-item"><span className="dot pending"></span> Pending</span>
            <span className="legend-item"><span className="dot shipped"></span> Shipped</span>
            <span className="legend-item"><span className="dot delivered"></span> Delivered</span>
          </div>
        </div>
        
        {orders.length === 0 ? (
          <div className="no-orders card">
            <div className="no-orders-icon">📦</div>
            <h2>No orders found</h2>
            <p>You haven't placed any orders yet. Explore our medicines to start shopping!</p>
            <a href="/products" className="btn btn-primary">Browse Medicines</a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card card">
                <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                  <div className="order-main-info">
                    <span className="order-id">Order #{order.id}</span>
                    <span className="order-date">{new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                  </div>
                  
                  <div className="order-status-amount">
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(order.status) + '15', color: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                    <span className="order-total">₹{Number(order.total_amount).toFixed(2)}</span>
                    <span className={`expand-icon ${expandedOrder === order.id ? 'active' : ''}`}>▼</span>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="order-details animate-fade">
                    <div className="details-grid">
                      <div className="shipping-info">
                        <h3>Shipping & Payment</h3>
                        <p><strong>Address:</strong> {order.shipping_address}</p>
                        <p><strong>Phone:</strong> {order.phone}</p>
                        <p><strong>Payment Method:</strong> {order.payment_method?.toUpperCase()}</p>
                      </div>
                      
                      <div className="items-info">
                        <h3>Order Items</h3>
                        {orderDetails[order.id] ? (
                          <div className="details-items-list">
                            {orderDetails[order.id].map((item, idx) => (
                              <div key={idx} className="details-item">
                                <span className="item-name">{item.name}</span>
                                <span className="item-qty">x{item.quantity}</span>
                                <span className="item-price">₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>Loading items...</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
