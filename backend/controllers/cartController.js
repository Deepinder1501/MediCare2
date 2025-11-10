import db from "../config/mysql.js";


export const addToCart = (req, res) => {
  const { userId, productId, quantity, scheduleType, nextOrderDate } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ error: "User and product required" });
  }

  
  const validScheduleTypes = ["none", "weekly", "monthly"];
  const finalScheduleType = scheduleType && validScheduleTypes.includes(scheduleType) ? scheduleType : "none";
  const finalNextOrderDate = nextOrderDate || null;

  
  const productQuery = "SELECT price FROM products WHERE id = ?";
  db.query(productQuery, [productId], (err, productResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (productResults.length === 0) return res.status(404).json({ error: "Product not found" });

    const price = productResults[0].price;

    // Check product already in cart
    const checkQuery = "SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND status='pending'";
    db.query(checkQuery, [userId, productId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        
        const updateQuery = `
          UPDATE cart 
          SET quantity = quantity + ?, 
              schedule_type = ?, 
              next_order_date = ?, 
              price = ?, 
              updated_at = NOW()
          WHERE id = ?`;
        db.query(updateQuery, [quantity || 1, finalScheduleType, finalNextOrderDate, price, results[0].id], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Cart updated with scheduling" });
        });
      } else {
        // Insert new item
        const insertQuery = `
          INSERT INTO cart 
          (user_id, product_id, quantity, price, schedule_type, next_order_date) 
          VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(insertQuery, [userId, productId, quantity || 1, price, finalScheduleType, finalNextOrderDate], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Product added to cart with scheduling" });
        });
      }
    });
  });
};

// cart for a user
export const getCart = (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT c.id as cartId, p.*, c.quantity, c.schedule_type, c.next_order_date, 
           c.price, (c.price * c.quantity) AS total_price, c.status
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ? AND c.status='pending'`;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// 
export const updateCartQuantity = (req, res) => {
  const { cartId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: "Quantity must be at least 1" });
  }

  const query = `
    UPDATE cart 
    SET quantity = ?, updated_at = NOW() 
    WHERE id = ?`;
  db.query(query, [quantity, cartId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cart quantity updated" });
  });
};

export const removeFromCart = (req, res) => {
  const { cartId } = req.params;
  const query = "DELETE FROM cart WHERE id = ?";
  db.query(query, [cartId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product removed from cart" });
  });
};
