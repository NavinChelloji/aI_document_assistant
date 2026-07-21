import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Trash2, FileText, AlertCircle, Loader2,
  LayoutGrid, LayoutList, RefreshCw, ChevronDown, Eye
} from "lucide-react";
import { documentService } from "../services/document.api";
import { useAbortController } from "../../../hooks/useAbortController";
import type { Document } from "../../../types/document";

function formatBytes(bytes: number) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, string> = {
    processed: "bg-green-50 text-green-700 border-green-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    failed: "bg-red-50 text-red-700 border-red-200",
  };
  const key = status ?? "pending";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[key] ?? map.pending}`}>
      {status === "processing" && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
      {key}
    </span>
  );
}

/* Props: can be used standalone (/documents) or embedded in workspace (pass workspaceId) */
interface Props {
  workspaceId?: string;
}

export const DocumentLibrary = ({ workspaceId }: Props) => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { getSignal } = useAbortController();

  const fetchDocs = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = workspaceId
        ? await documentService.getDocuments(workspaceId, getSignal())
        : await documentService.getAllDocuments(getSignal());
      setDocs(data);
    } catch (err: any) {
      if (err.name !== "CanceledError") setError("Failed to load documents.");
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, getSignal]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleDelete = async (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete "${doc.filename || doc.file_name}"? This cannot be undone.`)) return;
    setDeletingId(doc.id);
    try {
      await documentService.deleteDocument(doc.id);
      setDocs((prev) => prev.filter((d) => d.id !== doc.id));
    } catch {
      alert("Failed to delete document.");
    } finally {
      setDeletingId(null);
    }
  };

  const types = ["All Types", ...Array.from(new Set(docs.map((d) => (d.content_type || d.file_type || "").split("/").pop()?.toUpperCase() ?? "").filter(Boolean)))];
  const statuses = ["All Status", "pending", "processing", "processed", "failed"];

  const filtered = docs.filter((d) => {
    const name = (d.filename || d.file_name || "").toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase());
    const docType = ((d.content_type || d.file_type || "").split("/").pop()?.toUpperCase() ?? "");
    const matchType = typeFilter === "All Types" || docType === typeFilter;
    const matchStatus = statusFilter === "All Status" || d.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className={workspaceId ? "" : "max-w-7xl mx-auto px-4 py-8"}>
      {!workspaceId && (
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documents</h1>
          <button onClick={fetchDocs} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Refresh">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Type filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none pr-8 pl-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              {types.map((t) => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pr-8 pl-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              {statuses.map((s) => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white dark:bg-gray-900 shadow-sm text-gray-900 dark:text-white" : "text-gray-500"}`}>
              <LayoutList className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white dark:bg-gray-900 shadow-sm text-gray-900 dark:text-white" : "text-gray-500"}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-sm mb-5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <FileText className="w-12 h-12 mb-3 text-gray-300" />
          <p className="font-medium text-gray-700 dark:text-gray-300">
            {search || typeFilter !== "All Types" || statusFilter !== "All Status" ? "No matching documents" : "No documents yet"}
          </p>
          <p className="text-sm mt-1">
            {search ? "Try a different search term." : "Upload documents inside a workspace."}
          </p>
        </div>
      ) : viewMode === "list" ? (
        /* ── List View ── */
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {["Name", "Type", "Size", "Status", "Uploaded", ""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((doc) => {
                const name = doc.filename || doc.file_name || "Unknown";
                const ext = ((doc.content_type || doc.file_type || "").split("/").pop()?.toUpperCase() ?? "FILE");
                return (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/documents/${doc.id}/view`)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">{name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{ext}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{formatBytes(doc.file_size ?? doc.size_bytes ?? 0)}</td>
                    <td className="px-5 py-4"><StatusBadge status={doc.status} /></td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/documents/${doc.id}/view`); }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(doc, e)}
                          disabled={deletingId === doc.id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete"
                        >
                          {deletingId === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* ── Grid View ── */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((doc) => {
            const name = doc.filename || doc.file_name || "Unknown";
            return (
              <div
                key={doc.id}
                className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer"
                onClick={() => navigate(`/documents/${doc.id}/view`)}
              >
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleDelete(doc, e)}
                    disabled={deletingId === doc.id}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    {deletingId === doc.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <FileText className="w-10 h-10 text-red-500 mb-3" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate pr-6">{name}</h4>
                <p className="text-xs text-gray-500 mt-1">{formatBytes(doc.file_size ?? doc.size_bytes ?? 0)}</p>
                <div className="mt-3"><StatusBadge status={doc.status} /></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
