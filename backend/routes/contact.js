import express from "express";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    console.log("📨 Sending email via Resend API...");

    const { data, error } = await resend.emails.send({
      from: "MediCare <onboarding@resend.dev>",
      to: "deepinder1501@gmail.com", // Your email
      subject: `New Query from ${name}`,
      reply_to: email,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Email sent successfully:", data.id);
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("❌ API Error:", err.message);
    res.status(500).json({ error: `Server Error: ${err.message}` });
  }
});

export default router;
