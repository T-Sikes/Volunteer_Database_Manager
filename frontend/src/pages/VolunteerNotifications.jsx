import React, { useEffect, useState } from "react";
import axios from "../components/AxiosInstance";

function VolunteerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/event/notifications/")
      .then((res) => {
        setNotifications(res.data || []);
      })
      .catch((err) => console.error("Error loading notifications:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`/event/notifications/${id}/`)
      .then(() => {
        setNotifications((prev) => prev.filter((note) => note.id !== id));
      })
      .catch((err) => console.error("Error deleting notification:", err));
  };

  return (
    <div className="h-[89%] w-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">Your Notifications</h2>

        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-600 text-center">You currently have no notifications.</p>
        ) : (
          <div className="text-black p-4 rounded space-y-4">
            {notifications.map((note) => (
              <div
                key={note.id}
                className="border border-gray-200 rounded-md p-3 shadow-sm"
              >
                <p className="font-medium mb-1">{note.message}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(note.timestamp).toLocaleString()}
                </p>

                <button
                  onClick={() => handleDelete(note.id)}
                  style={{ backgroundColor: "#3fa2a5", color: "white" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "black";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#3fa2a5";
                  }}
                  className="px-3 py-1 rounded mt-2 block mx-auto text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VolunteerNotifications;