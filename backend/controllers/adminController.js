import db from "../config/mysql.js";

export const getAllUsers = (req, res) => {
  const query = "SELECT id, name, email, gender, age, phone, address FROM users";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};


export const deleteUser = (req, res) => {
  const { id } = req.params;

  // Delete cart entry for user 
  const deleteCartQuery = "DELETE FROM cart WHERE user_id = ?";
  db.query(deleteCartQuery, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const deleteUserQuery = "DELETE FROM users WHERE id = ?";
    db.query(deleteUserQuery, [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
      res.json({ message: "User and their cart items deleted successfully" });
    });
  });
};



export const getAllProducts = (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};


export const addProduct = (req, res) => {
  const { name, description, price, stock, category, image, strength, expiry_date, rating } = req.body;
 
  if (!name || !price || !stock) {
    return res.status(400).json({ error: "Name, price, and stock are required" });
  }

  const query = `
    INSERT INTO products (name, description, price, stock, category, image, strength, expiry_date, rating, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(query, [name, description, price, stock, category, image, strength, expiry_date, rating], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product added successfully", productId: result.insertId });
  });
};

export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category, image, strength, expiry_date, rating } = req.body;

  const query = `
    UPDATE products 
    SET name=?, description=?, price=?, stock=?, category=?, image=?, strength=?, expiry_date=?, rating=?, updated_at=NOW()
    WHERE id=?
  `;

  db.query(query, [name, description, price, stock, category, image, strength, expiry_date, rating, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product updated successfully" });
  });
};

export const deleteProduct = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM products WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  });
};
