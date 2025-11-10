import express from "express";
import nodemailer from "nodemailer";  

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "deepinder1501@gmail.com",  
        pass: "lcbw qwvk otyc pthw",
      },
    });
 
    let mailOptions = {
      from: email,
      to: "deepinder1501@gmail.com",
      subject: `New Query from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Something went wrong. Try again later." });
  }
});

export default router;
