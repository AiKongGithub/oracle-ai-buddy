import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { DashboardStats } from '@/types';
import type { Profile } from '@/types/database';

interface UserState {
  user: Profile | null;
  supabaseUser: SupabaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  stats: DashboardStats | null;

  // Actions
  setUser: (user: Profile | null) => void;
  setSupabaseUser: (user: SupabaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  setStats: (stats: DashboardStats) => void;

  // Auth Actions
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  supabaseUser: null,
  isLoading: true,
  isAuthenticated: false,
  stats: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSupabaseUser: (supabaseUser) => set({ supabaseUser }),
  setLoading: (isLoading) => set({ isLoading }),
  setStats: (stats) => set({ stats }),

  // Sign in with email/password
  signInWithEmail: async (email, password) => {
    set({ isLoading: true });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[BUDDY-ERROR] Sign in failed:', error.message);
      set({ isLoading: false });
      return { error: error.message };
    }

    if (data.user) {
      set({ supabaseUser: data.user });
      await get().fetchProfile();
    }

    set({ isLoading: false });
    console.log('[BUDDY-ACTION] User signed in successfully');
    return { error: null };
  },

  // Sign up with email/password
  signUpWithEmail: async (email, password, name) => {
    set({ isLoading: true });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name || email.split('@')[0] },
      },
    });

    if (error) {
      console.error('[BUDDY-ERROR] Sign up failed:', error.message);
      set({ isLoading: false });
      return { error: error.message };
    }

    if (data.user) {
      set({ supabaseUser: data.user });
      // Profile will be auto-created by database trigger
      await get().fetchProfile();
    }

    set({ isLoading: false });
    console.log('[BUDDY-ACTION] User signed up successfully');
    return { error: null };
  },

  // Sign out
  signOut: async () => {
    set({ isLoading: true });

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[BUDDY-ERROR] Sign out failed:', error.message);
    }

    set({
      user: null,
      supabaseUser: null,
      isAuthenticated: false,
      stats: null,
      isLoading: false,
    });

    console.log('[BUDDY-ACTION] User signed out');
  },

  // Fetch user profile from database
  fetchProfile: async () => {
    const { supabaseUser } = get();
    if (!supabaseUser) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('[BUDDY-ERROR] Failed to fetch profile:', error.message);
      return;
    }

    if (data) {
      set({ user: data, isAuthenticated: true });
      console.log('[BUDDY-DATA] Profile loaded');
    }
  },

  // Initialize auth state
  initialize: async () => {
    set({ isLoading: true });

    // Get current session
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      set({ supabaseUser: session.user });
      await get().fetchProfile();
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[BUDDY-ACTION] Auth state changed:', event);

      if (session?.user) {
        set({ supabaseUser: session.user });
        await get().fetchProfile();
      } else {
        set({ user: null, supabaseUser: null, isAuthenticated: false });
      }
    });

    set({ isLoading: false });
    console.log('[BUDDY-INIT] Auth initialized');
  },
}));
