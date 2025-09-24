import React, { useState } from "react";

// Mock notification system components and functions
const NotificationSystem = () => {
  return <div className="fixed top-4 right-4 z-50" id="notification-container"></div>;
};

// Mock notification functions
const notifySuccess = (message) => {
  console.log("Success:", message);
  showNotification(message, "success");
};

const notifyError = (message) => {
  console.log("Error:", message);
  showNotification(message, "error");
};

const notifyInfo = (message) => {
  console.log("Info:", message);
  showNotification(message, "info");
};

const notifyWarning = (message) => {
  console.log("Warning:", message);
  showNotification(message, "warning");
};

// Simple notification display function
const showNotification = (message, type) => {
  const container = document.getElementById("notification-container");
  if (!container) return;

  const notification = document.createElement("div");
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500"
  };

  notification.className = `${colors[type]} text-white px-4 py-2 rounded mb-2 shadow-lg transform transition-all duration-300`;
  notification.textContent = message;
  notification.style.transform = "translateX(100%)";
  
  container.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (container.contains(notification)) {
        container.removeChild(notification);
      }
    }, 300);
  }, 3000);
};

function NotificationPage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 text-center pt-16 pb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Volunteer Notification Center
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Simulation buttons */}
        <div className="flex flex-col space-y-6 w-full max-w-md">
          <button
            onClick={() => notifySuccess("Matched Volunteer to Event (Simulated)!")}
            className="bg-black text-white px-6 py-4 rounded-lg hover:bg-gray-800 transition duration-200 text-lg font-medium"
          >
            Match Volunteer (Simulated)
          </button>

          <button
            onClick={() => notifyInfo("Event updated successfully (Simulated).")}
            className="bg-black text-white px-6 py-4 rounded-lg hover:bg-gray-800 transition duration-200 text-lg font-medium"
          >
            Update Event (Simulated)
          </button>

          <button
            onClick={() => notifyWarning("Reminder: Event starts tomorrow (Simulated).")}
            className="bg-black text-white px-6 py-4 rounded-lg hover:bg-gray-800 transition duration-200 text-lg font-medium"
          >
            Reminder (Simulated)
          </button>

          <button
            onClick={() => notifyError("Error while creating event (Simulated).")}
            className="bg-black text-white px-6 py-4 rounded-lg hover:bg-gray-800 transition duration-200 text-lg font-medium"
          >
            Trigger Error (Simulated)
          </button>
        </div>
      </div>

      {/* Footer Description */}
      <div className="flex-shrink-0 px-8 pb-16">
        <p className="text-gray-600 text-center max-w-2xl mx-auto text-lg leading-relaxed">
          This page demonstrates real-time notifications for new event assignments, updates,
          and reminders. In production, these functions would be triggered by real system
          actions (e.g., volunteer matching, event updates).
        </p>
      </div>

      {/* Toast container */}
      <NotificationSystem />
    </div>
  );
}

export default NotificationPage;