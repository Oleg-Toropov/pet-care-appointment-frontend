import { api } from "../utils/api";

export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-your-email?token=${token}`);
  return response.data;
};

export async function resendVerificationToken(oldToken) {
  const response = await api.put(
    `/auth/resend-verification-token?token=${oldToken}`
  );
  return response.data;
}

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data.data;
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userRoles");
  window.location.href = "/";
};
