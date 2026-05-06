import React, { useState, useEffect, useCallback } from "react";
import API from "../api";
import { getUserIdFromToken } from "../utils/jwt";
import "./Reminders.css";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [repeatType, setRepeatType] = useState("none");
  const [repeatInterval, setRepeatInterval] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [lastNotified, setLastNotified] = useState({});
  const userId = getUserIdFromToken();

  const fetchReminders = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await API.get(`/reminders/${userId}`);
      setReminders(res.data);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    }
  }, [userId]);

  useEffect(() => {
    fetchReminders();
    
    // Request permission immediately on mount
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        console.log("Notification permission:", permission);
      });
    }
  }, [fetchReminders]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      // Ensure we get HH:MM in 24h format accurately
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      
      const currentTimestamp = Math.floor(now.getTime() / 60000);

      reminders.forEach((r) => {
        const rTime = r.reminderTime ? r.reminderTime.slice(0, 5) : "";
        
        console.log(`Checking ${r.medicineName}: ${rTime} vs ${currentTime}`);

        if (rTime === currentTime && lastNotified[r.id] !== currentTimestamp) {
          console.log(`Triggering notification for ${r.medicineName}`);
          showNotification(r.medicineName);
          setLastNotified(prev => ({ ...prev, [r.id]: currentTimestamp }));
        }
      });
    };

    const interval = setInterval(checkReminders, 5000); // Check every 5 seconds for better responsiveness
    return () => clearInterval(interval);
  }, [reminders, lastNotified]);

  const showNotification = (medName) => {
    // ALWAYS show alert as fallback for immediate feedback
    alert(`💊 MEDICINE REMINDER: It's time to take ${medName}!`);

    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("Medicine Reminder 💊", {
          body: `It's time to take your medicine: ${medName}`,
          requireInteraction: true, // Keep notification until user dismisses
          icon: "https://cdn-icons-png.flaticon.com/512/822/822143.png" 
        });
      } catch (err) {
        console.error("Notification error:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { userId, medicineName, reminderTime, repeatType, repeatInterval };

    try {
      if (editingId) {
        await API.put(`/reminders/${editingId}`, payload);
        setMessage("Reminder updated!");
      } else {
        await API.post("/reminders", payload);
        setMessage("Reminder set!");
      }
      resetForm();
      fetchReminders();
    } catch (err) {
      console.error(err);
      setMessage("Error processing request.");
    }
  };

  const handleEdit = (r) => {
    setEditingId(r.id);
    setMedicineName(r.medicineName);
    setReminderTime(r.reminderTime.slice(0, 5));
    setRepeatType(r.repeatType);
    setRepeatInterval(r.repeatInterval);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;
    try {
      await API.delete(`/reminders/${id}`);
      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setMedicineName("");
    setReminderTime("");
    setRepeatType("none");
    setRepeatInterval(0);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="reminders-page">
      <div className="reminders-container animate-fade">
        <div className="reminders-header">
          <h1>Medicine Reminders</h1>
          <p>Stay on track with your health schedule.</p>
        </div>

        <div className="reminders-content">
          <div className="reminder-card add-card">
            <h2>{editingId ? "Edit Reminder" : "Add New Reminder"}</h2>
            <form onSubmit={handleSubmit} className="reminder-form">
              <div className="form-group">
                <label>Medicine Name</label>
                <input
                  type="text"
                  placeholder="e.g. Paracetamol"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reminder Time</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Repeat</label>
                <select value={repeatType} onChange={(e) => setRepeatType(e.target.value)}>
                  <option value="none">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="hourly">Every few hours</option>
                </select>
              </div>

              {repeatType === "hourly" && (
                <div className="form-group">
                  <label>Interval (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={repeatInterval}
                    onChange={(e) => setRepeatInterval(e.target.value)}
                  />
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Update Reminder" : "Set Reminder"}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
              {message && <p className="status-message success">{message}</p>}
            </form>
          </div>

          <div className="reminder-list-section">
            <h2>Your Schedule</h2>
            {reminders.length === 0 ? (
              <div className="no-reminders">No reminders scheduled.</div>
            ) : (
              <div className="reminders-grid">
                {reminders.map((r) => (
                  <div key={r.id} className="reminder-item card">
                    <div className="reminder-info">
                      <h3>{r.medicineName}</h3>
                      <div className="reminder-meta">
                        <span className="time">⏰ {r.reminderTime.slice(0, 5)}</span>
                        <span className="tag">{r.repeatType !== 'none' ? r.repeatType : 'Once'}</span>
                        {r.repeatType === 'hourly' && <span className="tag">Every {r.repeatInterval}h</span>}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleEdit(r)} className="btn-icon">Edit</button>
                      <button onClick={() => handleDelete(r.id)} className="btn-icon delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
