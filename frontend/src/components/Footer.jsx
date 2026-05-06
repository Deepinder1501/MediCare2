import React from "react";
import { FaFacebookF, FaTwitter, FaSnapchatGhost, FaInstagram } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-clean">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-item">
            <h3>Services</h3>
            <ul>
              <li><a href="#">Web design</a></li>
              <li><a href="#">Development</a></li>
              <li><a href="#">Hosting</a></li>
            </ul>
          </div>
          <div className="footer-item">
            <h3>About</h3>
            <ul>
              <li><a href="#">Company</a></li>
              <li><a href="#">Team</a></li>
              <li><a href="#">Legacy</a></li>
            </ul>
          </div>
          <div className="footer-item">
            <h3>Careers</h3>
            <ul>
              <li><a href="#">Job openings</a></li>
              <li><a href="#">Employee success</a></li>
              <li><a href="#">Benefits</a></li>
            </ul>
          </div>
          <div className="footer-item social">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaSnapchatGhost /></a>
            <a href="#"><FaInstagram /></a>
            <p className="copyright">Company Name © 2025</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
