import axiosInstance from "./axios-instance";

export function signup(phoneNumber: any, password: any) {
  return axiosInstance.post("/api/user/signup", {
    phone: phoneNumber,
    password,
  });
}

export function signin(phoneNumber: any, password: any) {
  return axiosInstance.post("/api/user/signin", {
    phone: phoneNumber,
    password,
  });
}

export function getData() {
  return axiosInstance.get("/api/user/get-data");
}

export function getChat(otherUser: any) {
  return axiosInstance.get("/api/user/get-chat", {
    params: {
      otherUser,
    },
  });
}

export function sendMessage(otherUser: any, text: string) {
  return axiosInstance.post("/api/user/send-msg", {
    otherUser,
    text,
  });
}

export function declineVideo(otherUser: any) {
  return axiosInstance.post("/api/user/decline-video", {
    otherUser
  });
}

