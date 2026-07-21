import { create } from 'zustand';
import type { WorkspaceState, Workspace } from '../types/workspace';

export const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  workspaces: [],
  activeWorkspaceId: null,
  setWorkspaces: (workspaces: Workspace[]) => set({ workspaces }),
  setActiveWorkspace: (id: string) => set({ activeWorkspaceId: id }),
  addWorkspace: (workspace: Workspace) =>
    set((state) => ({ workspaces: [workspace, ...state.workspaces] })),
  removeWorkspace: (id: string) =>
    set((state) => ({ workspaces: state.workspaces.filter((w) => w.id !== id) })),
  updateWorkspace: (workspace: Workspace) =>
    set((state) => ({
      workspaces: state.workspaces.map((w) => (w.id === workspace.id ? workspace : w)),
    })),
}));
