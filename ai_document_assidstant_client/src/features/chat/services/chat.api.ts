import { apiClient } from "../../../services/apiClient";
import type { ChatSession, Message } from "../../../types/chat";

export const chatService = {
  createSession: async (workspaceId: number, title: string, signal?: AbortSignal): Promise<ChatSession> => {
    const response = await apiClient.post("/api/chat/session", {
      title,
      workspace_id: workspaceId
    }, { signal });
    return response.data;
  },

  getSessions: async (workspaceId: number, signal?: AbortSignal): Promise<ChatSession[]> => {
    const response = await apiClient.get(`/api/chat/workspace/${workspaceId}/sessions`, { signal });
    return response.data;
  },

  sendMessage: async (sessionId: number, content: string, signal?: AbortSignal): Promise<Message> => {
    const response = await apiClient.post(`/api/chat/${sessionId}/message`, {
      content
    }, { signal });
    return response.data;
  },
  
  getSessionHistory: async (sessionId: number, signal?: AbortSignal): Promise<Message[]> => {
    const response = await apiClient.get(`/api/chat/${sessionId}/history`, { signal });
    return response.data;
  }
};
