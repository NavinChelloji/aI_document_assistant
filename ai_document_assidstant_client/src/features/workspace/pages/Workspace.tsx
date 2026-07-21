import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, MessageSquare, FileText, Activity, Plus, Menu, X } from 'lucide-react';
import { workspaceService } from '../services/workspace.api';
import type { Workspace as WorkspaceType } from '../../../types/workspace';
import { Spinner } from '../../../ui/spinner/Spinner';
import { useAbortController } from '../../../hooks/useAbortController';
import { DocumentLibrary } from '../../documents/pages/DocumentLibrary';
import { Upload as DocumentUpload } from '../../documents/pages/Upload';
import { Chat } from '../../chat/pages/Chat';

type Tab = 'overview' | 'documents' | 'upload' | 'chat';

const Workspace = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const workspaceId = id ?? '';
  const [workspace, setWorkspace] = useState<WorkspaceType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { getSignal } = useAbortController();

  useEffect(() => {
    if (!workspaceId) return;
    const fetchWorkspace = async () => {
      try {
        setIsLoading(true);
        const data = await workspaceService.getWorkspace(workspaceId, getSignal());
        setWorkspace(data);
      } catch (err: any) {
        if (err.name !== 'CanceledError') console.error('Failed to fetch workspace');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkspace();
  }, [workspaceId, getSignal]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  if (isLoading) return <div className="flex justify-center p-12"><Spinner /></div>;
  if (!workspace) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500 px-4 text-center">
      <p className="font-medium">Workspace not found.</p>
      <button onClick={() => navigate('/workspaces')} className="mt-3 text-sm text-blue-600 hover:underline">← Back to Workspaces</button>
    </div>
  );

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'overview',   label: 'Overview',      icon: Activity },
    { key: 'documents',  label: 'Documents',      icon: FileText },
    { key: 'upload',     label: 'Upload',         icon: Upload },
    { key: 'chat',       label: 'AI Assistant',   icon: MessageSquare },
  ];

  const SidebarContent = () => (
    <>
      <button
        onClick={() => navigate('/workspaces')}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-5 px-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="px-2 mb-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white truncate" title={workspace.name}>
          {workspace.name}
        </h2>
        {workspace.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{workspace.description}</p>
        )}
      </div>
      <nav className="space-y-0.5 flex-1">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </button>
        ))}
      </nav>
    </>
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] overflow-hidden">

      {/* ── Mobile overlay ── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── Desktop Sidebar (always visible md+) ── */}
      <aside className="hidden md:flex w-56 flex-shrink-0 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex-col py-6 px-3">
        <SidebarContent />
      </aside>

      {/* ── Mobile Slide-in Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col py-6 px-3 shadow-xl transform transition-transform duration-300 md:hidden ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50 dark:bg-gray-950">

        {/* Mobile top bar with tab name + hamburger */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 -ml-1 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{workspace.name}</p>
            <p className="text-xs text-gray-500 capitalize">{activeTab}</p>
          </div>
        </div>

        {/* Mobile tab bar (bottom scroll) */}
        <div className="md:hidden flex overflow-x-auto gap-1 px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 scrollbar-none">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-colors ${
                activeTab === key
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{workspace.name}</h1>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">{workspace.description || 'No description provided.'}</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-5 sm:mt-6">
                <button
                  onClick={() => setActiveTab('upload')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  <Upload className="w-4 h-4" /> Upload Document
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm font-semibold transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> Ask AI
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: 'Documents', value: workspace.document_count ?? 0, icon: FileText, color: 'bg-blue-100 text-blue-600' },
                { label: 'Chats', value: '—', icon: MessageSquare, color: 'bg-purple-100 text-purple-600' },
                { label: 'Created', value: workspace.created_at ? new Date(workspace.created_at).toLocaleDateString() : '—', icon: Activity, color: 'bg-green-100 text-green-600' },
              ].map((s) => (
                <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm">
                  <div className={`p-2.5 sm:p-3 rounded-xl ${s.color} flex-shrink-0`}><s.icon className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Documents */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Documents</h2>
                <button onClick={() => setActiveTab('upload')} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <DocumentLibrary workspaceId={workspaceId} />
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Document Library</h1>
                <p className="text-gray-500 mt-1 text-sm">All indexed documents in this workspace.</p>
              </div>
              <button
                onClick={() => setActiveTab('upload')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm w-full sm:w-auto"
              >
                <Upload className="w-4 h-4" /> Upload New
              </button>
            </div>
            <DocumentLibrary workspaceId={workspaceId} />
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-3xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Upload Documents</h1>
              <p className="text-gray-500 mt-1 text-sm">Add new documents to <span className="font-semibold text-gray-700 dark:text-gray-300">{workspace.name}</span> for AI processing.</p>
            </div>
            <DocumentUpload workspaceId={workspaceId} onUploadSuccess={() => setActiveTab('documents')} />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full p-3 sm:p-4">
            <Chat workspaceId={workspaceId} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Workspace;
