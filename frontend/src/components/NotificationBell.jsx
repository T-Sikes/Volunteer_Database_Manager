import React, { useEffect, useState } from "react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchNotifications = () => {
      fetch("http://127.0.0.1:8000/event/notifications/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then(res => res.json())
        .then(setNotifications)
        .catch(err => console.error("Failed to fetch notifications:", err));
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button
        className="relative"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
            {notifications.length}
          </span>
        )}
      </button>

      {showDropdown && notifications.length > 0 && (
        <div className="absolute mt-2 right-0 w-64 bg-white shadow-lg rounded max-h-64 overflow-y-auto z-50">
          {notifications.map(n => (
            <div key={n.id} className="p-2 border-b">
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
