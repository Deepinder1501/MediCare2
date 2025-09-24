import db from "../config/mysql.js";
import bcrypt from "bcryptjs";

// GET profile
export const getProfile = (req, res) => {
  const userId = req.user.id;

  const query = "SELECT id, name, email, gender, age, phone, address FROM users WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    res.json({ user: results[0] });
  });
};

// UPDATE profile
export const updateProfile = (req, res) => {
  const userId = req.user.id;
  const { name, email, password, gender, age, phone, address } = req.body;

  let hashedPassword = null;
  if (password) {
    hashedPassword = bcrypt.hashSync(password, 8);
  }

  const query = `
    UPDATE users 
    SET name = ?, email = ?, ${hashedPassword ? "password = ?, " : ""} gender = ?, age = ?, phone = ?, address = ? 
    WHERE id = ?
  `;

  const params = hashedPassword
    ? [name, email, hashedPassword, gender, age, phone || null, address || null, userId]
    : [name, email, gender, age, phone || null, address || null, userId];

  db.query(query, params, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "Profile updated successfully",
      user: { id: userId, name, email, gender, age, phone, address },
    });
  });
};
