import axiosInstance from "./axios-instance";

export function getPost(id: any) {
  return axiosInstance.get("/api/post/get-post", {
    params: {
      id
    }
  });
}
