import React, { useState, useEffect } from "react";
import NotificationSystem, {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarning,
} from "../components/NotificationSystem.jsx";

const API_BASE = "http://127.0.0.1:8000/api/notifications";

async function sendNotification(data, successMsg) {
  try {
    const res = await fetch(`${API_BASE}/send/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json();
      notifyError(`Server error: ${JSON.stringify(errData)}`);
      return;
    }

    notifySuccess(successMsg);
  } catch (err) {
    notifyError(`Network error: ${err.message}`);
  }
}

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    const res = await fetch(`${API_BASE}/`);
    if (res.ok) {
      const data = await res.json();
      setNotifications(data);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">
      <div className="flex-shrink-0 text-center pt-16 pb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Volunteer Notification Center
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="flex flex-col space-y-6 w-full max-w-md">
          <button
            onClick={() =>
              sendNotification(
                {
                  notificationType: "match",
                  volunteerName: "John Doe",
                  eventName: "Soup Kitchen",
                  message: "Matched Volunteer to Event",
                },
                "Matched volunteer successfully!"
              )
            }
            className="bg-[#3fa2a5] text-white px-6 py-4 rounded-lg hover:bg-[#348a8d] transition duration-200 text-lg font-medium"
          >
            Match Volunteer
          </button>

          <button
            onClick={() =>
              sendNotification(
                {
                  notificationType: "update",
                  volunteerName: "Alice Martin",
                  eventName: "Community Clean-Up",
                  message: "Event updated successfully",
                },
                "Event update notification sent!"
              )
            }
            className="bg-[#4dff00] text-white px-6 py-4 rounded-lg hover:bg-[#348a8d] transition duration-200 text-lg font-medium"
          >
            Update Event
          </button>

          <button
            onClick={() =>
              sendNotification(
                {
                  notificationType: "reminder",
                  volunteerName: "Jane Smith",
                  eventName: "Plant Trees",
                  message: "Reminder: Event starts tomorrow!",
                },
                "Reminder sent!"
              )
            }
            className="bg-[#3fa2a5] text-white px-6 py-4 rounded-lg hover:bg-[#348a8d] transition duration-200 text-lg font-medium"
          >
            Send Reminder
          </button>

          <button
            onClick={() =>
              sendNotification(
                {
                  notificationType: "match",
                  volunteerName: "Nonexistent Person",
                  eventName: "Soup Kitchen",
                  message: "Test failure case",
                },
                "This should fail validation"
              )
            }
            className="bg-[#3fa2a5] text-white px-6 py-4 rounded-lg hover:bg-[#348a8d] transition duration-200 text-lg font-medium"
          >
            Trigger Error
          </button>
        </div>

        <div className="mt-8 bg-white shadow-lg rounded-lg p-4 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Current Notifications
          </h2>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {notifications.map((n, i) => (
              <li key={i} className="border p-2 rounded text-gray-800">
                <strong>{n.volunteerName}</strong> - {n.message}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-shrink-0 px-8 pb-16">
        <p className="text-black text-center max-w-2xl mx-auto text-lg leading-relaxed">
          This page demonstrates real-time notifications for new event assignments, updates,
          and reminders. In production, these functions would be triggered by real system
          actions (e.g., volunteer matching, event updates).
        </p>
      </div>

      <NotificationSystem />
    </div>
  );
}

export default NotificationPage;