import { apiClient } from "../../../services/apiClient";
import type { ChatSession, Message } from "../../../types/chat";

export const chatService = {
  createSession: async (workspaceId: string, title: string, signal?: AbortSignal): Promise<ChatSession> => {
    const response = await apiClient.post("/api/chat/session", {
      title,
      workspace_id: workspaceId,
    }, { signal });
    return response.data;
  },

  getSessions: async (workspaceId: string, signal?: AbortSignal): Promise<ChatSession[]> => {
    const response = await apiClient.get(`/api/chat/workspace/${workspaceId}/sessions`, { signal });
    return response.data;
  },

  sendMessage: async (sessionId: string, content: string, signal?: AbortSignal): Promise<Message> => {
    const response = await apiClient.post(`/api/chat/${sessionId}/message`, { content }, { signal });
    return response.data;
  },

  // Fixed: backend endpoint is /messages not /history
  getSessionHistory: async (sessionId: string, signal?: AbortSignal): Promise<Message[]> => {
    const response = await apiClient.get(`/api/chat/${sessionId}/messages`, { signal });
    return response.data;
  },

  deleteSession: async (sessionId: string, signal?: AbortSignal): Promise<void> => {
    await apiClient.delete(`/api/chat/${sessionId}`, { signal });
  },
};
