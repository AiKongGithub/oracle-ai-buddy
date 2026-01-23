import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useChatStore } from './useChatStore';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
          single: vi.fn(),
        }),
      }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    }),
  },
}));

describe('useChatStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useChatStore.setState({
      sessions: [],
      currentSession: null,
      messages: [],
      isTyping: false,
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useChatStore.getState();

      expect(state.sessions).toEqual([]);
      expect(state.currentSession).toBeNull();
      expect(state.messages).toEqual([]);
      expect(state.isTyping).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('setSessions', () => {
    it('should update sessions', () => {
      const mockSessions = [
        { id: '1', user_id: 'user1', title: 'Chat 1', created_at: '', updated_at: '' },
        { id: '2', user_id: 'user1', title: 'Chat 2', created_at: '', updated_at: '' },
      ];

      useChatStore.getState().setSessions(mockSessions);

      expect(useChatStore.getState().sessions).toEqual(mockSessions);
    });
  });

  describe('setCurrentSession', () => {
    it('should set current session', () => {
      const mockSession = {
        id: '1',
        user_id: 'user1',
        title: 'Test Chat',
        created_at: '',
        updated_at: '',
      };

      useChatStore.getState().setCurrentSession(mockSession);

      expect(useChatStore.getState().currentSession).toEqual(mockSession);
    });

    it('should set current session to null', () => {
      // First set a session
      useChatStore.getState().setCurrentSession({
        id: '1',
        user_id: 'user1',
        title: 'Test',
        created_at: '',
        updated_at: '',
      });

      // Then clear it
      useChatStore.getState().setCurrentSession(null);

      expect(useChatStore.getState().currentSession).toBeNull();
    });
  });

  describe('setMessages', () => {
    it('should set messages array', () => {
      const mockMessages = [
        { id: '1', role: 'user' as const, content: 'Hello', timestamp: new Date() },
        { id: '2', role: 'assistant' as const, content: 'Hi!', timestamp: new Date() },
      ];

      useChatStore.getState().setMessages(mockMessages);

      expect(useChatStore.getState().messages).toEqual(mockMessages);
    });
  });

  describe('addMessage', () => {
    it('should add message to existing messages', () => {
      const existingMessage = {
        id: '1',
        role: 'user' as const,
        content: 'Hello',
        timestamp: new Date(),
      };
      const newMessage = {
        id: '2',
        role: 'assistant' as const,
        content: 'Hi!',
        timestamp: new Date(),
      };

      useChatStore.getState().setMessages([existingMessage]);
      useChatStore.getState().addMessage(newMessage);

      const messages = useChatStore.getState().messages;
      expect(messages).toHaveLength(2);
      expect(messages[0]).toEqual(existingMessage);
      expect(messages[1]).toEqual(newMessage);
    });

    it('should add message to empty messages array', () => {
      const newMessage = {
        id: '1',
        role: 'user' as const,
        content: 'First message',
        timestamp: new Date(),
      };

      useChatStore.getState().addMessage(newMessage);

      expect(useChatStore.getState().messages).toHaveLength(1);
      expect(useChatStore.getState().messages[0]).toEqual(newMessage);
    });
  });

  describe('setTyping', () => {
    it('should update typing state', () => {
      useChatStore.getState().setTyping(true);
      expect(useChatStore.getState().isTyping).toBe(true);

      useChatStore.getState().setTyping(false);
      expect(useChatStore.getState().isTyping).toBe(false);
    });
  });

  describe('deleteSession', () => {
    it('should remove session from sessions list', async () => {
      const mockSessions = [
        { id: '1', user_id: 'user1', title: 'Chat 1', created_at: '', updated_at: '' },
        { id: '2', user_id: 'user1', title: 'Chat 2', created_at: '', updated_at: '' },
      ];
      useChatStore.setState({ sessions: mockSessions });

      await useChatStore.getState().deleteSession('1');

      const state = useChatStore.getState();
      expect(state.sessions).toHaveLength(1);
      expect(state.sessions[0].id).toBe('2');
    });

    it('should clear currentSession if deleted session is current', async () => {
      const mockSession = { id: '1', user_id: 'user1', title: 'Chat 1', created_at: '', updated_at: '' };
      useChatStore.setState({
        sessions: [mockSession],
        currentSession: mockSession,
        messages: [{ id: 'm1', role: 'user', content: 'test', timestamp: new Date() }],
      });

      await useChatStore.getState().deleteSession('1');

      const state = useChatStore.getState();
      expect(state.currentSession).toBeNull();
      expect(state.messages).toHaveLength(0);
    });
  });
});
