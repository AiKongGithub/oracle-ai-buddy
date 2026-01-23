import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUserStore } from './useUserStore';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn(),
        }),
      }),
    }),
  },
}));

describe('useUserStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUserStore.setState({
      user: null,
      supabaseUser: null,
      isLoading: true,
      isAuthenticated: false,
      stats: null,
    });
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useUserStore.getState();

      expect(state.user).toBeNull();
      expect(state.supabaseUser).toBeNull();
      expect(state.isLoading).toBe(true);
      expect(state.isAuthenticated).toBe(false);
      expect(state.stats).toBeNull();
    });
  });

  describe('setUser', () => {
    it('should set user and update isAuthenticated to true', () => {
      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      useUserStore.getState().setUser(mockUser);

      const state = useUserStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should set isAuthenticated to false when user is null', () => {
      // First set a user
      useUserStore.getState().setUser({
        id: '123',
        name: 'Test',
        email: 'test@example.com',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Then clear user
      useUserStore.getState().setUser(null);

      const state = useUserStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('setLoading', () => {
    it('should update loading state', () => {
      useUserStore.getState().setLoading(false);
      expect(useUserStore.getState().isLoading).toBe(false);

      useUserStore.getState().setLoading(true);
      expect(useUserStore.getState().isLoading).toBe(true);
    });
  });

  describe('setStats', () => {
    it('should set dashboard stats', () => {
      const mockStats = {
        totalCourses: 5,
        completedCourses: 2,
        totalLessons: 50,
        completedLessons: 20,
        totalTime: 300,
        streak: 7,
      };

      useUserStore.getState().setStats(mockStats);

      expect(useUserStore.getState().stats).toEqual(mockStats);
    });
  });

  describe('signOut', () => {
    it('should clear all user data on sign out', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.signOut as ReturnType<typeof vi.fn>).mockResolvedValue({ error: null });

      // Set up initial state
      useUserStore.setState({
        user: { id: '123', name: 'Test', email: 'test@example.com', avatar_url: null, created_at: '', updated_at: '' },
        supabaseUser: { id: '123' } as never,
        isAuthenticated: true,
        stats: { totalCourses: 1, completedCourses: 0, totalLessons: 5, completedLessons: 0, totalTime: 0, streak: 0 },
      });

      await useUserStore.getState().signOut();

      const state = useUserStore.getState();
      expect(state.user).toBeNull();
      expect(state.supabaseUser).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.stats).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });
});
