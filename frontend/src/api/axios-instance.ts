import axios from "axios";
import { DOMAIN_BACKEND, TOKEN_KEY } from "../common/const";
import { NotificationType } from "../common/enum/notification-type";
import { showNotification } from "../common/common-function";

const axiosInstance = axios.create({
  baseURL: DOMAIN_BACKEND,
});

axiosInstance.interceptors.request.use((req: any) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

axiosInstance.interceptors.response.use((res) => res,
  (error) => {
    if (error.code == "ERR_NETWORK") {
      showNotification(NotificationType.ERROR, 'Thông báo lỗi', 'Mất kết nối tới máy chủ, vui lòng thử lại sau');
      throw error;
    }

    if (error.response.status >= 500) {
      showNotification(NotificationType.ERROR, 'Thông báo lỗi', 'Có lỗi xảy ra ở Server, vui lòng thử lại sau');
      throw error;
    }

    throw error;
  });

export default axiosInstance;
