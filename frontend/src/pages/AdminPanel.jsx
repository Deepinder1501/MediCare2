// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import API from "../api";
import { 
  FiShoppingBag, 
  FiUsers, 
  FiBox, 
  FiPieChart, 
  FiTrash2, 
  FiEdit, 
  FiPlus, 
  FiTrendingUp, 
  FiCheckCircle, 
  FiAlertCircle,
  FiHome,
  FiLogOut
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import "./AdminPanel.css";

function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
    strength: "",
    expiry_date: "",
    rating: ""
  });

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/admin/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data || err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err.response?.data || err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await API.put(`/admin/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err.response?.data || err);
    }
  };

  const handleEditProduct = (product) => {
    setActiveTab("products");
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category || "",
      image: null,
      strength: product.strength || "",
      expiry_date: product.expiry_date?.split("T")[0] || "",
      rating: product.rating || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setProductForm({ ...productForm, [name]: files[0] });
    } else {
      setProductForm({ ...productForm, [name]: value });
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(productForm).forEach(key => {
      if (key === 'image' && productForm[key]) {
        formData.append(key, productForm[key]);
      } else if (key !== 'image') {
        formData.append(key, productForm[key]);
      }
    });

    try {
      if (editingProductId) {
        await API.put(`/admin/products/${editingProductId}`, formData, { 
          headers: { "Content-Type": "multipart/form-data" } 
        });
      } else {
        await API.post(`/admin/products`, formData, { 
          headers: { "Content-Type": "multipart/form-data" } 
        });
      }
      setEditingProductId(null);
      setProductForm({
        name: "", description: "", price: "", stock: "", 
        category: "", image: null, strength: "", expiry_date: "", rating: ""
      });
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err);
    }
  };

  const calculateTotalSales = () => {
    return orders.reduce((sum, order) => sum + Number(order.total_amount), 0).toFixed(2);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-panel">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <FiShoppingBag />
          <span>MediCare Admin</span>
        </div>
        <nav className="admin-nav">
          <button 
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FiPieChart /> <span>Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <FiBox /> <span>Products</span>
          </button>
          <button 
            className={`nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <FiUsers /> <span>Users</span>
          </button>
          <button 
            className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FiTrendingUp /> <span>Orders</span>
          </button>
          
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/" className="nav-item">
              <FiHome /> <span>Back to Site</span>
            </Link>
            <button className="nav-item" onClick={handleLogout}>
              <FiLogOut /> <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="admin-user-info">
            <span>Welcome, Admin</span>
          </div>
        </header>

        {/* Dashboard Overview */}
        {activeTab === "dashboard" && (
          <div className="dashboard-content animate-fade">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon"><FiTrendingUp /></div>
                <div className="stat-info">
                  <h3>Total Sales</h3>
                  <div className="value">₹{calculateTotalSales()}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><FiBox /></div>
                <div className="stat-info">
                  <h3>Total Products</h3>
                  <div className="value">{products.length}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><FiUsers /></div>
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <div className="value">{users.length}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><FiCheckCircle /></div>
                <div className="stat-info">
                  <h3>Orders Completed</h3>
                  <div className="value">{orders.filter(o => o.status === 'Delivered').length}</div>
                </div>
              </div>
            </div>

            <section className="admin-section">
              <div className="section-header">
                <h2>Recent Orders</h2>
                <button className="admin-btn admin-btn-ghost" onClick={() => setActiveTab("orders")}>View All</button>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.userName}</td>
                        <td>₹{Number(order.total_amount).toFixed(2)}</td>
                        <td>
                          <span className={`status-tag ${order.status.toLowerCase()}`}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* Product Management */}
        {activeTab === "products" && (
          <div className="products-content animate-fade">
            <section className="admin-section">
              <div className="section-header">
                <h2>{editingProductId ? "Edit Product" : "Add New Product"}</h2>
              </div>
              <form className="admin-form-grid" onSubmit={handleProductSubmit}>
                <div className="admin-field">
                  <label>Name</label>
                  <input type="text" name="name" value={productForm.name} onChange={handleProductChange} required />
                </div>
                <div className="admin-field">
                  <label>Price (₹)</label>
                  <input type="number" name="price" value={productForm.price} onChange={handleProductChange} required />
                </div>
                <div className="admin-field">
                  <label>Stock</label>
                  <input type="number" name="stock" value={productForm.stock} onChange={handleProductChange} required />
                </div>
                <div className="admin-field">
                  <label>Category</label>
                  <input type="text" name="category" value={productForm.category} onChange={handleProductChange} />
                </div>
                <div className="admin-field">
                  <label>Strength</label>
                  <input type="text" name="strength" value={productForm.strength} onChange={handleProductChange} />
                </div>
                <div className="admin-field">
                  <label>Rating</label>
                  <input type="text" name="rating" value={productForm.rating} onChange={handleProductChange} />
                </div>
                <div className="admin-field" style={{ gridColumn: 'span 2' }}>
                  <label>Description</label>
                  <textarea name="description" value={productForm.description} onChange={handleProductChange} rows="2" />
                </div>
                <div className="admin-field">
                  <label>Image</label>
                  <input type="file" name="image" onChange={handleProductChange} accept="image/*" />
                </div>
                <div className="admin-field" style={{ justifyContent: 'flex-end', flexDirection: 'row', gap: '10px' }}>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    <FiPlus /> {editingProductId ? "Update" : "Add"} Product
                  </button>
                  {editingProductId && (
                    <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setEditingProductId(null)}>Cancel</button>
                  )}
                </div>
              </form>
            </section>

            <section className="admin-section">
              <div className="section-header">
                <h2>Product List</h2>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(prod => (
                      <tr key={prod.id}>
                        <td>{prod.id}</td>
                        <td>{prod.name}</td>
                        <td>₹{Number(prod.price).toFixed(2)}</td>
                        <td>{prod.stock}</td>
                        <td>
                          <div className="actions" style={{ display: 'flex', gap: '8px' }}>
                            <button className="admin-btn admin-btn-ghost" onClick={() => handleEditProduct(prod)}><FiEdit /></button>
                            <button className="admin-btn admin-btn-danger" onClick={() => handleDeleteProduct(prod.id)}><FiTrash2 /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* User Management */}
        {activeTab === "users" && (
          <section className="admin-section animate-fade">
            <div className="section-header">
              <h2>Registered Users</h2>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <button className="admin-btn admin-btn-danger" onClick={() => handleDeleteUser(user.id)}><FiTrash2 /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Order Management */}
        {activeTab === "orders" && (
          <section className="admin-section animate-fade">
            <div className="section-header">
              <h2>Order Records</h2>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong>{order.userName}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>{order.userEmail}</span>
                        </div>
                      </td>
                      <td>₹{Number(order.total_amount).toFixed(2)}</td>
                      <td>
                        <span className={`status-tag ${order.status.toLowerCase()}`}>{order.status}</span>
                      </td>
                      <td>
                        <select 
                          className="admin-field" 
                          style={{ padding: '4px 8px', width: 'auto' }}
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminPanel;
