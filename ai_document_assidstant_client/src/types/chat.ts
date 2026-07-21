export interface Citation {
  document_id: string; // UUID
  document_name: string;
  page_number: number;
  chunk_text?: string;
}

export interface Message {
  id: string; // UUID
  session_id: string; // UUID
  content: string;
  role: 'user' | 'ai';
  created_at: string;
  citations?: Citation[];
}

export interface ChatSession {
  id: string; // UUID
  workspace_id: string; // UUID
  title: string;
  created_at: string;
  messages?: Message[];
}

export interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  setSessions: (sessions: ChatSession[]) => void;
  setActiveSession: (id: string) => void;
  addMessage: (sessionId: string, message: Message) => void;
  createSession: (session: ChatSession) => void;
  removeSession: (id: string) => void;
}
