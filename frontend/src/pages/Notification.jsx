import React from "react"; 
import NotificationSystem from "../components/NotificationSystem";

function NotificationPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Volunteer Notification Center
            </h1>
            <NotificationSystem />
            <p className="mt-6 text-gray-600 text-center max-w-lg">
                This page displays real time notifications for new events, updates, and reminders. Volunteers and administrators can stay informed about important activities and deadlines.
            </p>
        </div>
    );
}
export default NotificationPage;