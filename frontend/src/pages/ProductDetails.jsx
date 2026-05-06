import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
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
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load product. Please try again.");
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!tokenUserId) {
      setMessage("You must be logged in to add items to cart.");
      setTimeout(() => navigate("/login"), 2000);
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
      const res = await API.post("/cart/add", payload);

      setMessage(res.data.message);
      if (res.status === 200 || res.status === 201) {
        setTimeout(() => navigate("/cart"), 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "100px" }}>
        <p>Loading product details...</p>
      </div>
    );
  }

  const imageUrl = product.image && product.image.includes("-") 
    ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${product.image}` 
    : `/assets/${product.image}`;

  return (
    <div className="product-details-page">
      <div className="product-details-container animate-fade">
        <div className="image-section">
          <img
            src={imageUrl}
            alt={product.name}
            className="product-details-image"
            onError={(e) => (e.target.src = "/assets/fallback-image.jpg")}
          />
        </div>
        
        <div className="product-details-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-price">₹{Number(product.price).toFixed(2)}</p>
          <p className="product-description">{product.description}</p>
          
          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Strength</span>
              <span className="meta-value">{product.strength || "N/A"}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Expiry Date</span>
              <span className="meta-value">{new Date(product.expiry_date).toLocaleDateString()}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Rating</span>
              <span className="meta-value">⭐ {product.rating || "4.0"}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Stock</span>
              <span className="meta-value">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
            </div>
          </div>

          <div className="order-options">
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>Subscription Schedule</label>
              <select
                value={scheduleType}
                onChange={(e) => setScheduleType(e.target.value)}
              >
                <option value="none">One-time purchase</option>
                <option value="weekly">Weekly Delivery</option>
                <option value="monthly">Monthly Delivery</option>
              </select>
            </div>

            {scheduleType !== "none" && (
              <div className="form-group">
                <label>First Delivery Date</label>
                <input
                  type="date"
                  value={nextOrderDate}
                  onChange={(e) => setNextOrderDate(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="actions">
            <button
              onClick={handleAddToCart}
              disabled={isLoading || product.stock <= 0}
              className="btn btn-primary btn-add-cart"
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </button>
            <button
              className="btn btn-secondary btn-back"
              onClick={() => navigate("/products")}
            >
              Back
            </button>
          </div>
          
          {message && (
            <p className={`profile-message ${message.toLowerCase().includes("success") ? "" : "error"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;