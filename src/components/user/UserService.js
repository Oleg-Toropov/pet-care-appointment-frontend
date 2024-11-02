import { api } from "../utils/api";

export async function getUserById(userId) {
  const result = await api.get(`/users/user/${userId}`);
  return result.data;
}

export async function registerUser(user) {
  const result = await api.post("/users/register", user);
  return result.data;
}

export async function changeUserPassword(
  userId,
  currentPassword,
  newPassword,
  confirmNewPassword
) {
  const requestData = { currentPassword, newPassword, confirmNewPassword };
  const result = await api.put(
    `/users/user/${userId}/change-password`,
    requestData
  );
  return result.data;
}

export async function updateUser(userData, userId) {
  const response = await api.put(`/users/user/${userId}/update`, userData);
  return response.data;
}

export async function deleteUser(userId) {
  const response = await api.delete(`/users/user/${userId}/delete`);
  return response.data;
}
