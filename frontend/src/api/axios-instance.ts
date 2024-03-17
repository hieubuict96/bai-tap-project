import axios from "axios";
import { DOMAIN_BACKEND, TOKEN_KEY } from "../common/const";

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

axiosInstance.interceptors.response.use((res) => {
  if (res.status >= 500 || res.status < 100) {
    alert("Có lỗi xảy ra ở Server, vui lòng thử lại sau!!!");
  }

  return res;
});

export default axiosInstance;
