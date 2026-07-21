import { apiClient } from "../../../services/apiClient";

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  default_workspace_id?: string;
  show_sources_by_default: boolean;
  response_length: "concise" | "balanced" | "detailed";
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

export const userService = {
  getMe: async (signal?: AbortSignal): Promise<UserProfile> => {
    const response = await apiClient.get("/api/users/me", { signal });
    return response.data;
  },

  updateMe: async (data: { full_name?: string }, signal?: AbortSignal): Promise<UserProfile> => {
    const response = await apiClient.put("/api/users/me", data, { signal });
    return response.data;
  },
};
