import React, { useEffect, useState } from "react";
import axios from "axios";
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
    image: "",
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
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`);
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
      image: product.image || "",
      strength: product.strength || "",
      expiry_date: product.expiry_date?.split("T")[0] || "",
      rating: product.rating || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  };


  const handleProductChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };


  const handleProductSubmit = async (e) => {
    e.preventDefault();

    // Ensure numeric fields are numbers
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock)
    };

    try {
      if (editingProductId) {
        await axios.put(
          `http://localhost:5000/api/admin/products/${editingProductId}`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
      } else {
        await axios.post(
          `http://localhost:5000/api/admin/products`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
      }

      setEditingProductId(null);
      setProductForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: "",
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
      <h1>Admin Panel</h1>

      {/* USERS SECTION */}
     {/* USERS SECTION */}
<section className="users-section">
  <h2>Users</h2>
  <table className="users-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Gender</th>
        <th>Age</th>
        <th>Phone</th>
        <th>Address</th>
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
          <td>{user.address}</td>
          <td>
            <button className="btn delete" onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</section>

{/* PRODUCTS SECTION */}
<section className="products-section">
  <h2>Products</h2>

  {/* PRODUCT FORM */}
  <form className="product-form admin-product-form" onSubmit={handleProductSubmit}>
    <input className="admin-product-input" type="text" name="name" placeholder="Name" value={productForm.name} onChange={handleProductChange} required />
    <input className="admin-product-input" type="text" name="description" placeholder="Description" value={productForm.description} onChange={handleProductChange} />
    <input className="admin-product-input" type="number" name="price" placeholder="Price" value={productForm.price} onChange={handleProductChange} required />
    <input className="admin-product-input" type="number" name="stock" placeholder="Stock" value={productForm.stock} onChange={handleProductChange} required />
    <input className="admin-product-input" type="text" name="category" placeholder="Category" value={productForm.category} onChange={handleProductChange} />
    <input className="admin-product-input" type="text" name="image" placeholder="Image filename" value={productForm.image} onChange={handleProductChange} />
    <input className="admin-product-input" type="text" name="strength" placeholder="Strength" value={productForm.strength} onChange={handleProductChange} />
    <input className="admin-product-input" type="date" name="expiry_date" value={productForm.expiry_date} onChange={handleProductChange} />
    <input className="admin-product-input" type="text" name="rating" placeholder="Rating" value={productForm.rating} onChange={handleProductChange} />
    <button type="submit">{editingProductId ? "Update Product" : "Add Product"}</button>
  </form>

  {/* PRODUCTS TABLE */}
  <table className="products-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Description</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Category</th>
        <th>Strength</th>
        <th>Expiry</th>
        <th>Rating</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {products.map((prod) => (
        <tr key={prod.id}>
          <td>{prod.id}</td>
          <td>{prod.name}</td>
          <td>{prod.description}</td>
          <td>{prod.price}</td>
          <td>{prod.stock}</td>
          <td>{prod.category}</td>
          <td>{prod.strength}</td>
          <td>{prod.expiry_date?.split("T")[0]}</td>
          <td>{prod.rating}</td>
          <td>
            <button className="btn edit" onClick={() => handleEditProduct(prod)}>Edit</button>
            <button className="btn delete" onClick={() => handleDeleteProduct(prod.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</section>

    </div>
  );
}

export default AdminPanel;
