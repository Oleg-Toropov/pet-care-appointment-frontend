import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:9192/api/v1",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");

      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
