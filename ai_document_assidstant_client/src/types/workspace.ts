export interface Workspace {
  id: number;
  name: string;
  description?: string;
  documentCount?: number;
  initials?: string;
  color?: string;
}

export interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: number | null;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspace: (id: number) => void;
  addWorkspace: (workspace: Workspace) => void;
}
