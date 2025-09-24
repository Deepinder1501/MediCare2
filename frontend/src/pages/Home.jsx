import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="twinkle-background"></div> 
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