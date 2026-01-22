import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { ChatSession } from '@/types/database';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: Message[];
  isTyping: boolean;
  isLoading: boolean;

  // Actions
  setSessions: (sessions: ChatSession[]) => void;
  setCurrentSession: (session: ChatSession | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setTyping: (typing: boolean) => void;

  // Supabase Actions
  fetchSessions: (userId: string) => Promise<void>;
  fetchMessages: (sessionId: string) => Promise<void>;
  createSession: (userId: string, title?: string) => Promise<ChatSession | null>;
  saveMessage: (sessionId: string, role: 'user' | 'assistant' | 'system', content: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  currentSession: null,
  messages: [],
  isTyping: false,
  isLoading: false,

  setSessions: (sessions) => set({ sessions }),
  setCurrentSession: (currentSession) => set({ currentSession }),
  setMessages: (messages) => set({ messages }),

  addMessage: (message) => {
    set({ messages: [...get().messages, message] });
  },

  setTyping: (isTyping) => set({ isTyping }),

  // Fetch all chat sessions for a user
  fetchSessions: async (userId) => {
    set({ isLoading: true });

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[BUDDY-ERROR] Failed to fetch sessions:', error.message);
      set({ isLoading: false });
      return;
    }

    const sessions = (data || []) as ChatSession[];
    set({ sessions, isLoading: false });
    console.log('[BUDDY-DATA] Sessions loaded:', sessions.length);
  },

  // Fetch messages for a session
  fetchMessages: async (sessionId) => {
    set({ isLoading: true });

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[BUDDY-ERROR] Failed to fetch messages:', error.message);
      set({ isLoading: false });
      return;
    }

    const messages: Message[] = (data || []).map((msg: { id: string; role: string; content: string; created_at: string }) => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
      timestamp: new Date(msg.created_at),
    }));

    set({ messages, isLoading: false });
    console.log('[BUDDY-DATA] Messages loaded:', messages.length);
  },

  // Create a new chat session
  createSession: async (userId, title = 'New Chat') => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ user_id: userId, title } as never)
      .select()
      .single();

    if (error) {
      console.error('[BUDDY-ERROR] Failed to create session:', error.message);
      return null;
    }

    const session = data as ChatSession | null;
    if (session) {
      set({
        currentSession: session,
        sessions: [session, ...get().sessions],
        messages: [],
      });
      console.log('[BUDDY-ACTION] Session created:', session.id);
    }

    return session;
  },

  // Save a message to database
  saveMessage: async (sessionId, role, content) => {
    const { error } = await supabase
      .from('chat_messages')
      .insert({ session_id: sessionId, role, content } as never);

    if (error) {
      console.error('[BUDDY-ERROR] Failed to save message:', error.message);
      return;
    }

    // Update session's updated_at
    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() } as never)
      .eq('id', sessionId);

    console.log('[BUDDY-ACTION] Message saved');
  },

  // Delete a session
  deleteSession: async (sessionId) => {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      console.error('[BUDDY-ERROR] Failed to delete session:', error.message);
      return;
    }

    set({
      sessions: get().sessions.filter((s) => s.id !== sessionId),
      currentSession: get().currentSession?.id === sessionId ? null : get().currentSession,
      messages: get().currentSession?.id === sessionId ? [] : get().messages,
    });

    console.log('[BUDDY-ACTION] Session deleted');
  },
}));
