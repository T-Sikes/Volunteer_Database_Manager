import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Notification functions
export const notifySuccess = (msg) =>
  toast.success(msg, { theme: "colored" });

export const notifyError = (msg) =>
  toast.error(msg, { theme: "colored" });

export const notifyInfo = (msg) =>
  toast.info(msg, { theme: "colored" });

export const notifyWarning = (msg) =>
  toast.warn(msg, { theme: "colored" });

// Toast container component
export default function NotificationSystem() {
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