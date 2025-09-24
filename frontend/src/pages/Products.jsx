import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserIdFromToken } from "../utils/jwt";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");

  const userId = getUserIdFromToken();

  useEffect(() => {
    fetch("http://localhost:5000/api/products", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filteredProducts =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  const handleAddToCart = (product, quantity) => {
    if (!userId) {
      setMessage("Please login to add products to cart");
      return;
    }

    fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        productId: product.id,
        quantity,
        scheduleType: "none",
        nextOrderDate: null,
      }),
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  };

  return (
    <div className="products-page">
      <h1 className="page-title">Our Medicines</h1>

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

      {message && <p className={`message ${message.includes("login") ? "error-message" : "success-message"}`}>{message}</p>}

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`} className="product-link">
              <img
                src={`/assets/${product.image}`}
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
            </Link>
            <p className="product-price">Price: ₹{product.price}</p>
            
            <div className="quantity-add">
              <input
                type="number"
                min="1"
                defaultValue={1}
                id={`qty-${product.id}`}
                className="quantity-input"
              />
              <button
                onClick={() =>
                  handleAddToCart(
                    product,
                    Number(document.getElementById(`qty-${product.id}`).value)
                  )
                }
                className="add-to-cart-btn"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;