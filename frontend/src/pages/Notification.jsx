import React from "react";
import NotificationSystem from "../components/NotificationSystem";

function NotificationPage() {
    // Example: simulate real actions
    const handleMatchVolunteer = () => {
        // after successful matching logic
        NotificationSystem.notifySuccess("Volunteer matched to event successfully!");
    };

    const handleUpdateEvent = () => {
        NotificationSystem.notifyInfo("Event details were updated.");
    };

    const handleReminder = () => {
        NotificationSystem.notifyWarning("Reminder: Upcoming event tomorrow!");
    };

    const handleError = () => {
        NotificationSystem.notifyError("Failed to assign volunteer. Please try again.");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Volunteer Notification Center
            </h1>
            
            {/* These buttons now simulate real actions */}
            <div className="flex flex-col space-y-4">
                <button
                    onClick={handleMatchVolunteer}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Match Volunteer (Simulated)
                </button>
                <button
                    onClick={handleUpdateEvent}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Update Event (Simulated)
                </button>
                <button
                    onClick={handleReminder}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                    Reminder (Simulated)
                </button>
                <button
                    onClick={handleError}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Trigger Error (Simulated)
                </button>
            </div>

            <p className="mt-6 text-gray-600 text-center max-w-lg">
                This page demonstrates real-time notifications for new event
                assignments, updates, and reminders. In production, these
                functions would be triggered by real system actions
                (e.g., volunteer matching, event updates).
            </p>

            {/* Toast container (must be rendered once in the app) */}
            <NotificationSystem />
        </div>
    );
}

export default NotificationPage;