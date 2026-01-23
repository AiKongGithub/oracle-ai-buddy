// Supabase Database Types
// Auto-generated types for Oracle AI Buddy

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      learning_progress: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          completed_lessons: string[];
          current_lesson: string | null;
          started_at: string;
          last_accessed_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          completed_lessons?: string[];
          current_lesson?: string | null;
          started_at?: string;
          last_accessed_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          completed_lessons?: string[];
          current_lesson?: string | null;
          started_at?: string;
          last_accessed_at?: string;
          completed_at?: string | null;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: 'user' | 'assistant' | 'system';
          content?: string;
          created_at?: string;
        };
      };
      user_memories: {
        Row: {
          id: string;
          user_id: string;
          type: 'preference' | 'fact' | 'summary' | 'context' | 'feedback';
          key: string;
          value: string;
          importance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'preference' | 'fact' | 'summary' | 'context' | 'feedback';
          key: string;
          value: string;
          importance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'preference' | 'fact' | 'summary' | 'context' | 'feedback';
          key?: string;
          value?: string;
          importance?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type LearningProgress = Database['public']['Tables']['learning_progress']['Row'];
export type ChatSession = Database['public']['Tables']['chat_sessions']['Row'];
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
export type UserMemory = Database['public']['Tables']['user_memories']['Row'];
