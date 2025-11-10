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



   // Validate id is number
  if (!Number(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  
  const query = "SELECT * FROM products WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(results[0]);
  });
};
