import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    phone: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (res.ok) {
      // Save token
      localStorage.setItem("token", data.token ); 
      localStorage.setItem("username", formData.name);

      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setMessage(data.error || "Signup failed.");
    }
  } catch (err) {
    setMessage("Something went wrong!");
    console.error(err);
  }
};


  return (
    <div className="signup-container">
      <div className="signup-left">
        <h1 className="signup-welcome">Join Us</h1>
        <p className="signup-subtext">Create your account to get started</p>
      </div>

     
      <div className="signup-right">
        <div className="signup-box">
          <h2 className="signup-title">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="signup-input"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="signup-input"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="signup-input"
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="signup-input"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="signup-input"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="signup-input"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="signup-input"
            />
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>
          {message && <p className="signup-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Signup;
