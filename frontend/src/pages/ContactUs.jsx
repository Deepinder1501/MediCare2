import React, { useState } from "react";
import "./ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({ type: "success", message: "Message sent successfully " });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({ type: "error", message: data.error || "Failed to send " });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Server error. Try again later " });
    }

    setLoading(false);
  };

  return (
    <div className="contact container">
      <form onSubmit={handleSubmit}>
        <div className="form">
          {/* Left side info */}
          <div className="form-txt">
            <h1>Contact Us</h1>
            <span>
              As you might expect of a company that began as a high-end interiors
              contractor, we pay strict attention.
            </span>

           
            <h3>India</h3>
            <p>
              Chitkara University, Rajpura <br />
              Punjab<br />
              +91 9501679224
            </p>

            {/* ✅ Status Message */}
            {status.message && (
              <div
                className={`status-message ${
                  status.type === "success" ? "success" : "error"
                }`}
              >
                {status.message}
              </div>
            )}
          </div>

          {/* Right side form */}
          <div className="form-details">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Message"
              rows="7"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "SEND MESSAGE"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactUs;
