import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMemoryStore, type Memory, type MemoryType } from './useMemoryStore';

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

describe('useMemoryStore', () => {
  const createMockMemory = (overrides: Partial<Memory> = {}): Memory => ({
    id: 'mem-1',
    user_id: 'user-1',
    type: 'fact',
    key: 'test_key',
    value: 'test_value',
    importance: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  });

  beforeEach(() => {
    // Reset store state before each test
    useMemoryStore.setState({
      memories: [],
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useMemoryStore.getState();

      expect(state.memories).toEqual([]);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('getMemoriesByType', () => {
    it('should return memories filtered by type', () => {
      const factMemory = createMockMemory({ id: '1', type: 'fact' });
      const prefMemory = createMockMemory({ id: '2', type: 'preference' });
      const factMemory2 = createMockMemory({ id: '3', type: 'fact' });

      useMemoryStore.setState({ memories: [factMemory, prefMemory, factMemory2] });

      const facts = useMemoryStore.getState().getMemoriesByType('fact');
      const prefs = useMemoryStore.getState().getMemoriesByType('preference');

      expect(facts).toHaveLength(2);
      expect(prefs).toHaveLength(1);
      expect(facts[0].id).toBe('1');
      expect(facts[1].id).toBe('3');
    });

    it('should return empty array when no memories match type', () => {
      const factMemory = createMockMemory({ type: 'fact' });
      useMemoryStore.setState({ memories: [factMemory] });

      const summaries = useMemoryStore.getState().getMemoriesByType('summary');

      expect(summaries).toHaveLength(0);
    });
  });

  describe('getMemoryByKey', () => {
    it('should return memory with matching key', () => {
      const memory1 = createMockMemory({ id: '1', key: 'name' });
      const memory2 = createMockMemory({ id: '2', key: 'age' });

      useMemoryStore.setState({ memories: [memory1, memory2] });

      const result = useMemoryStore.getState().getMemoryByKey('name');

      expect(result).toEqual(memory1);
    });

    it('should return undefined when no memory matches key', () => {
      const memory = createMockMemory({ key: 'name' });
      useMemoryStore.setState({ memories: [memory] });

      const result = useMemoryStore.getState().getMemoryByKey('nonexistent');

      expect(result).toBeUndefined();
    });
  });

  describe('getContextForAI', () => {
    it('should return empty string when no memories', () => {
      const context = useMemoryStore.getState().getContextForAI();
      expect(context).toBe('');
    });

    it('should include high importance facts', () => {
      const highImportanceFact = createMockMemory({
        type: 'fact',
        key: 'ชื่อ',
        value: 'สมชาย',
        importance: 8,
      });

      useMemoryStore.setState({ memories: [highImportanceFact] });

      const context = useMemoryStore.getState().getContextForAI();

      expect(context).toContain('## ข้อมูลผู้ใช้');
      expect(context).toContain('ชื่อ: สมชาย');
    });

    it('should exclude low importance facts', () => {
      const lowImportanceFact = createMockMemory({
        type: 'fact',
        key: 'ชื่อ',
        value: 'สมชาย',
        importance: 3,
      });

      useMemoryStore.setState({ memories: [lowImportanceFact] });

      const context = useMemoryStore.getState().getContextForAI();

      expect(context).not.toContain('## ข้อมูลผู้ใช้');
    });

    it('should include preferences', () => {
      const preference = createMockMemory({
        type: 'preference',
        key: 'learning_style',
        value: 'visual',
      });

      useMemoryStore.setState({ memories: [preference] });

      const context = useMemoryStore.getState().getContextForAI();

      expect(context).toContain('## ความชอบ');
      expect(context).toContain('learning_style: visual');
    });

    it('should include context memories', () => {
      const contextMemory = createMockMemory({
        type: 'context',
        value: 'กำลังเรียน AI Basics',
      });

      useMemoryStore.setState({ memories: [contextMemory] });

      const context = useMemoryStore.getState().getContextForAI();

      expect(context).toContain('## บริบทปัจจุบัน');
      expect(context).toContain('กำลังเรียน AI Basics');
    });

    it('should include recent summaries (max 3)', () => {
      const summaries = [
        createMockMemory({ id: '1', type: 'summary', value: 'Summary 1' }),
        createMockMemory({ id: '2', type: 'summary', value: 'Summary 2' }),
        createMockMemory({ id: '3', type: 'summary', value: 'Summary 3' }),
        createMockMemory({ id: '4', type: 'summary', value: 'Summary 4' }),
      ];

      useMemoryStore.setState({ memories: summaries });

      const context = useMemoryStore.getState().getContextForAI();

      expect(context).toContain('## สรุปบทสนทนาก่อนหน้า');
      expect(context).toContain('Summary 1');
      expect(context).toContain('Summary 2');
      expect(context).toContain('Summary 3');
      expect(context).not.toContain('Summary 4');
    });
  });

  describe('deleteMemory', () => {
    it('should remove memory from state', async () => {
      const memory1 = createMockMemory({ id: '1' });
      const memory2 = createMockMemory({ id: '2' });
      useMemoryStore.setState({ memories: [memory1, memory2] });

      await useMemoryStore.getState().deleteMemory('1');

      const state = useMemoryStore.getState();
      expect(state.memories).toHaveLength(1);
      expect(state.memories[0].id).toBe('2');
    });
  });
});
