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

export async function countVeterinarians() {
  const result = await api.get("/users/count/veterinarians");
  return result.data;
}

export async function countPatients() {
  const result = await api.get("/users/count/patients");
  return result.data;
}

export async function countUsers() {
  const result = await api.get("/users/count/users");
  return result.data;
}

export const getAggregateUsersByMonthAndType = async () => {
  const response = await api.get("/users/aggregated-users");
  return response.data;
};

export const getAggregatedUsersAccountByActiveStatus = async () => {
  const response = await api.get("/users/account/aggregated-by-status");
  return response.data;
};

export const aggregateVetBySpecialization = async () => {
  const response = await api.get("/veterinarians/vet/get-by-specialization");
  return response.data;
};

export async function lockUserAccount(userId) {
  const result = await api.put(`/users/account/${userId}/lock-user-account`);
  return result.data;
}

export async function unLockUserAccount(userId) {
  const result = await api.put(`/users/account/${userId}/unLock-user-account`);
  return result.data;
}
