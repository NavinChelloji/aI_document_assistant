import React, { useEffect, useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import { documentService } from "../services/document.api";
import type { Document } from "../../../types/document";
import { Spinner } from "../../../ui/spinner/Spinner";
import { useAbortController } from "../../../hooks/useAbortController";

export const DocumentLibrary = ({ workspaceId }: { workspaceId: number }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { getSignal } = useAbortController();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const data = await documentService.getDocuments(workspaceId, getSignal());
        setDocuments(data);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setError("Failed to load documents.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [workspaceId, getSignal]);

  const handleDelete = async (id: number) => {
    try {
      await documentService.deleteDocument(id);
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (err) {
      alert("Failed to delete document.");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Spinner /></div>;
  }

  if (error) {
    return <div className="text-[var(--color-error-600)] p-4">{error}</div>;
  }

  if (documents.length === 0) {
    return (
      <div className="text-center p-8 text-[var(--text-muted)] bg-[var(--bg-subtle)] rounded-lg border border-dashed border-[var(--border-default)]">
        <FileText className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)] opacity-50" />
        <p>No documents found in this workspace.</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-surface)] rounded-lg shadow-sm border border-[var(--border-default)] overflow-hidden transition-colors">
      <table className="min-w-full divide-y divide-[var(--border-default)]">
        <thead className="bg-[var(--bg-subtle)]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Size</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Uploaded</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-[var(--bg-surface)] divide-y divide-[var(--border-default)]">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <FileText className="flex-shrink-0 h-5 w-5 text-[var(--text-muted)] mr-3" />
                  <div className="text-sm font-medium text-[var(--text-default)]">{doc.filename}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)]">
                {(doc.size_bytes / 1024 / 1024).toFixed(2)} MB
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)]">
                {new Date(doc.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-[var(--color-error-600)] hover:text-[var(--color-error-500)] bg-red-50 dark:bg-red-900/20 p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
