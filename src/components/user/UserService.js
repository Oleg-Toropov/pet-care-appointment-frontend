import { api } from "../utils/api";

export async function getUserById(userId) {
  const result = await api.get(`/users/user/${userId}`);
  return result.data;
}

export async function registerUser(user) {
  const result = await api.post("/users/register", user);
  return result.data;
}
