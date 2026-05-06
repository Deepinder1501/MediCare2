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




import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="twinkle-background"></div> {/* Twinkling particle layer */}
        <div className="hero-content">
          <h1>MediCare: Your Health, Our Priority</h1>
          <p>
            Get India's most trusted healthcare platform delivering medical
            solutions with cutting-edge technology and uncompromising quality
          </p>
          <Link to="/products" className="btn sparkle-btn">
            Shop Now
          </Link>
        </div>
        <div className="hero-image">
          <div className="image-3d-wrapper">
            <img src="./assets/pharmacy-hero.jpg" alt="Pharmacy Hero" />
          </div>
        </div>
      </section>

      {/* Discover Products Section */}
      <section className="discover-section">
        <h2>Discover Our Products</h2>
        <div className="products-grid">
    <div className="product-card" data-tilt>
      <img src="./assets/tablets.jpeg" alt="Tablets" className="product-card-img"/>
      <span>Tablets</span>
    </div>
    <div className="product-card" data-tilt>
      <img src="./assets/capsule.jpeg" alt="Capsules" className="product-card-img"/>
      <span>Capsules</span>
    </div>
    <div className="product-card" data-tilt>
      <img src="./assets/syrup.jpeg" alt="Syrups" className="product-card-img"/>
      <span>Syrups</span>
    </div>
    <div className="product-card" data-tilt>
      <img src="./assets/vitamins.jpeg" alt="Vitamins" className="product-card-img"/>
      <span>Vitamins</span>
    </div>
  </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Product Categories</h2>
        <div className="categories-grid">
          <div className="category-card" data-tilt>
            Painkillers
          </div>
          <div className="category-card" data-tilt>
            Antibiotics
          </div>
          <div className="category-card" data-tilt>
            Capsules
          </div>
          <div className="category-card" data-tilt>
            Syrups
          </div>
          
          <div className="category-card" data-tilt>
            Diabetes
          </div>
          <div className="category-card" data-tilt>
            Blood Pressure
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;