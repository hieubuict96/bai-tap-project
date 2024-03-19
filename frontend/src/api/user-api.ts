import axiosInstance from "./axios-instance";

export function signup(phoneNumber: any, password: any, fullName: any, email: any, imgUrl: any) {
  const form = new FormData();
  form.append('phone', phoneNumber);
  form.append('password', password);
  form.append('fullName', fullName);
  form.append('email', email);
  form.append('imgUrl', imgUrl);
  return axiosInstance.post("/api/user/signup", form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export function update(id: any, fullName: any, email: any, imgUrl: any) {
  const form = new FormData();
  form.append('id', id);
  form.append('fullName', fullName);
  form.append('email', email);

  if (imgUrl != null) {
    form.append('imgUrl', imgUrl);
  }

  return axiosInstance.post("/api/user/update", form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
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
