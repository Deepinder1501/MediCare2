import React, { useState } from "react";
import API from "../api";
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
      const res = await API.post("/contact", formData);

      if (res.data.success) {
        setStatus({ type: "success", message: "Message sent successfully ✅" });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({ type: "error", message: res.data.error || "Failed to send ❌" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: err.response?.data?.error || "Server error. Try again later ❌" });
    }

    setLoading(false);
  };

  return (
    <div className="contact-page">
      <div className="contact-container animate-fade">
        <div className="contact-info">
          <h1>Contact Us</h1>
          <p>
            Have questions about our medicines or services? Our team is here to help you 24/7.
          </p>

          <div className="info-item">
            <h3>Headquarters</h3>
            <p>
              Chitkara University, Rajpura<br />
              Punjab, India
            </p>
          </div>

          <div className="info-item">
            <h3>Phone</h3>
            <p>+91 9501679224</p>
          </div>

          <div className="info-item">
            <h3>Email</h3>
            <p>support@medicare.com</p>
          </div>
        </div>

        <div className="contact-form-section">
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send a Message</h2>
            
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                placeholder="How can we help?"
                rows="5"
                style={{ resize: "none" }}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>

            {status.message && (
              <div className={`status-message ${status.type === "success" ? "success" : "error"}`}>
                {status.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
