import { toast } from "react-toastify";

export const notifySuccess = (message) =>
  toast.success(message, { theme: "colored" });

export const notifyError = (message) =>
  toast.error(message, { theme: "colored" });

export const notifyInfo = (message) =>
  toast.info(message, { theme: "colored" });

export const notifyWarning = (message) =>
  toast.warn(message, { theme: "colored" });
