import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";
import { getUserIdFromToken } from "../utils/jwt";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [scheduleType, setScheduleType] = useState("none");
  const [nextOrderDate, setNextOrderDate] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const tokenUserId = getUserIdFromToken();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setProduct(null);
        setMessage("Failed to load product. Please try again.");
        console.error("Product fetch error:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!tokenUserId) {
      setMessage("You must be logged in to add items to cart.");
      setTimeout(() => navigate("/login"), 1800);
      return;
    }
    setIsLoading(true);

    const payload = {
      userId: tokenUserId,
      productId: product.id,
      quantity,
      scheduleType,
      nextOrderDate: scheduleType !== "none" ? nextOrderDate : null,
    };

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setMessage(data.message || data.error || "Could not add product.");
      if (res.ok) {
        setTimeout(() => navigate("/cart"), 1500);
      }
    } catch (err) {
      setMessage("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product && !message) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="product-details-card">
        <img
          src={product && product.image ? `/assets/${product.image}` : "/assets/fallback-image.jpg"}
          alt={product ? product.name : "Product image"}
          className="product-image"
          onError={(e) => (e.target.src = "/assets/fallback-image.jpg")}
        />
        <div className="product-info">
          <h2>{product?.name || "Unnamed Product"}</h2>
          <p className="category">{product?.category || "-"}</p>
          <p className="price">
            {product && product.price !== undefined && product.price !== null && !isNaN(Number(product.price))
              ? `₹${Number(product.price).toFixed(2)}`
              : "₹0.00"}
          </p>
          <p className="description">{product?.description || "No description."}</p>
          <p className="strength">Strength: {product?.strength || "N/A"}</p>
          <p className="expiry">
            Expiry: {product?.expiry_date ? new Date(product.expiry_date).toLocaleDateString() : "N/A"}
          </p>
          <div className="actions-row">
            <label className="input-group" htmlFor="quantity">
              Quantity:
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                aria-label="Quantity"
              />
            </label>
            <label className="input-group" htmlFor="schedule-type">
              Schedule:
              <select
                id="schedule-type"
                value={scheduleType}
                onChange={(e) => setScheduleType(e.target.value)}
                aria-label="Schedule type"
              >
                <option value="none">None</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
            {scheduleType !== "none" && (
              <label className="input-group" htmlFor="next-order-date">
                Next Order Date:
                <input
                  id="next-order-date"
                  type="date"
                  value={nextOrderDate}
                  onChange={(e) => setNextOrderDate(e.target.value)}
                  aria-label="Next order date"
                  min={new Date().toISOString().split("T")[0]}
                />
              </label>
            )}
            <button className="addcart" onClick={handleAddToCart} disabled={isLoading || quantity < 1} aria-label="Add to cart">
              {isLoading ? "Adding..." : "Add to Cart"}
            </button>
          </div>
          {message && (
            <p className={`message ${message.toLowerCase().includes("fail") || message.toLowerCase().includes("error") ? "error" : ""}`}>
              {message}
            </p>
          )}
          <button className="back-btn" onClick={() => navigate("/products")} aria-label="Back to products">
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
