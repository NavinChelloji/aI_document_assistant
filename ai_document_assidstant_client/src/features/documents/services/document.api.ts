import { apiClient } from "../../../services/apiClient";
import type { Document } from "../../../types/document";

export const documentService = {
  // Get all documents for a specific workspace
  getDocuments: async (workspaceId: string, signal?: AbortSignal): Promise<Document[]> => {
    const response = await apiClient.get(`/api/documents/workspace/${workspaceId}`, { signal });
    return response.data;
  },

  // Get all documents for the current user across all workspaces
  getAllDocuments: async (signal?: AbortSignal): Promise<Document[]> => {
    const response = await apiClient.get(`/api/documents/all`, { signal });
    return response.data;
  },

  // Get a single document by ID
  getDocument: async (documentId: string, signal?: AbortSignal): Promise<Document> => {
    const response = await apiClient.get(`/api/documents/${documentId}`, { signal });
    return response.data;
  },

  uploadDocument: async (
    workspaceId: string,
    file: File,
    signal?: AbortSignal,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<Document> => {
    const formData = new FormData();
    formData.append("workspace_id", workspaceId);
    formData.append("file", file);

    const response = await apiClient.post("/api/documents/upload", formData, {
      signal,
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
    return response.data;
  },

  deleteDocument: async (documentId: string, signal?: AbortSignal): Promise<void> => {
    await apiClient.delete(`/api/documents/${documentId}`, { signal });
  },
};
