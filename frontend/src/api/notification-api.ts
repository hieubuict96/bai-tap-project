import axiosInstance from "./axios-instance";

export function getNotificationsApi() {
  return axiosInstance.get("/api/notifications/get-notifications");
}
