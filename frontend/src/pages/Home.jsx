// import React from "react";
// import { Link } from "react-router-dom";
// import "./Home.css";

// function Home() {
//   return (
//     <div className="home-container">
//       {/* Hero Section */}
//       <section className="hero-section">
//         <div className="hero-content">
//           <h1>MediCare: Your Health, Our Priority</h1>
//           {/* <p>Get quality healthcare products delivered safely to your doorstep.</p> */}
//           <p>Get India's most trusted healthcare platform delivering  medical solutions with cutting-edge technology and uncompromising quality</p>
//           <Link to="/products" className="btn">Shop Now</Link>
//         </div>
//         <div className="hero-image">
//           <img src="./assets/pharmacy-hero.jpg" alt="" />
//         </div>
//       </section>

//       {/* Discover Products Section */}
//       <section className="discover-section">
//         <h2>Discover Our Products</h2>
//         <div className="products-grid">
//           <div className="product-card">Digital Thermometer</div>
//           <div className="product-card">Blood Pressure Monitor</div>
//           <div className="product-card">Hand Sanitizer</div>
//           <div className="product-card">Vitamin Supplements</div>
//           <div className="product-card">Face Masks</div>
//           <div className="product-card">Glucose Meter</div>
//         </div>
//       </section>

//       {/* Categories Section */}
//       <section className="categories-section">
//         <h2>Product Categories</h2>
//         <div className="categories-grid">
//           <div className="category-card">Painkillers</div>
//           <div className="category-card">Tablets</div>
//           <div className="category-card">Capsules</div>
//           <div className="category-card">Syrups</div>
//           <div className="category-card">Vitamins & Supplements</div>
//           <div className="category-card">Personal Care</div>
//           <div className="category-card">Medical Devices</div>
//           <div className="category-card">Health Monitoring</div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Home;




import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "./Home.css";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get("/products");
        // Just take the first 4 for the home page
        setFeaturedProducts(res.data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching featured products:", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="twinkle-background"></div>
        <div className="hero-content">
          <span className="hero-badge">Trusted by 10,000+ Families</span>
          <h1>MediCare: Your Health, Our Priority</h1>
          <p>
            India's most trusted healthcare platform delivering premium medical
            solutions with cutting-edge technology and uncompromising quality.
          </p>
          <div className="hero-btns">
            <Link to="/products" className="btn sparkle-btn">Shop Now</Link>
            <Link to="/about" className="btn btn-outline">Learn More</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-3d-wrapper">
            <img
              src="https://plus.unsplash.com/premium_photo-1661769786626-8025c37907ae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fG1lZGljaW5lfGVufDB8fDB8fHww"
              alt="Pharmacy Hero"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section animate-fade">
        <div className="stat-item">
          <h3>10k+</h3>
          <p>Happy Customers</p>
        </div>
        <div className="stat-item">
          <h3>500+</h3>
          <p>Medicines Available</p>
        </div>
        <div className="stat-item">
          <h3>24/7</h3>
          <p>Customer Support</p>
        </div>
        <div className="stat-item">
          <h3>1hr</h3>
          <p>Average Delivery</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose MediCare?</h2>
          <p>We combine technology with care to provide the best healthcare experience.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Certified Medicines</h3>
            <p>Every product in our store goes through rigorous quality checks.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Quick Reminders</h3>
            <p>Never miss a dose with our built-in medication reminder system.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Secure Payments</h3>
            <p>Multiple secure payment options for a hassle-free checkout.</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="discover-section featured-products">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Our most popular and trusted healthcare solutions.</p>
        </div>
        <div className="products-grid">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="product-card" data-tilt>
                <div className="product-badge-small">{product.category}</div>
                <img
                  src={product.image && product.image.startsWith("http") ? product.image : `/assets/${product.image}`}
                  alt={product.name}
                  className="product-card-img"
                  onError={(e) => (e.target.src = "/assets/fallback-image.jpg")}
                />
                <div className="product-card-info">
                  <h3>{product.name}</h3>
                  <span className="price">₹{Number(product.price).toFixed(2)}</span>
                </div>
              </Link>
            ))
          ) : (
            <p>Loading products...</p>
          )}
        </div>
        <div className="view-all-container">
          <Link to="/products" className="btn btn-secondary">View All Products</Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Our Customers Say</h2>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"The medication reminder feature is a lifesaver. I never forget my parents' doses anymore. Excellent service!"</p>
            <div className="user-info">
              <strong>Rajesh Kumar</strong>
              <span>Verified Customer</span>
            </div>
          </div>
          <div className="testimonial-card">
            <p>"Fast delivery and genuine medicines. The user interface is very smooth and easy to use. Highly recommended."</p>
            <div className="user-info">
              <strong>Priya Sharma</strong>
              <span>Verified Customer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Quick Categories</h2>
        </div>
        <div className="categories-grid">
          <div className="category-card" data-tilt>Painkillers</div>
          <div className="category-card" data-tilt>Antibiotics</div>
          <div className="category-card" data-tilt>Capsules</div>
          <div className="category-card" data-tilt>Syrups</div>
          <div className="category-card" data-tilt>Vitamins</div>
          <div className="category-card" data-tilt>Health Monitoring</div>
        </div>
      </section>
    </div>
  );
}

export default Home;
