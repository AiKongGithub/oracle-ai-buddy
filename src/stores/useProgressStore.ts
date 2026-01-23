import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { LearningProgress } from '@/types/database';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface ProgressStats {
  totalCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  currentStreak: number;
  totalXP: number;
}

interface ProgressState {
  progress: LearningProgress[];
  stats: ProgressStats;
  isLoading: boolean;
  realtimeChannel: RealtimeChannel | null;

  // Actions
  fetchProgress: (userId: string) => Promise<void>;
  updateProgress: (progressId: string, updates: Partial<LearningProgress>) => Promise<void>;
  completeLesson: (userId: string, courseId: string, lessonId: string) => Promise<void>;
  startCourse: (userId: string, courseId: string) => Promise<void>;

  // Realtime
  subscribeToProgress: (userId: string) => void;
  unsubscribeFromProgress: () => void;

  // Stats
  calculateStats: () => void;
  getProgressByCourse: (courseId: string) => LearningProgress | undefined;
}

const initialStats: ProgressStats = {
  totalCourses: 0,
  completedCourses: 0,
  totalLessons: 0,
  completedLessons: 0,
  currentStreak: 0,
  totalXP: 0,
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: [],
  stats: initialStats,
  isLoading: false,
  realtimeChannel: null,

  // Fetch all progress for a user
  fetchProgress: async (userId) => {
    set({ isLoading: true });

    const { data, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_accessed_at', { ascending: false });

    if (error) {
      console.error('[BUDDY-ERROR] Failed to fetch progress:', error.message);
      set({ isLoading: false });
      return;
    }

    const progress = (data || []) as LearningProgress[];
    set({ progress, isLoading: false });
    get().calculateStats();
    console.log('[BUDDY-DATA] Progress loaded:', progress.length);
  },

  // Update progress
  updateProgress: async (progressId, updates) => {
    // Optimistic update
    set({
      progress: get().progress.map((p) =>
        p.id === progressId ? { ...p, ...updates } : p
      ),
    });

    const { error } = await supabase
      .from('learning_progress')
      .update({
        ...updates,
        last_accessed_at: new Date().toISOString(),
      } as never)
      .eq('id', progressId);

    if (error) {
      console.error('[BUDDY-ERROR] Failed to update progress:', error.message);
      // Revert on error (re-fetch)
      const userId = get().progress.find((p) => p.id === progressId)?.user_id;
      if (userId) await get().fetchProgress(userId);
      return;
    }

    get().calculateStats();
    console.log('[BUDDY-ACTION] Progress updated:', progressId);
  },

  // Complete a lesson
  completeLesson: async (userId, courseId, lessonId) => {
    const existingProgress = get().progress.find((p) => p.course_id === courseId);

    if (existingProgress) {
      // Check if already completed
      if (existingProgress.completed_lessons?.includes(lessonId)) {
        console.log('[BUDDY-DATA] Lesson already completed:', lessonId);
        return;
      }

      // Add lesson to completed list
      const newCompletedLessons = [
        ...(existingProgress.completed_lessons || []),
        lessonId,
      ];

      await get().updateProgress(existingProgress.id, {
        completed_lessons: newCompletedLessons,
        current_lesson: lessonId,
      });
    } else {
      // Create new progress entry
      await get().startCourse(userId, courseId);

      // Then complete the lesson
      const newProgress = get().progress.find((p) => p.course_id === courseId);
      if (newProgress) {
        await get().updateProgress(newProgress.id, {
          completed_lessons: [lessonId],
          current_lesson: lessonId,
        });
      }
    }

    console.log('[BUDDY-ACTION] Lesson completed:', lessonId);
  },

  // Start a new course
  startCourse: async (userId, courseId) => {
    // Check if already started
    if (get().progress.find((p) => p.course_id === courseId)) {
      console.log('[BUDDY-DATA] Course already started:', courseId);
      return;
    }

    const { data, error } = await supabase
      .from('learning_progress')
      .insert({
        user_id: userId,
        course_id: courseId,
        completed_lessons: [],
        current_lesson: null,
      } as never)
      .select()
      .single();

    if (error) {
      console.error('[BUDDY-ERROR] Failed to start course:', error.message);
      return;
    }

    if (data) {
      set({ progress: [...get().progress, data as LearningProgress] });
      get().calculateStats();
      console.log('[BUDDY-ACTION] Course started:', courseId);
    }
  },

  // Subscribe to realtime progress updates
  subscribeToProgress: (userId) => {
    // Unsubscribe from existing channel
    get().unsubscribeFromProgress();

    const channel = supabase
      .channel(`progress:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'learning_progress',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('[BUDDY-DATA] Realtime update:', payload.eventType);

          if (payload.eventType === 'INSERT') {
            const newProgress = payload.new as LearningProgress;
            set({ progress: [...get().progress, newProgress] });
          } else if (payload.eventType === 'UPDATE') {
            const updatedProgress = payload.new as LearningProgress;
            set({
              progress: get().progress.map((p) =>
                p.id === updatedProgress.id ? updatedProgress : p
              ),
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as { id: string }).id;
            set({
              progress: get().progress.filter((p) => p.id !== deletedId),
            });
          }

          get().calculateStats();
        }
      )
      .subscribe();

    set({ realtimeChannel: channel });
    console.log('[BUDDY-INIT] Subscribed to realtime progress');
  },

  // Unsubscribe from realtime
  unsubscribeFromProgress: () => {
    const channel = get().realtimeChannel;
    if (channel) {
      supabase.removeChannel(channel);
      set({ realtimeChannel: null });
      console.log('[BUDDY-ACTION] Unsubscribed from realtime progress');
    }
  },

  // Calculate stats from progress
  calculateStats: () => {
    const progress = get().progress;

    const completedLessons = progress.reduce(
      (sum, p) => sum + (p.completed_lessons?.length || 0),
      0
    );

    const completedCourses = progress.filter(
      (p) => p.completed_at !== null
    ).length;

    // XP: 50 per lesson, 200 bonus per completed course
    const totalXP = completedLessons * 50 + completedCourses * 200;

    // Streak calculation (simplified - based on last 7 days)
    const today = new Date();
    const lastAccess = progress
      .map((p) => new Date(p.last_accessed_at))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    let currentStreak = 0;
    if (lastAccess) {
      const daysDiff = Math.floor(
        (today.getTime() - lastAccess.getTime()) / (1000 * 60 * 60 * 24)
      );
      currentStreak = daysDiff <= 1 ? Math.min(7, completedLessons) : 0;
    }

    set({
      stats: {
        totalCourses: progress.length,
        completedCourses,
        totalLessons: progress.reduce(
          (sum, p) => sum + (p.completed_lessons?.length || 0) + 5, // Assume 5 remaining per course
          0
        ),
        completedLessons,
        currentStreak,
        totalXP,
      },
    });
  },

  // Get progress by course ID
  getProgressByCourse: (courseId) => {
    return get().progress.find((p) => p.course_id === courseId);
  },
}));
