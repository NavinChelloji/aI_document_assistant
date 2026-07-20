export interface Workspace {
  id: string;
  name: string;
  documentCount: number;
  initials: string;
  color: string;
}

export interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspace: (id: string) => void;
  addWorkspace: (workspace: Workspace) => void;
}
