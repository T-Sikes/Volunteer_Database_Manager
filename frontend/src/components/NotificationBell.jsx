import React, { useEffect, useState } from "react";
import axios from "../components/AxiosInstance";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const load = () => {
      axios.get("/event/notifications/")
        .then(res => setNotifications(res.data))
        .catch(err => console.error(err));
    };

    load();
    const i = setInterval(load, 15000);
    return () => clearInterval(i);
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
