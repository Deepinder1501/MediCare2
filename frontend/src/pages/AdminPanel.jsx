// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import API from "../api";
import "./AdminPanel.css";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
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

  const handleEditProduct = (product) => {
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
    formData.append("name", productForm.name);
    formData.append("description", productForm.description);
    formData.append("price", Number(productForm.price));
    formData.append("stock", Number(productForm.stock));
    formData.append("category", productForm.category);
    formData.append("strength", productForm.strength);
    formData.append("expiry_date", productForm.expiry_date);
    formData.append("rating", productForm.rating);
    
    if (productForm.image) {
      formData.append("image", productForm.image);
    }

    try {
      if (editingProductId) {
        await API.put(
          `/admin/products/${editingProductId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await API.post(
          `/admin/products`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      setEditingProductId(null);
      setProductForm({
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

      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>

      <section className="products-section">
        <h2>{editingProductId ? "Edit Product" : "Add New Product"}</h2>

        <form className="admin-product-form" onSubmit={handleProductSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" name="name" placeholder="Enter name" value={productForm.name} onChange={handleProductChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" name="description" placeholder="Enter description" value={productForm.description} onChange={handleProductChange} />
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input type="number" name="price" placeholder="0.00" value={productForm.price} onChange={handleProductChange} required />
          </div>
          <div className="form-group">
            <label>Stock Quantity</label>
            <input type="number" name="stock" placeholder="0" value={productForm.stock} onChange={handleProductChange} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input type="text" name="category" placeholder="Category" value={productForm.category} onChange={handleProductChange} />
          </div>
          <div className="form-group">
            <label>Product Image</label>
            <input type="file" name="image" onChange={handleProductChange} accept="image/*" />
          </div>
          <div className="form-group">
            <label>Strength</label>
            <input type="text" name="strength" placeholder="e.g. 500mg" value={productForm.strength} onChange={handleProductChange} />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input type="date" name="expiry_date" value={productForm.expiry_date} onChange={handleProductChange} />
          </div>
          <div className="form-group">
            <label>Rating</label>
            <input type="text" name="rating" placeholder="4.5" value={productForm.rating} onChange={handleProductChange} />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingProductId ? "Update Product" : "Add Product"}
          </button>
          {editingProductId && (
            <button type="button" className="btn btn-secondary" onClick={() => setEditingProductId(null)}>
              Cancel Edit
            </button>
          )}
        </form>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Strength</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id}>
                  <td>{prod.id}</td>
                  <td>{prod.name}</td>
                  <td>₹{Number(prod.price).toFixed(2)}</td>
                  <td>{prod.stock}</td>
                  <td>{prod.category}</td>
                  <td>{prod.strength}</td>
                  <td>{prod.rating}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-edit" onClick={() => handleEditProduct(prod)}>Edit</button>
                      <button className="btn btn-delete" onClick={() => handleDeleteProduct(prod.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="users-section">
        <h2>Registered Users</h2>
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.gender}</td>
                  <td>{user.age}</td>
                  <td>{user.phone}</td>
                  <td>
                    <button className="btn btn-delete" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminPanel;
