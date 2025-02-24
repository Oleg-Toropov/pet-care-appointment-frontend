import axios from "axios";

export const api = axios.create({
  baseURL: "https://doctor-aibolit.pro/api/v1",
});
