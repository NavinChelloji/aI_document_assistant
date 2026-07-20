import { apiClient } from "../../../services/apiClient";

export const authService = {
  login: async (credentials: any, signal?: AbortSignal) => {
    // FastAPI's OAuth2PasswordRequestForm expects form data, not JSON
    const formData = new URLSearchParams();
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);
    
    const response = await apiClient.post("/api/auth/login", formData, {
      signal,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    return response.data;
  },

  register: async (userData: any, signal?: AbortSignal) => {
    const response = await apiClient.post("/api/auth/register", userData, {
      signal
    });
    return response.data;
  },

  logout: async (signal?: AbortSignal) => {
    const response = await apiClient.post("/api/auth/logout", {}, {
      signal
    });
    return response.data;
  }
};
