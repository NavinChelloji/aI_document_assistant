import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Search, Bot, Trash2, X, Loader2, AlertCircle, ChevronDown, MessageSquare } from "lucide-react";
import { chatService } from "../services/chat.api";
import { workspaceService } from "../../workspace/services/workspace.api";
import { useChatStore } from "../../../store/chat.store";
import { useWorkspaceStore } from "../../../store/workspace.store";
import { useAbortController } from "../../../hooks/useAbortController";
import { Chat } from "./Chat";
import type { Workspace } from "../../../types/workspace";

/* ── Workspace Selector Dropdown ── */
function WorkspacePicker({
  workspaces,
  selected,
  onChange,
}: {
  workspaces: Workspace[];
  selected: Workspace | null;
  onChange: (ws: Workspace) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="truncate max-w-[140px]">{selected?.name ?? "Select workspace"}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => { onChange(ws); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                selected?.id === ws.id
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {ws.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main DocumentChat Page ── */
export const DocumentChat = () => {
  const { id: sessionIdParam } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { getSignal } = useAbortController();

  const { sessions, setSessions, setActiveSession, activeSessionId, createSession, removeSession } = useChatStore();
  const { workspaces, setWorkspaces } = useWorkspaceStore();

  const [activeWs, setActiveWs] = useState<Workspace | null>(null);
  const [search, setSearch] = useState("");
  const [loadingWs, setLoadingWs] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  /* Load workspaces once */
  useEffect(() => {
    const load = async () => {
      try {
        const wsList = await workspaceService.getWorkspaces(getSignal());
        setWorkspaces(wsList);
        if (wsList.length > 0) setActiveWs(wsList[0]);
      } catch (err: any) {
        if (err.name !== "CanceledError") setError("Failed to load workspaces.");
      } finally {
        setLoadingWs(false);
      }
    };
    load();
  }, [setWorkspaces, getSignal]);

  /* Load sessions when workspace changes */
  useEffect(() => {
    if (!activeWs) return;
    const load = async () => {
      setLoadingSessions(true);
      setError("");
      try {
        const list = await chatService.getSessions(activeWs.id, getSignal());
        setSessions(list.map((s) => ({ ...s, messages: [] })));
        if (list.length > 0) {
          const target = sessionIdParam
            ? list.find((s) => s.id === sessionIdParam) ?? list[0]
            : list[0];
          setActiveSession(target.id);
          navigate(`/chat/${target.id}`, { replace: true });
        }
      } catch (err: any) {
        if (err.name !== "CanceledError") setError("Failed to load conversations.");
      } finally {
        setLoadingSessions(false);
      }
    };
    load();
  }, [activeWs, getSignal, setSessions, setActiveSession, sessionIdParam, navigate]);

  const handleNewChat = async () => {
    if (!activeWs || creatingSession) return;
    setCreatingSession(true);
    setError("");
    try {
      const session = await chatService.createSession(activeWs.id, "New conversation", getSignal());
      createSession({ ...session, messages: [] });
      navigate(`/chat/${session.id}`, { replace: true });
    } catch (err: any) {
      if (err.name !== "CanceledError") setError("Failed to create conversation.");
    } finally {
      setCreatingSession(false);
    }
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await chatService.deleteSession(id, getSignal());
      removeSession(id);
      if (activeSessionId === id) {
        const remaining = sessions.filter((s) => s.id !== id);
        if (remaining.length > 0) {
          setActiveSession(remaining[0].id);
          navigate(`/chat/${remaining[0].id}`, { replace: true });
        } else {
          navigate("/chat", { replace: true });
        }
      }
    } catch {
      setError("Failed to delete conversation.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* ── Left Sidebar ── */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 space-y-3">
          {/* Workspace Picker */}
          {loadingWs ? (
            <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          ) : (
            <WorkspacePicker
              workspaces={workspaces}
              selected={activeWs}
              onChange={(ws) => { setActiveWs(ws); setSessions([]); }}
            />
          )}
          {/* New Chat button */}
          <button
            onClick={handleNewChat}
            disabled={creatingSession || !activeWs}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            {creatingSession ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            New Chat
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto py-2">
          {error && (
            <div className="mx-3 mb-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 text-xs rounded-lg flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
            </div>
          )}
          {loadingSessions ? (
            <div className="space-y-1 px-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 px-4 text-center">
              <MessageSquare className="w-8 h-8 mb-2 text-gray-300" />
              <p className="text-sm font-medium">{search ? "No matching chats" : "No conversations yet"}</p>
              {!search && <p className="text-xs mt-1">Click "New Chat" to start</p>}
            </div>
          ) : (
            <div className="space-y-0.5 px-2">
              {filteredSessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => { setActiveSession(s.id); navigate(`/chat/${s.id}`, { replace: true }); }}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    activeSessionId === s.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{s.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(s.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(s.id, e)}
                    disabled={deletingId === s.id}
                    className="flex-shrink-0 p-1.5 ml-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    {deletingId === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Chat Area ── */}
      <main className="flex-1 min-w-0 flex flex-col">
        {!activeWs ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
            <Bot className="w-16 h-16 text-gray-200" />
            <div className="text-center">
              <p className="font-semibold text-gray-600 dark:text-gray-400">No workspace selected</p>
              <p className="text-sm text-gray-400 mt-1">Create a workspace first, then start chatting.</p>
            </div>
          </div>
        ) : !activeSessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center">
              <Bot className="w-10 h-10 text-blue-500" />
            </div>
            <div className="text-center max-w-xs">
              <p className="font-bold text-xl text-gray-900 dark:text-white">AI Document Assistant</p>
              <p className="text-sm text-gray-500 mt-2">
                Ask questions about documents in <span className="font-semibold text-blue-600">{activeWs.name}</span>.
                Start by clicking <strong>New Chat</strong>.
              </p>
            </div>
            <button
              onClick={handleNewChat}
              disabled={creatingSession}
              className="mt-2 flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
            >
              {creatingSession ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Start a New Chat
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden p-4">
            <Chat workspaceId={activeWs.id} />
          </div>
        )}
      </main>
    </div>
  );
};
