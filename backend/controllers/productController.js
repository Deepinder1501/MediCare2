import db from "../config/mysql.js";

// Get all products
export const getAllProducts = (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get single product by ID
export const getProductById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM products WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(results[0]);
  });
};

// Search products
export const searchProducts = (req, res) => {
  const { q } = req.query;
  const searchQuery = `%${q}%`;
  const query = "SELECT * FROM products WHERE name LIKE ? OR description LIKE ? OR category LIKE ?";
  db.query(query, [searchQuery, searchQuery, searchQuery], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
