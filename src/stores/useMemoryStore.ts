import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

// Memory types
export type MemoryType =
  | 'preference'      // User preferences (learning style, interests)
  | 'fact'            // Facts about user (name, goals)
  | 'summary'         // Conversation summaries
  | 'context'         // Current learning context
  | 'feedback';       // User feedback on AI responses

export interface Memory {
  id: string;
  user_id: string;
  type: MemoryType;
  key: string;
  value: string;
  importance: number; // 1-10, higher = more important
  created_at: string;
  updated_at: string;
}

interface MemoryState {
  memories: Memory[];
  isLoading: boolean;

  // Actions
  fetchMemories: (userId: string) => Promise<void>;
  addMemory: (userId: string, type: MemoryType, key: string, value: string, importance?: number) => Promise<void>;
  updateMemory: (memoryId: string, value: string, importance?: number) => Promise<void>;
  deleteMemory: (memoryId: string) => Promise<void>;
  getMemoriesByType: (type: MemoryType) => Memory[];
  getMemoryByKey: (key: string) => Memory | undefined;

  // AI Context
  getContextForAI: () => string;
  summarizeAndStore: (userId: string, conversation: string) => Promise<void>;
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  memories: [],
  isLoading: false,

  // Fetch all memories for a user
  fetchMemories: async (userId) => {
    set({ isLoading: true });

    const { data, error } = await supabase
      .from('user_memories')
      .select('*')
      .eq('user_id', userId)
      .order('importance', { ascending: false });

    if (error) {
      console.error('[BUDDY-ERROR] Failed to fetch memories:', error.message);
      set({ isLoading: false });
      return;
    }

    set({ memories: (data || []) as Memory[], isLoading: false });
    console.log('[BUDDY-DATA] Memories loaded:', data?.length || 0);
  },

  // Add a new memory
  addMemory: async (userId, type, key, value, importance = 5) => {
    // Check if memory with same key exists
    const existing = get().memories.find((m) => m.key === key);
    if (existing) {
      // Update existing instead
      await get().updateMemory(existing.id, value, importance);
      return;
    }

    const { data, error } = await supabase
      .from('user_memories')
      .insert({
        user_id: userId,
        type,
        key,
        value,
        importance,
      } as never)
      .select()
      .single();

    if (error) {
      console.error('[BUDDY-ERROR] Failed to add memory:', error.message);
      return;
    }

    if (data) {
      set({ memories: [...get().memories, data as Memory] });
      console.log('[BUDDY-ACTION] Memory added:', key);
    }
  },

  // Update a memory
  updateMemory: async (memoryId, value, importance) => {
    const updateData: Record<string, unknown> = {
      value,
      updated_at: new Date().toISOString(),
    };
    if (importance !== undefined) {
      updateData.importance = importance;
    }

    const { error } = await supabase
      .from('user_memories')
      .update(updateData as never)
      .eq('id', memoryId);

    if (error) {
      console.error('[BUDDY-ERROR] Failed to update memory:', error.message);
      return;
    }

    set({
      memories: get().memories.map((m) =>
        m.id === memoryId
          ? { ...m, value, importance: importance ?? m.importance, updated_at: new Date().toISOString() }
          : m
      ),
    });
    console.log('[BUDDY-ACTION] Memory updated:', memoryId);
  },

  // Delete a memory
  deleteMemory: async (memoryId) => {
    const { error } = await supabase
      .from('user_memories')
      .delete()
      .eq('id', memoryId);

    if (error) {
      console.error('[BUDDY-ERROR] Failed to delete memory:', error.message);
      return;
    }

    set({ memories: get().memories.filter((m) => m.id !== memoryId) });
    console.log('[BUDDY-ACTION] Memory deleted:', memoryId);
  },

  // Get memories by type
  getMemoriesByType: (type) => {
    return get().memories.filter((m) => m.type === type);
  },

  // Get memory by key
  getMemoryByKey: (key) => {
    return get().memories.find((m) => m.key === key);
  },

  // Get context string for AI
  getContextForAI: () => {
    const memories = get().memories;
    if (memories.length === 0) return '';

    const sections: string[] = [];

    // User facts (high importance)
    const facts = memories.filter((m) => m.type === 'fact' && m.importance >= 7);
    if (facts.length > 0) {
      sections.push('## ข้อมูลผู้ใช้');
      facts.forEach((f) => sections.push(`- ${f.key}: ${f.value}`));
    }

    // Preferences
    const prefs = memories.filter((m) => m.type === 'preference');
    if (prefs.length > 0) {
      sections.push('\n## ความชอบ');
      prefs.forEach((p) => sections.push(`- ${p.key}: ${p.value}`));
    }

    // Current context
    const context = memories.filter((m) => m.type === 'context');
    if (context.length > 0) {
      sections.push('\n## บริบทปัจจุบัน');
      context.forEach((c) => sections.push(`- ${c.value}`));
    }

    // Recent summaries (last 3)
    const summaries = memories
      .filter((m) => m.type === 'summary')
      .slice(0, 3);
    if (summaries.length > 0) {
      sections.push('\n## สรุปบทสนทนาก่อนหน้า');
      summaries.forEach((s) => sections.push(`- ${s.value}`));
    }

    return sections.join('\n');
  },

  // Summarize conversation and store
  summarizeAndStore: async (userId, conversation) => {
    // Simple summarization (in production, use AI to summarize)
    const lines = conversation.split('\n').filter((l) => l.trim());
    const summary = lines.length > 3
      ? `${lines.slice(0, 2).join(' ')}... (${lines.length} messages)`
      : conversation.substring(0, 200);

    await get().addMemory(
      userId,
      'summary',
      `conversation_${Date.now()}`,
      summary,
      3
    );
  },
}));
