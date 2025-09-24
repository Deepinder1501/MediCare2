import { useState, useEffect } from "react";
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

  // Fetch current user
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setFormData({ ...data.user, password: "" }); 
        } else {
          setMessage(data.error || "Failed to fetch profile");
        }
      } catch (err) {
        console.error(err);
        setMessage("Something went wrong!");
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
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
        localStorage.setItem("username", formData.name);
        setFormData({ ...formData, password: "" }); 
      } else {
        setMessage(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong!");
    }
  };

  return (
    <div className="profile-container">
      
      <form className="profile-form" onSubmit={handleUpdate}>
        <h2 className="profile-title">Update Profile</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
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
          readOnly
          
        />
        <input
          type="password"
          name="password"
          placeholder="New Password (leave blank if no change)"
          value={formData.password}
          onChange={handleChange}
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
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
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone || ""}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address || ""}
          onChange={handleChange}
        />
        <button type="submit" className="profile-button">
          Update Profile
        </button>
        {message && <p className="profile-message">{message}</p>}
      </form>
      
    </div>
  );
}

export default Profile;
