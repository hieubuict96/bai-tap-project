import axiosInstance from "./axios-instance";

export function getNotificationsApi() {
  return axiosInstance.get("/api/notifications/get-notifications");
}

export function markReadNotificationApi(notificationId: any) {
  return axiosInstance.post("/api/notifications/mark-read-notification", {
    notificationId
  });
}
