import { create } from 'zustand';
import type { Message, ChatSession } from '@/types';

interface ChatState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  isTyping: boolean;

  // Actions
  setSessions: (sessions: ChatSession[]) => void;
  setCurrentSession: (session: ChatSession | null) => void;
  addMessage: (message: Message) => void;
  setTyping: (typing: boolean) => void;
  createNewSession: (userId: string) => void;
  clearCurrentSession: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  currentSession: null,
  isTyping: false,

  setSessions: (sessions) => set({ sessions }),

  setCurrentSession: (currentSession) => set({ currentSession }),

  addMessage: (message) => {
    const { currentSession } = get();
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, message],
      updatedAt: new Date(),
    };

    set({
      currentSession: updatedSession,
      sessions: get().sessions.map((s) =>
        s.id === currentSession.id ? updatedSession : s
      ),
    });
  },

  setTyping: (isTyping) => set({ isTyping }),

  createNewSession: (userId) => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      userId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set({
      currentSession: newSession,
      sessions: [newSession, ...get().sessions],
    });
  },

  clearCurrentSession: () => set({ currentSession: null }),
}));
