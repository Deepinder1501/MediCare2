import React, { useEffect, useState, useCallback } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import { getUserIdFromToken } from "../utils/jwt";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({});

  const userId = getUserIdFromToken();

  const fetchProducts = useCallback(async (query = "") => {
    setLoading(true);
    try {
      let res;
      if (query) {
        res = await API.get(`/products/search?q=${query}`);
      } else {
        res = await API.get("/products");
      }
      setProducts(res.data);

      // Initialize quantities
      const initialQtys = {};
      res.data.forEach(p => initialQtys[p.id] = 1);
      setQuantities(initialQtys);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchProducts]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = category === "All"
    ? products
    : products.filter((p) => p.category === category);

  const handleQtyChange = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleAddToCart = async (product) => {
    if (!userId) {
      setMessage("Please login to add products to cart");
      return;
    }

    try {
      const res = await API.post("/cart/add", {
        userId,
        productId: product.id,
        quantity: quantities[product.id] || 1,
        scheduleType: "none",
        nextOrderDate: null,
      });
      setMessage(res.data.message);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to add to cart");
    }
  };

  return (
    <div className="products-page">
      <div className="products-header animate-fade">
        <h1 className="page-title">Our Medicines</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for medicines, health products..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon"></span>
        </div>
      </div>

      <div className="categories-wrapper animate-fade">
        <div className="categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {message && <div className={`message-toast ${message.includes("login") ? "error" : "success"}`}>{message}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Finding the best medicines for you...</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card animate-fade">
                <div className="product-badge">{product.category}</div>
                <Link to={`/product/${product.id}`} className="product-image-wrapper">
                  <img
                    src={
                      product.image && product.image.startsWith("http")
                        ? product.image
                        : product.image && product.image.includes("-")
                          ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${product.image}`
                          : `/assets/${product.image}`
                    }
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="view-details-overlay">View Details</div>
                </Link>

                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-strength">{product.strength || "Standard Strength"}</p>
                  <div className="product-rating">
                    <span>⭐ {product.rating || "4.5"}</span>
                    <span className="stock-tag">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
                  </div>
                  <p className="product-price">₹{Number(product.price).toFixed(2)}</p>

                  <div className="product-actions">
                    <div className="qty-selector">
                      <button onClick={() => handleQtyChange(product.id, -1)}>-</button>
                      <span>{quantities[product.id] || 1}</span>
                      <button onClick={() => handleQtyChange(product.id, 1)}>+</button>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="add-btn"
                      disabled={product.stock <= 0}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <img src="/assets/no-results.png" alt="" />
              <h3>No results found</h3>
              <p>Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;