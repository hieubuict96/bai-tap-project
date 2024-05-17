import axiosInstance from "./axios-instance";

export function getPost(id: any) {
  return axiosInstance.get("/api/post/get-post", {
    params: {
      id
    }
  });
}

export function addCommentApi(body: any) {
  return axiosInstance.post("/api/post/add-comment", body);
}

export function addPostApi(form: FormData) {
  return axiosInstance.post("/api/post/add-post", form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export function getPostsInHomeApi() {
  return axiosInstance.get("/api/post/get-posts-in-home");
}