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
