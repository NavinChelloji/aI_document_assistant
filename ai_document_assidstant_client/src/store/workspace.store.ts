import { create } from 'zustand';
import { WorkspaceState, Workspace } from '../types/workspace';

export const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  workspaces: [],
  activeWorkspaceId: null,
  setWorkspaces: (workspaces: Workspace[]) => set({ workspaces }),
  setActiveWorkspace: (id: string) => set({ activeWorkspaceId: id }),
  addWorkspace: (workspace: Workspace) => 
    set((state) => ({ workspaces: [...state.workspaces, workspace] })),
}));
