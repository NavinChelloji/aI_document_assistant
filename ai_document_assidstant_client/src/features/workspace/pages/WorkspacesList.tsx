import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus, Folder, Search, Trash2, Edit2, X, Loader2, AlertCircle,
  FileText, MessageSquare, ChevronRight
} from "lucide-react";
import { workspaceService } from "../services/workspace.api";
import { useWorkspaceStore } from "../../../store/workspace.store";
import { useAbortController } from "../../../hooks/useAbortController";
import type { Workspace } from "../../../types/workspace";

/* ── Create/Edit Modal ── */
function WorkspaceModal({
  workspace,
  onClose,
  onSaved,
}: {
  workspace?: Workspace;
  onClose: () => void;
  onSaved: (ws: Workspace) => void;
}) {
  const isEdit = !!workspace;
  const [name, setName] = useState(workspace?.name ?? "");
  const [description, setDescription] = useState(workspace?.description ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { getSignal } = useAbortController();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      let ws: Workspace;
      if (isEdit && workspace) {
        ws = await workspaceService.updateWorkspace(workspace.id, { name: name.trim(), description: description.trim() || undefined }, getSignal());
      } else {
        ws = await workspaceService.createWorkspace({ name: name.trim(), description: description.trim() || undefined }, getSignal());
      }
      onSaved(ws);
      onClose();
    } catch (err: any) {
      if (err.name !== "CanceledError") setError(err.response?.data?.detail || `Failed to ${isEdit ? "update" : "create"} workspace.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEdit ? "Edit Workspace" : "New Workspace"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. HR Policies"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
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
              {isEdit ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Delete Confirm Dialog ── */
function DeleteConfirm({ name, onCancel, onConfirm, loading }: { name: string; onCancel: () => void; onConfirm: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-7 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-center w-14 h-14 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full mb-5">
          <Trash2 className="w-7 h-7 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">Delete Workspace</h3>
        <p className="text-sm text-center text-gray-500 mb-6">
          Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{name}"</span>? All documents and chats will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Workspace Colors ── */
const COLORS = [
  "bg-blue-100 text-blue-600", "bg-purple-100 text-purple-600",
  "bg-green-100 text-green-600", "bg-orange-100 text-orange-600",
  "bg-red-100 text-red-600", "bg-teal-100 text-teal-600",
  "bg-pink-100 text-pink-600", "bg-indigo-100 text-indigo-600",
];

/* ── Main WorkspacesList Page ── */
export const WorkspacesList = () => {
  const navigate = useNavigate();
  const { workspaces, setWorkspaces, addWorkspace, removeWorkspace, updateWorkspace } = useWorkspaceStore();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingWs, setEditingWs] = useState<Workspace | null>(null);
  const [deletingWs, setDeletingWs] = useState<Workspace | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { getSignal } = useAbortController();

  const fetchWorkspaces = useCallback(async () => {
    try {
      setIsLoading(true);
      const list = await workspaceService.getWorkspaces(getSignal());
      setWorkspaces(list);
    } catch (err: any) {
      if (err.name !== "CanceledError") setError("Failed to load workspaces.");
    } finally {
      setIsLoading(false);
    }
  }, [setWorkspaces, getSignal]);

  useEffect(() => { fetchWorkspaces(); }, [fetchWorkspaces]);

  const handleDelete = async () => {
    if (!deletingWs) return;
    setDeleteLoading(true);
    try {
      await workspaceService.deleteWorkspace(deletingWs.id);
      removeWorkspace(deletingWs.id);
      setDeletingWs(null);
    } catch {
      alert("Failed to delete workspace.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = workspaces.filter(
    (ws) =>
      ws.name.toLowerCase().includes(search.toLowerCase()) ||
      (ws.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {showCreate && (
        <WorkspaceModal onClose={() => setShowCreate(false)} onSaved={(ws) => addWorkspace(ws)} />
      )}
      {editingWs && (
        <WorkspaceModal
          workspace={editingWs}
          onClose={() => setEditingWs(null)}
          onSaved={(ws) => { updateWorkspace(ws); setEditingWs(null); }}
        />
      )}
      {deletingWs && (
        <DeleteConfirm
          name={deletingWs.name}
          onCancel={() => setDeletingWs(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workspaces</h1>
          <p className="text-gray-500 mt-1">{workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Workspace
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search workspaces..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-sm mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Folder className="w-16 h-16 mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {search ? "No matching workspaces" : "No workspaces yet"}
          </h3>
          <p className="text-sm mt-1">
            {search ? "Try a different search term." : "Create your first workspace to get started."}
          </p>
          {!search && (
            <button
              onClick={() => setShowCreate(true)}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Workspace
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((ws, i) => (
            <div
              key={ws.id}
              className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer"
              onClick={() => navigate(`/workspace/${ws.id}`)}
            >
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingWs(ws); }}
                  className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeletingWs(ws); }}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Icon + Name */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl mb-4 ${COLORS[i % COLORS.length]}`}>
                {ws.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate pr-16">{ws.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[2.5rem]">
                {ws.description || "No description provided."}
              </p>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {ws.document_count ?? 0} docs</span>
                </div>
                <span className="text-blue-600 font-medium flex items-center gap-1 group-hover:underline">
                  Open <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
