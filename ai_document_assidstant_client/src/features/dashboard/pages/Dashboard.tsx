import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus, Folder, FileText, MessageSquare, HardDrive,
  ChevronRight, X, Loader2, AlertCircle, Trash2, MoreHorizontal
} from "lucide-react";
import { workspaceService } from "../../workspace/services/workspace.api";
import { documentService } from "../../documents/services/document.api";
import { useWorkspaceStore } from "../../../store/workspace.store";
import { useAbortController } from "../../../hooks/useAbortController";
import type { Workspace } from "../../../types/workspace";
import type { Document } from "../../../types/document";

/* ── tiny helper ── */
function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

/* ── Create Workspace Modal ── */
function CreateWorkspaceModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (ws: Workspace) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { getSignal } = useAbortController();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const ws = await workspaceService.createWorkspace({ name: name.trim(), description: description.trim() || undefined }, getSignal());
      onCreated(ws);
      onClose();
    } catch (err: any) {
      if (err.name !== "CanceledError") setError(err.response?.data?.detail || "Failed to create workspace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Workspace</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workspace Name *</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. HR Policies"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
export const Dashboard = () => {
  const navigate = useNavigate();
  const { workspaces, setWorkspaces, addWorkspace, removeWorkspace } = useWorkspaceStore();
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { getSignal } = useAbortController();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [wsList, docList] = await Promise.all([
        workspaceService.getWorkspaces(getSignal()),
        documentService.getAllDocuments(getSignal()).catch(() => [] as Document[]),
      ]);
      setWorkspaces(wsList);
      setRecentDocs(docList.slice(0, 5));
    } catch (err: any) {
      if (err.name !== "CanceledError") setError("Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, [setWorkspaces, getSignal]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDeleteWorkspace = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this workspace? All documents and chats inside will be removed.")) return;
    setDeletingId(id);
    try {
      await workspaceService.deleteWorkspace(id);
      removeWorkspace(id);
    } catch {
      alert("Failed to delete workspace.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalSizeBytes = recentDocs.reduce((acc, d) => acc + (d.size_bytes || 0), 0);
  const colors = ["bg-red-100 text-red-600", "bg-green-100 text-green-600", "bg-teal-100 text-teal-600", "bg-blue-100 text-blue-600", "bg-purple-100 text-purple-600", "bg-orange-100 text-orange-600"];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {showCreate && (
        <CreateWorkspaceModal
          onClose={() => setShowCreate(false)}
          onCreated={(ws) => addWorkspace(ws)}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Welcome back! <span>👋</span>
          </h2>
          <p className="text-gray-500 mt-1">Here's what's happening with your documents.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Workspace
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Folder, label: "Workspaces", value: isLoading ? "—" : workspaces.length, color: "bg-purple-100 text-purple-600" },
          { icon: FileText, label: "Documents", value: isLoading ? "—" : recentDocs.length, color: "bg-blue-100 text-blue-600" },
          { icon: MessageSquare, label: "Chats", value: "—", color: "bg-indigo-100 text-indigo-600" },
          { icon: HardDrive, label: "Storage", value: isLoading ? "—" : formatBytes(totalSizeBytes), color: "bg-gray-100 text-gray-600" },
        ].map((m) => (
          <div key={m.label} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm">
            <div className={`p-3 rounded-lg ${m.color}`}><m.icon size={22} /></div>
            <div>
              <p className="text-xs text-gray-500">{m.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Workspaces */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Workspaces</h3>
          <Link to="/workspaces" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-500">
            <Folder className="w-10 h-10 mb-3 text-gray-300" />
            <p className="font-medium">No workspaces yet</p>
            <button onClick={() => setShowCreate(true)} className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Create your first workspace →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {workspaces.slice(0, 4).map((ws, i) => (
              <Link key={ws.id} to={`/workspace/${ws.id}`} className="group relative">
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${colors[i % colors.length]}`}>
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{ws.name}</h4>
                    <p className="text-xs text-gray-500">{ws.document_count ?? 0} docs</p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteWorkspace(ws.id, e)}
                    disabled={deletingId === ws.id}
                    className="absolute top-2 right-2 p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    {deletingId === ws.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Documents</h3>
          <Link to="/documents" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
          </div>
        ) : recentDocs.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="font-medium">No documents yet</p>
            <p className="text-sm mt-1">Upload documents inside a workspace to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => navigate(`/documents/${doc.id}/view`)}
              >
                <div className="flex items-center gap-4">
                  <FileText className="text-red-500 w-8 h-8 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white">{doc.filename || doc.file_name}</h4>
                    <p className="text-xs text-gray-500">
                      {formatBytes(doc.file_size ?? doc.size_bytes ?? 0)} • {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  doc.status === "processed"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : doc.status === "processing"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : doc.status === "failed"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-gray-50 text-gray-600 border-gray-200"
                }`}>
                  {doc.status ?? "pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
