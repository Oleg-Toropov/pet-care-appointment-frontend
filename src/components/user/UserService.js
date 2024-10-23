import { api } from "../utils/api";

export async function getUserById(userId) {
  const result = await api.get(`/users/user/${userId}`);
  return result.data;
}
