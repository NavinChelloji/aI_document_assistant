import { create } from 'zustand';
import type { ChatState, ChatSession, Message } from '../types/chat';

export const useChatStore = create<ChatState>()((set) => ({
  sessions: [],
  activeSessionId: null,
  setSessions: (sessions: ChatSession[]) => set({ sessions }),
  setActiveSession: (id: number) => set({ activeSessionId: id }),
  addMessage: (sessionId: number, message: Message) => 
    set((state) => ({
      sessions: state.sessions.map(session => 
        session.id === sessionId 
          ? { ...session, messages: [...(session.messages || []), message] }
          : session
      )
    })),
  createSession: (session: ChatSession) => 
    set((state) => ({
      sessions: [session, ...state.sessions],
      activeSessionId: session.id
    })),
}));
