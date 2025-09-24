import cron from "node-cron";
import db from "./config/mysql.js";
import nodemailer from "nodemailer";

// Setup your email transporter (example using Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "deepinder1501@gmail.com",
    pass: "lcbw qwvk otyc pthw" // use App Password if 2FA is enabled
  }
});

// Run every day at 8 AM
cron.schedule("0 8 * * *", () => {
  console.log("Running scheduled orders...");

  const today = new Date().toISOString().split("T")[0];

  const query = `
    SELECT c.id as cartId, c.user_id, u.email, c.product_id, p.name, c.quantity, c.schedule_type 
    FROM cart c
    JOIN users u ON c.user_id = u.id
    JOIN products p ON c.product_id = p.id
    WHERE c.schedule_type != 'none' AND c.next_order_date = ? AND c.status='pending'
  `;

  db.query(query, [today], (err, results) => {
    if (err) return console.error(err);

    results.forEach(item => {
      // Mark cart item as ordered
      const updateQuery = "UPDATE cart SET status='ordered' WHERE id=?";
      db.query(updateQuery, [item.cartId], (err) => {
        if (err) return console.error(err);

        console.log(`Processed scheduled order for cart ID ${item.cartId}`);

        // Send notification email to user
        const mailOptions = {
          from: "deepinder1501@gmail.com",
          to: item.email,
          subject: "Scheduled Medicine Order Processed",
          text: `Hi, your scheduled order for ${item.quantity} x ${item.name} has been processed today.`
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) console.error(err);
          else console.log(`Email sent to ${item.email}: ${info.response}`);
        });
      });

      // Update next_order_date for recurring orders
      if (item.schedule_type === 'weekly') {
        const nextDateQuery = "UPDATE cart SET next_order_date = DATE_ADD(next_order_date, INTERVAL 7 DAY), status='pending' WHERE id=?";
        db.query(nextDateQuery, [item.cartId], (err) => {
          if (err) console.error(err);
        });
      } else if (item.schedule_type === 'monthly') {
        const nextDateQuery = "UPDATE cart SET next_order_date = DATE_ADD(next_order_date, INTERVAL 1 MONTH), status='pending' WHERE id=?";
        db.query(nextDateQuery, [item.cartId], (err) => {
          if (err) console.error(err);
        });
      }
    });
  });
});
