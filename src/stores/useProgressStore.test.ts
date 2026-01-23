import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProgressStore } from './useProgressStore';
import type { LearningProgress } from '@/types/database';

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
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    }),
    removeChannel: vi.fn(),
  },
}));

describe('useProgressStore', () => {
  const createMockProgress = (overrides: Partial<LearningProgress> = {}): LearningProgress => ({
    id: 'prog-1',
    user_id: 'user-1',
    course_id: 'course-1',
    completed_lessons: [],
    current_lesson: null,
    completed_at: null,
    last_accessed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    ...overrides,
  });

  const initialStats = {
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    currentStreak: 0,
    totalXP: 0,
  };

  beforeEach(() => {
    // Reset store state before each test
    useProgressStore.setState({
      progress: [],
      stats: initialStats,
      isLoading: false,
      realtimeChannel: null,
    });
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useProgressStore.getState();

      expect(state.progress).toEqual([]);
      expect(state.stats).toEqual(initialStats);
      expect(state.isLoading).toBe(false);
      expect(state.realtimeChannel).toBeNull();
    });
  });

  describe('getProgressByCourse', () => {
    it('should return progress for matching course', () => {
      const progress1 = createMockProgress({ id: '1', course_id: 'course-1' });
      const progress2 = createMockProgress({ id: '2', course_id: 'course-2' });

      useProgressStore.setState({ progress: [progress1, progress2] });

      const result = useProgressStore.getState().getProgressByCourse('course-1');

      expect(result).toEqual(progress1);
    });

    it('should return undefined when no match', () => {
      const progress = createMockProgress({ course_id: 'course-1' });
      useProgressStore.setState({ progress: [progress] });

      const result = useProgressStore.getState().getProgressByCourse('course-999');

      expect(result).toBeUndefined();
    });
  });

  describe('calculateStats', () => {
    it('should calculate stats from progress', () => {
      const progress = [
        createMockProgress({
          id: '1',
          course_id: 'course-1',
          completed_lessons: ['lesson-1', 'lesson-2'],
          completed_at: null,
          last_accessed_at: new Date().toISOString(),
        }),
        createMockProgress({
          id: '2',
          course_id: 'course-2',
          completed_lessons: ['lesson-1'],
          completed_at: new Date().toISOString(), // Completed course
          last_accessed_at: new Date().toISOString(),
        }),
      ];

      useProgressStore.setState({ progress });
      useProgressStore.getState().calculateStats();

      const stats = useProgressStore.getState().stats;

      expect(stats.totalCourses).toBe(2);
      expect(stats.completedCourses).toBe(1);
      expect(stats.completedLessons).toBe(3); // 2 + 1
      // XP: 3 lessons * 50 + 1 completed course * 200 = 350
      expect(stats.totalXP).toBe(350);
    });

    it('should handle empty progress', () => {
      useProgressStore.setState({ progress: [] });
      useProgressStore.getState().calculateStats();

      const stats = useProgressStore.getState().stats;

      expect(stats.totalCourses).toBe(0);
      expect(stats.completedCourses).toBe(0);
      expect(stats.completedLessons).toBe(0);
      expect(stats.totalXP).toBe(0);
    });

    it('should calculate XP correctly', () => {
      // 2 completed lessons = 100 XP
      // 0 completed courses = 0 bonus
      // Total = 100 XP
      const progress = [
        createMockProgress({
          completed_lessons: ['l1', 'l2'],
          completed_at: null,
          last_accessed_at: new Date().toISOString(),
        }),
      ];

      useProgressStore.setState({ progress });
      useProgressStore.getState().calculateStats();

      expect(useProgressStore.getState().stats.totalXP).toBe(100);
    });

    it('should calculate completed courses bonus', () => {
      // 1 completed lesson = 50 XP
      // 1 completed course = 200 bonus
      // Total = 250 XP
      const progress = [
        createMockProgress({
          completed_lessons: ['l1'],
          completed_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
        }),
      ];

      useProgressStore.setState({ progress });
      useProgressStore.getState().calculateStats();

      expect(useProgressStore.getState().stats.totalXP).toBe(250);
    });
  });

  describe('subscribeToProgress', () => {
    it('should create realtime channel', async () => {
      const { supabase } = await import('@/lib/supabase');

      useProgressStore.getState().subscribeToProgress('user-1');

      expect(supabase.channel).toHaveBeenCalledWith('progress:user-1');
      expect(useProgressStore.getState().realtimeChannel).not.toBeNull();
    });
  });

  describe('unsubscribeFromProgress', () => {
    it('should remove channel when exists', async () => {
      const { supabase } = await import('@/lib/supabase');
      const mockChannel = { test: true };

      useProgressStore.setState({ realtimeChannel: mockChannel as never });
      useProgressStore.getState().unsubscribeFromProgress();

      expect(supabase.removeChannel).toHaveBeenCalledWith(mockChannel);
      expect(useProgressStore.getState().realtimeChannel).toBeNull();
    });

    it('should do nothing when no channel', async () => {
      const { supabase } = await import('@/lib/supabase');

      useProgressStore.getState().unsubscribeFromProgress();

      expect(supabase.removeChannel).not.toHaveBeenCalled();
    });
  });

  describe('completeLesson', () => {
    it('should not duplicate already completed lessons', async () => {
      const progress = createMockProgress({
        id: 'prog-1',
        course_id: 'course-1',
        completed_lessons: ['lesson-1'],
      });
      useProgressStore.setState({ progress: [progress] });

      // Spy on console.log to verify early return
      const consoleSpy = vi.spyOn(console, 'log');

      await useProgressStore.getState().completeLesson('user-1', 'course-1', 'lesson-1');

      expect(consoleSpy).toHaveBeenCalledWith('[BUDDY-DATA] Lesson already completed:', 'lesson-1');
      consoleSpy.mockRestore();
    });
  });

  describe('startCourse', () => {
    it('should not start already started course', async () => {
      const progress = createMockProgress({ course_id: 'course-1' });
      useProgressStore.setState({ progress: [progress] });

      const consoleSpy = vi.spyOn(console, 'log');

      await useProgressStore.getState().startCourse('user-1', 'course-1');

      expect(consoleSpy).toHaveBeenCalledWith('[BUDDY-DATA] Course already started:', 'course-1');
      consoleSpy.mockRestore();
    });
  });
});
