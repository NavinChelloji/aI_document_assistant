export interface Workspace {
  id: string; // UUID
  name: string;
  description?: string;
  document_count?: number;
  created_at?: string;
}

export interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspace: (id: string) => void;
  addWorkspace: (workspace: Workspace) => void;
  removeWorkspace: (id: string) => void;
  updateWorkspace: (workspace: Workspace) => void;
}
