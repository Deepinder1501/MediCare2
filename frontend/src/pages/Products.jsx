import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import { getUserIdFromToken } from "../utils/jwt";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filteredProducts =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  const handleAddToCart = async (product, quantity) => {
    if (!userId) {
      setMessage("Please login to add products to cart");
      return;
    }

    try {
      const res = await API.post("/cart/add", {
        userId,
        productId: product.id,
        quantity,
        scheduleType: "none",
        nextOrderDate: null,
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage("Failed to add to cart");
    }
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
                src={product.image && product.image.includes("-") ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${product.image}` : `/assets/${product.image}`}
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