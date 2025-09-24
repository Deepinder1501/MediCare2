// // src/pages/ProductDetails.jsx
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./ProductDetails.css";
// import { getUserIdFromToken } from "../utils/jwt";

// function ProductDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [scheduleType, setScheduleType] = useState("none");
//   const [nextOrderDate, setNextOrderDate] = useState("");
//   const [message, setMessage] = useState("");

//   const tokenUserId = getUserIdFromToken();

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/products/${id}`)
//       .then((res) => res.json())
//       .then((data) => setProduct(data))
//       .catch((err) => console.error(err));
//   }, [id]);

//   const handleAddToCart = async () => {
//     if (!tokenUserId) {
//       setMessage("You must be logged in to add items to cart");
//       return;
//     }

//     const payload = {
//       userId: tokenUserId,
//       productId: product.id,
//       quantity,
//       scheduleType,
//       nextOrderDate: scheduleType !== "none" ? nextOrderDate : null
//     };

//     try {
//       const res = await fetch("http://localhost:5000/api/cart/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setMessage(data.message);
//       } else {
//         setMessage(data.error);
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("Something went wrong!");
//     }
//   };

//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="product-details-container">
//       <img src={`/assets/${product.image}`} alt={product.name} className="product-image" />
//       <div className="product-info">
//         <h2>{product.name}</h2>
//         <p className="category">{product.category}</p>
//         <p className="price">Price: ₹{product.price}</p>
//         <p className="description">{product.description}</p>
//         <p className="strength">Strength: {product.strength}</p>
//         <p className="expiry">Expiry: {new Date(product.expiry_date).toLocaleDateString()}</p>

//         <div className="actions">
//           <label>
//             Quantity:
//             <input
//               type="number"
//               min="1"
//               value={quantity}
//               onChange={(e) => setQuantity(Number(e.target.value))}
//             />
//           </label>

//           <label>
//             Schedule:
//             <select value={scheduleType} onChange={(e) => setScheduleType(e.target.value)}>
//               <option value="none">None</option>
//               <option value="weekly">Weekly</option>
//               <option value="monthly">Monthly</option>
//             </select>
//           </label>

//           {scheduleType !== "none" && (
//             <label>
//               Next Order Date:
//               <input
//                 type="date"
//                 value={nextOrderDate}
//                 onChange={(e) => setNextOrderDate(e.target.value)}
//               />
//             </label>
//           )}

//           <button onClick={handleAddToCart}>Add to Cart</button>
//           {message && <p className="message">{message}</p>}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductDetails;







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
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
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
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setMessage(data.message || data.error);
      if (res.ok) {
        setTimeout(() => navigate("/cart"), 1500); // Redirect to cart on success
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
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
          src={`/assets/${product.image}`}
          alt={product.name}
          className="product-image"
          onError={(e) => (e.target.src = "/assets/fallback-image.jpg")} // Fallback image
        />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="category">{product.category}</p>
          <p className="price">₹{product.price.toFixed(2)}</p>
          <p className="description">{product.description}</p>
          <p className="strength">Strength: {product.strength}</p>
          <p className="expiry">
            Expiry: {new Date(product.expiry_date).toLocaleDateString()}
          </p>

          <div className="actions">
            <label className="input-group">
              Quantity:
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                aria-label="Quantity"
              />
            </label>

            <label className="input-group">
              Schedule:
              <select
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
              <label className="input-group">
                Next Order Date:
                <input
                  type="date"
                  value={nextOrderDate}
                  onChange={(e) => setNextOrderDate(e.target.value)}
                  aria-label="Next order date"
                />
              </label>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              aria-label="Add to cart"
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </button>
            {message && <p className={`message ${message.includes("error") ? "error" : ""}`}>
              {message}
            </p>}
            <button
              className="back-btn"
              onClick={() => navigate("/products")}
              aria-label="Back to products"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;