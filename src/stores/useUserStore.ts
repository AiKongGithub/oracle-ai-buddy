import { create } from 'zustand';
import type { User, DashboardStats } from '@/types';

interface UserState {
  user: User | null;
  isLoading: boolean;
  stats: DashboardStats | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setStats: (stats: DashboardStats) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  stats: null,

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setStats: (stats) => set({ stats }),
  logout: () => set({ user: null, stats: null }),
}));
