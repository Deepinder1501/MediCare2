import { useState, useEffect } from "react";
import API from "../api";
import "./Profile.css";

function Profile() {
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
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        if (res.status === 200) {
          setFormData({ ...res.data.user, password: "" });
        }
      } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.error || "Failed to fetch profile");
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage("You must be logged in to update profile.");
      return;
    }

    try {
      const res = await API.put("/auth/profile", formData);

      if (res.status === 200) {
        setMessage("Profile updated successfully!");
        localStorage.setItem("username", formData.name);
        setFormData({ ...formData, password: "" });
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card animate-fade">
        <h2 className="profile-title">Profile Settings</h2>
        
        <form className="profile-form" onSubmit={handleUpdate}>
          <div className="form-group full-width">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Email Address (Read-only)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
            />
          </div>

          <div className="form-group full-width">
            <label>New Password</label>
            <input
              type="password"
              name="password"
              placeholder="Leave blank to keep current"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Shipping Address</label>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address || ""}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="profile-button btn btn-primary">
            Save Changes
          </button>
          
          {message && (
            <p className={`profile-message full-width ${message.toLowerCase().includes("success") ? "success-text" : "error-text"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;
