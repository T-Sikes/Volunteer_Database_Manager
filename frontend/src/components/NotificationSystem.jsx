import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NotificationSystem() {
    // These functions can be imported/called anywhere in the app
    NotificationSystem.notifySuccess = (msg) => toast.success(msg);
    NotificationSystem.notifyError = (msg) => toast.error(msg);
    NotificationSystem.notifyInfo = (msg) => toast.info(msg);
    NotificationSystem.notifyWarning = (msg) => toast.warn(msg);

    return (
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
    );
}

export default NotificationSystem;