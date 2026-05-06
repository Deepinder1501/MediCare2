import db from "../config/mysql.js";

// Fetch all reminders for a specific user
export const getReminders = (req, res) => {
  const { userId } = req.params;
  const query = "SELECT * FROM reminders WHERE userId = ? ORDER BY reminderTime ASC";

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Add a new reminder
export const addReminder = (req, res) => {
  const { userId, medicineName, reminderTime, repeatType, repeatInterval } = req.body;

  if (!userId || !medicineName || !reminderTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = "INSERT INTO reminders (userId, medicineName, reminderTime, repeatType, repeatInterval) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [userId, medicineName, reminderTime, repeatType || 'none', repeatInterval || 0], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Reminder added successfully", id: result.insertId });
  });
};

// Update an existing reminder
export const updateReminder = (req, res) => {
  const { id } = req.params;
  const { medicineName, reminderTime, repeatType, repeatInterval } = req.body;

  const query = "UPDATE reminders SET medicineName = ?, reminderTime = ?, repeatType = ?, repeatInterval = ? WHERE id = ?";
  db.query(query, [medicineName, reminderTime, repeatType, repeatInterval, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Reminder updated successfully" });
  });
};

// Delete a reminder
export const deleteReminder = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM reminders WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Reminder deleted successfully" });
  });
};
