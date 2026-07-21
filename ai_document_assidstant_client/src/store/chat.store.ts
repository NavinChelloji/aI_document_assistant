import { create } from 'zustand';
import type { ChatState, ChatSession, Message } from '../types/chat';

export const useChatStore = create<ChatState>()((set) => ({
  sessions: [],
  activeSessionId: null,
  setSessions: (sessions: ChatSession[]) => set({ sessions }),
  setActiveSession: (id: string) => set({ activeSessionId: id }),
  addMessage: (sessionId: string, message: Message) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, messages: [...(session.messages || []), message] }
          : session
      ),
    })),
  createSession: (session: ChatSession) =>
    set((state) => ({
      sessions: [session, ...state.sessions],
      activeSessionId: session.id,
    })),
  removeSession: (id: string) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      activeSessionId:
        state.activeSessionId === id
          ? (state.sessions.find((s) => s.id !== id)?.id ?? null)
          : state.activeSessionId,
    })),
}));
