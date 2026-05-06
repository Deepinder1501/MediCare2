import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    phone: "",
    address: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", formData);

      if (res.status === 201 || res.status === 200) {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong!");
      console.error(err);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Join MediCare today for better health</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <input
            className="signup-input full-width"
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            className="signup-input full-width"
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />
          <input
            className="signup-input full-width"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          
          <select
            className="signup-input"
            name="gender"
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          
          <input
            className="signup-input"
            type="number"
            name="age"
            placeholder="Age"
            onChange={handleChange}
            required
          />
          
          <input
            className="signup-input full-width"
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
          />
          
          <textarea
            className="signup-input full-width"
            name="address"
            placeholder="Address"
            onChange={handleChange}
            rows="3"
            style={{ resize: "none", padding: "12px 14px", borderRadius: "8px", border: "1px solid #ccc" }}
          ></textarea>

          <button className="signup-button" type="submit">
            Create Account
          </button>
          
          {message && (
            <p className={`signup-message full-width ${message.toLowerCase().includes("success") ? "success-text" : "error-text"}`}>
              {message}
            </p>
          )}
        </form>

        <div className="signup-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
