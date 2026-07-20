import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, MessageSquare, FileText, Activity } from 'lucide-react';
import { Button } from '../../../ui/button/Button';
import { workspaceService } from '../services/workspace.api';
import type { Workspace as WorkspaceType } from '../../../types/workspace';
import { Spinner } from '../../../ui/spinner/Spinner';
import { useAbortController } from '../../../hooks/useAbortController';

// Import our new components
import { DocumentLibrary } from '../../documents/pages/DocumentLibrary';
import { Upload as DocumentUpload } from '../../documents/pages/Upload';
import { Chat } from '../../chat/pages/Chat';

const Workspace = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const workspaceId = parseInt(id || "0", 10);

  const [workspace, setWorkspace] = useState<WorkspaceType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'upload' | 'chat'>('chat');
  const { getSignal } = useAbortController();

  useEffect(() => {
    if (!workspaceId) return;

    const fetchWorkspace = async () => {
      try {
        setIsLoading(true);
        const data = await workspaceService.getWorkspace(workspaceId, getSignal());
        setWorkspace(data);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          console.error("Failed to fetch workspace");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspace();
  }, [workspaceId, getSignal]);

  if (isLoading) {
    return <div className="flex justify-center p-12"><Spinner /></div>;
  }

  if (!workspace) {
    return <div className="p-12 text-center text-[var(--color-error-600)]">Workspace not found</div>;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-8">
      {/* Left Sidebar - Workspace Nav */}
      <div className="w-56 flex-shrink-0 space-y-6 overflow-y-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-default)] transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </button>
        
        <div>
          <h2 className="text-xl font-bold text-[var(--text-default)] mb-4 px-3 truncate" title={workspace.name}>
            {workspace.name}
          </h2>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-[var(--color-primary-500)]/10 text-[var(--color-primary-600)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-default)]'}`}
            >
              <Activity className="mr-3 h-5 w-5" />
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'documents' ? 'bg-[var(--color-primary-500)]/10 text-[var(--color-primary-600)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-default)]'}`}
            >
              <FileText className="mr-3 h-5 w-5" />
              Documents
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'chat' ? 'bg-[var(--color-primary-500)]/10 text-[var(--color-primary-600)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-default)]'}`}
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              AI Assistant
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-8 pr-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-default)]">{workspace.name}</h1>
              <p className="text-[var(--text-muted)] mt-4 max-w-2xl">{workspace.description || "No description provided."}</p>
              
              <div className="flex gap-4 mt-6">
                <Button onClick={() => setActiveTab('upload')} className="rounded-lg">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
                <Button onClick={() => setActiveTab('chat')} variant="outline" className="rounded-lg bg-[var(--bg-surface)] text-[var(--text-default)]">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ask AI
                </Button>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-default)]">Recent Documents</h2>
                <Button variant="ghost" onClick={() => setActiveTab('documents')} className="text-sm text-[var(--color-primary-600)] h-auto p-0 hover:bg-transparent hover:text-[var(--color-primary-500)]">
                  View all Library
                </Button>
              </div>
              <DocumentLibrary workspaceId={workspaceId} />
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="pr-4 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[var(--text-default)]">Upload Documents</h1>
              <p className="text-[var(--text-muted)] mt-1">Add new PDF documents to your workspace index.</p>
            </div>
            <DocumentUpload workspaceId={workspaceId} onUploadSuccess={() => setActiveTab('documents')} />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="pr-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-default)]">Document Library</h1>
                <p className="text-[var(--text-muted)] mt-1">Manage all indexed documents.</p>
              </div>
              <Button onClick={() => setActiveTab('upload')}>
                <Upload className="w-4 h-4 mr-2" />
                Upload New
              </Button>
            </div>
            <DocumentLibrary workspaceId={workspaceId} />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full">
            <Chat workspaceId={workspaceId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;
