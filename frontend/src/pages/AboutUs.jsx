import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <h2 className="about-title">About Us</h2>
      <p className="about-subtitle">
        Welcome to MediCare! We are dedicated to providing the best medical products
        and services to our customers with quality, reliability, and care.
      </p>

      <div className="about-cards">
        <div className="about-card">
          <h3>Our Mission</h3>
          <p>
            To make healthcare accessible and affordable for everyone by offering
            quality medicines and medical products online.
          </p>
        </div>

        <div className="about-card">
          <h3>Our Vision</h3>
          <p>
            To be the most trusted online medical platform, providing excellent
            customer service and safe, reliable products.
          </p>
        </div>

        <div className="about-card">
          <h3>Our Values</h3>
          <p>
            Integrity, Customer Care, Innovation, and Commitment to making a
            difference in healthcare.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
