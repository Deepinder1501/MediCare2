import db from "../config/mysql.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// Signup
export const signup = (req, res) => {
  const { name, email, password, gender, age, phone, address } = req.body;

  // validation
  if (!name || !email || !password || !gender || !age) {
    return res.status(400).json({ error: "Please fill all required fields" });
  }

  // hash pass
  const hashedPassword = bcrypt.hashSync(password, 8);

  // insert
  const query = "INSERT INTO users (name, email, password, gender, age, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(query, [name, email, hashedPassword, gender, age, phone || null, address || null], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User registered successfully", userId: result.insertId });
  });
};


export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ error: "User not found" });

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // generate token
    const token = jwt.sign({ id: user.id, email: user.email }, "secret123", { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        age: user.age,
        phone: user.phone,
        address: user.address
      }
    });
  });
};
