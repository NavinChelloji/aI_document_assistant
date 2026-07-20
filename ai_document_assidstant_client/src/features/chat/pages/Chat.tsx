import React, { useState, useEffect, useRef } from "react";
import { Send, AlertCircle, Bot } from "lucide-react";
import { chatService } from "../services/chat.api";
import { useChatStore } from "../../../store/chat.store";
import { ChatMessage } from "../components/ChatMessage";
import { Button } from "../../../ui/button/Button";
import { Spinner } from "../../../ui/spinner/Spinner";
import { useAbortController } from "../../../hooks/useAbortController";

export const Chat = ({ workspaceId }: { workspaceId: number }) => {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { activeSessionId, sessions, setActiveSession, createSession, addMessage, setSessions } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getSignal } = useAbortController();
  
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load or create session
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoadingHistory(true);
        // First try to get existing sessions
        const existingSessions = await chatService.getSessions(workspaceId, getSignal());
        
        if (existingSessions.length > 0) {
          setSessions(existingSessions);
          setActiveSession(existingSessions[0].id);
          // Load history for active session
          const history = await chatService.getSessionHistory(existingSessions[0].id, getSignal());
          // Update session with history
          const updatedSession = { ...existingSessions[0], messages: history };
          setSessions([updatedSession, ...existingSessions.slice(1)]);
        } else {
          // Create new session
          const newSession = await chatService.createSession(workspaceId, "New Conversation", getSignal());
          createSession({ ...newSession, messages: [] });
        }
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setError("Failed to initialize chat session.");
        }
      } finally {
        setIsLoadingHistory(false);
      }
    };

    initializeChat();
  }, [workspaceId, setSessions, setActiveSession, createSession, getSignal]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !activeSessionId || isSending) return;

    const userMessageContent = input.trim();
    setInput("");
    setError(null);
    setIsSending(true);

    // Optimistically add user message (with a temporary negative ID)
    addMessage(activeSessionId, {
      id: -Date.now(),
      session_id: activeSessionId,
      content: userMessageContent,
      role: 'user',
      created_at: new Date().toISOString()
    });

    try {
      const aiResponse = await chatService.sendMessage(activeSessionId, userMessageContent);
      addMessage(activeSessionId, aiResponse);
    } catch (err: any) {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoadingHistory) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-default)]">
        <Spinner />
        <p className="mt-4 text-sm text-[var(--text-muted)] font-medium">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-default)] overflow-hidden shadow-sm relative transition-colors">
      {/* Header */}
      <div className="bg-[var(--bg-surface)] px-6 py-4 border-b border-[var(--border-default)] z-10 flex-shrink-0 flex justify-between items-center shadow-sm transition-colors">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-default)]">
            {activeSession?.title || "Document Assistant"}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] mr-2"></span>
            AI is ready to answer questions about your documents
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-3 flex items-center text-[var(--color-error-600)] border-b border-[var(--color-error-600)]/20 flex-shrink-0 z-10 transition-colors">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-[var(--color-primary-500)]/10 text-[var(--color-primary-600)] rounded-2xl flex items-center justify-center mb-6 shadow-sm rotate-3 transition-colors">
              <Bot className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-default)] mb-2">How can I help you today?</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Ask me anything about the documents in this workspace. I can extract information, summarize long PDFs, or find specific details for you.
            </p>
            
            <div className="mt-8 grid gap-3 w-full">
              <button onClick={() => setInput("Summarize the key points of the latest uploaded document.")} className="text-left text-sm bg-[var(--bg-surface)] border border-[var(--border-default)] p-3 rounded-lg hover:border-[var(--color-primary-500)] hover:bg-[var(--color-primary-500)]/5 transition-colors shadow-sm text-[var(--text-default)]">
                "Summarize the key points of the latest document"
              </button>
              <button onClick={() => setInput("What are the main conclusions drawn in the research paper?")} className="text-left text-sm bg-[var(--bg-surface)] border border-[var(--border-default)] p-3 rounded-lg hover:border-[var(--color-primary-500)] hover:bg-[var(--color-primary-500)]/5 transition-colors shadow-sm text-[var(--text-default)]">
                "What are the main conclusions drawn in the research paper?"
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-6">
            {messages.map((msg, index) => (
              <ChatMessage key={msg.id || index} message={msg} />
            ))}
            
            {isSending && (
              <div className="flex w-full mt-4 space-x-3 max-w-4xl mx-auto justify-start animate-pulse">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary-500)]/10 flex items-center justify-center transition-colors">
                  <Bot className="w-5 h-5 text-[var(--color-primary-600)]" />
                </div>
                <div className="px-5 py-3.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl rounded-tl-sm flex items-center space-x-1 transition-colors">
                  <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[var(--bg-surface)] border-t border-[var(--border-default)] flex-shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] transition-colors">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-end">
          <textarea
            className="w-full resize-none bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-xl py-3 pl-4 pr-14 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent focus:bg-[var(--bg-surface)] transition-all text-sm shadow-sm text-[var(--text-default)]"
            placeholder="Ask about your documents... (Shift+Enter for new line)"
            rows={1}
            style={{ minHeight: "52px", maxHeight: "200px" }}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Auto-resize
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
            }}
            onKeyDown={handleKeyDown}
            disabled={isSending}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isSending}
            className="absolute right-2 bottom-1.5 h-10 w-10 p-0 rounded-lg shadow-sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <div className="text-center mt-2">
          <p className="text-[10px] text-[var(--text-muted)]">AI can make mistakes. Consider verifying important information.</p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
