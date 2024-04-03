import axiosInstance from "./axios-instance";

export function signup(usernameNumber: any, password: any, fullName: any, email: any, imgUrl: any) {
  const form = new FormData();
  form.append('username', usernameNumber);
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

export function signin(usernameNumber: any, password: any) {
  return axiosInstance.post("/api/user/signin", {
    username: usernameNumber,
    password,
  });
}

export function getData() {
  return axiosInstance.get("/api/user/get-data");
}

export function searchUser(keyword: any) {
  return axiosInstance.post("/api/user/search", { keyword });
}

export function userProfile(id: any) {
  return axiosInstance.get("/api/user/user-profile", {
    params: {
      id
    }
  });
}
