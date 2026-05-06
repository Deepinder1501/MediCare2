import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserShield } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    
    if (token) {
      setIsLoggedIn(true);
      setUsername(storedUsername || "User");
      setIsAdmin(role === "admin");
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">MediCare</Link>
      </div>
      <div className="navbar-center">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/about">About Us</Link>
        <Link to="/reminders">Reminders</Link>
      </div>
      <div className="navbar-right">
        {isAdmin && (
          <Link to="/admin" className="btn btn-admin">
            <FaUserShield style={{ marginRight: "5px" }} /> Admin Panel
          </Link>
        )}
        {!isLoggedIn ? (
          <>
            <Link to="/cart" className="btn btn-secondary"><FaShoppingCart style={{ marginRight: "5px" }} />Cart</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="navbar-user">Hi, {username}</Link>
            <Link to="/cart" className="btn btn-secondary"><FaShoppingCart style={{ marginRight: "5px" }} />Cart</Link>
            <button onClick={handleLogout} className="btn btn-logout">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
