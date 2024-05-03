import axiosInstance from "./axios-instance";

export function getChat(otherUser: any, is2Person: any) {
  return axiosInstance.get("/api/chat/get-chat", {
    params: {
      otherUser,
      is2Person
    },
  });
}

export function getListChatAPI() {
  return axiosInstance.get("/api/chat/get-list-chat");
}

export function sendMessage(otherUser: any, text: string) {
  return axiosInstance.post("/api/chat/send-msg", {
    otherUser,
    text,
  });
}

export function declineVideo(otherUser: any) {
  return axiosInstance.post("/api/chat/decline-video", {
    otherUser
  });
}

export function createChatAPI(body: any) {
  return axiosInstance.post("/api/chat/create-chat", body);
}
