import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NotificationSystem() {
    const notifySuccess = (msg) => toast.success(msg);
    const notifyError = (msg) => toast.error(msg);
    const notifyInfo = (msg) => toast.info(msg);
    const notifyWarning = (msg) => toast.warn(msg);
    
    return (
        <div className="p-4 bg-white rounded-lg shadow-md w-96 flex flex-col space-y-4">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                Notification System
            </h2>
            <button
                onClick={() => notifySuccess("Event created successfully!")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Show Success
            </button>
            <button
                onClick={() => notifyInfo("Reminder set for the event.")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Show Info
            </button>
            <button
                onClick={() => notifyWarning("Warning : You have unsaved changes.")}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
                Show Warning
            </button>
            <button
                onClick={() => notifyError("Failed to create event.")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Show Error
            </button>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}
export default NotificationSystem;