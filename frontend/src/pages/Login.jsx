import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      if (res.status === 200) {
        const data = res.data;
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.name); 
        localStorage.setItem("role", data.user.role);

        setMessage("Login successful!");
        window.location.href = "/";
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong!");
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login to your MediCare account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            className="login-input"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="login-button" type="submit">
            Sign In
          </button>
          
          {message && (
            <p className={`login-message ${message.toLowerCase().includes("success") ? "success-text" : "error-text"}`}>
              {message}
            </p>
          )}
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/signup">Create Account</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
