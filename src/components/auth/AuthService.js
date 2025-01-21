import { api } from "../utils/api";
import { jwtDecode } from "jwt-decode";

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
  const token = response.data.data.token;

  localStorage.setItem("authToken", token);
  setLogoutTimer(token);

  return response.data.data;
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userRoles");
  window.location.href = "/login";
};

export async function requestPasswordReset(email) {
  const response = await api.post("/auth/request-password-reset", { email });
  return response.data;
}

export async function validateToken(token) {
  const result = await api.get(
    `/verification/check-token-expiration?token=${token}`
  );
  return result.data;
}

export async function resetPassword(token, newPassword) {
  const response = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data;
}

let logoutTimer;

export const setLogoutTimer = (token) => {
  if (!token) {
    return;
  }

  try {
    const decoded = jwtDecode(token);
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeUntilLogout = expirationTime - currentTime;

    if (timeUntilLogout > 0) {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        logout();
      }, timeUntilLogout);
    } else {
      logout();
    }
  } catch {
    logout();
  }
};
