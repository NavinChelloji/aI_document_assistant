export interface Citation {
  documentId: number;
  documentName: string;
  pageNumber: number;
}

export interface Message {
  id: number;
  session_id: number;
  content: string;
  role: 'user' | 'ai';
  created_at: string;
  citations?: Citation[];
}

export interface ChatSession {
  id: number;
  workspace_id: number;
  title: string;
  created_at: string;
  messages?: Message[];
}

export interface ChatState {
  sessions: ChatSession[];
  activeSessionId: number | null;
  setSessions: (sessions: ChatSession[]) => void;
  setActiveSession: (id: number) => void;
  addMessage: (sessionId: number, message: Message) => void;
  createSession: (session: ChatSession) => void;
}
