import { apiClient } from "../../../services/apiClient";
import type { Workspace } from "../../../types/workspace";

export const workspaceService = {
  getWorkspaces: async (signal?: AbortSignal): Promise<Workspace[]> => {
    const response = await apiClient.get("/api/workspaces", { signal });
    return response.data;
  },

  createWorkspace: async (data: { name: string; description?: string }, signal?: AbortSignal): Promise<Workspace> => {
    const response = await apiClient.post("/api/workspaces", data, { signal });
    return response.data;
  },

  getWorkspace: async (id: string, signal?: AbortSignal): Promise<Workspace> => {
    const response = await apiClient.get(`/api/workspaces/${id}`, { signal });
    return response.data;
  },

  updateWorkspace: async (
    id: string,
    data: { name?: string; description?: string },
    signal?: AbortSignal
  ): Promise<Workspace> => {
    const response = await apiClient.put(`/api/workspaces/${id}`, data, { signal });
    return response.data;
  },

  deleteWorkspace: async (id: string, signal?: AbortSignal): Promise<void> => {
    await apiClient.delete(`/api/workspaces/${id}`, { signal });
  },
};
