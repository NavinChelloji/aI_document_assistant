import { apiClient } from "../../../services/apiClient";
import type { Document } from "../../../types/document";

export const documentService = {
  getDocuments: async (workspaceId: number, signal?: AbortSignal): Promise<Document[]> => {
    const response = await apiClient.get(`/api/documents/workspace/${workspaceId}`, { signal });
    return response.data;
  },

  uploadDocument: async (workspaceId: number, file: File, signal?: AbortSignal): Promise<Document> => {
    const formData = new FormData();
    formData.append("workspace_id", workspaceId.toString());
    formData.append("file", file);

    const response = await apiClient.post("/api/documents/upload", formData, {
      signal,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  },

  deleteDocument: async (documentId: number, signal?: AbortSignal): Promise<void> => {
    await apiClient.delete(`/api/documents/${documentId}`, { signal });
  }
};
