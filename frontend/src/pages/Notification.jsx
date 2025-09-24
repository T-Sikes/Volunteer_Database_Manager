import React from "react";
import NotificationSystem, {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarning,
} from "../components/NotificationSystem";

function NotificationPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Volunteer Notification Center
      </h1>

      {/* Simulation buttons */}
      <div className="flex flex-col space-y-4 w-64">
        <button
          onClick={() => notifySuccess("Matched Volunteer to Event (Simulated)!")}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Match Volunteer (Simulated)
        </button>

        <button
          onClick={() => notifyInfo("Event updated successfully (Simulated).")}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Update Event (Simulated)
        </button>

        <button
          onClick={() => notifyWarning("Reminder: Event starts tomorrow (Simulated).")}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Reminder (Simulated)
        </button>

        <button
          onClick={() => notifyError("Error while creating event (Simulated).")}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Trigger Error (Simulated)
        </button>
      </div>

      <p className="mt-6 text-gray-600 text-center max-w-lg">
        This page demonstrates real-time notifications for new event assignments, updates,
        and reminders. In production, these functions would be triggered by real system
        actions (e.g., volunteer matching, event updates).
      </p>
        {/* Toast container */}
      <NotificationSystem />
    </div>
  );
}

export default NotificationPage;
