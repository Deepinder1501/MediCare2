import { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token and name 
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.name); 

        // Decode username from token 
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        const username = payload.name || payload.email || "User";

        setMessage("Login successful!");
        window.location.href = "/";
      } else {
        setMessage(data.error || "Invalid credentials");
      }
    } catch (err) {
      setMessage("Something went wrong!");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="login-welcome">Welcome Back</h1>
        <p className="login-subtext">Login to continue</p>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              id="email"
              className="login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              id="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button id="login-submit" className="login-button" type="submit">
              Login
            </button>
            {message && <p className="login-message">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
