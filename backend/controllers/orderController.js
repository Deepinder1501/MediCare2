import db from "../config/mysql.js";

// Create a new order
export const createOrder = (req, res) => {
  const { userId, items, totalAmount, shippingAddress, phone, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  // Start transaction
  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    const orderQuery = "INSERT INTO orders (userId, totalAmount, shippingAddress, phone, paymentMethod) VALUES (?, ?, ?, ?, ?)";
    db.query(orderQuery, [userId, totalAmount, shippingAddress, phone, paymentMethod], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: err.message });
        });
      }

      const orderId = result.insertId;
      const orderItems = items.map(item => [orderId, item.productId, item.quantity, item.price]);

      const itemsQuery = "INSERT INTO order_items (orderId, productId, quantity, price) VALUES ?";
      db.query(itemsQuery, [orderItems], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        // Clear user's cart
        const clearCartQuery = "DELETE FROM cart WHERE userId = ?";
        db.query(clearCartQuery, [userId], (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }
            res.status(201).json({ message: "Order placed successfully", orderId });
          });
        });
      });
    });
  });
};

// Get orders for a specific user
export const getUserOrders = (req, res) => {
  const { userId } = req.params;
  const query = "SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC";
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get order details
export const getOrderDetails = (req, res) => {
  const { orderId } = req.params;
  const query = `
    SELECT oi.*, p.name, p.image 
    FROM order_items oi 
    JOIN products p ON oi.productId = p.id 
    WHERE oi.orderId = ?
  `;
  db.query(query, [orderId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
