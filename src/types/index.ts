// Oracle AI Buddy - TypeScript Types

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Chat/Message Types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Learning Progress Types
export interface Course {
  id: string;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  modules: Module[];
  totalDuration: number; // in minutes
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  titleTh: string;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  titleTh: string;
  content: string;
  duration: number; // in minutes
  order: number;
}

export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: string[]; // lesson IDs
  currentLesson?: string;
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
}

// Human in the Loop Types
export interface ApprovalRequest {
  id: string;
  userId: string;
  action: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  resolvedAt?: Date;
}

// Dashboard Stats
export interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  totalTime: number; // in minutes
  streak: number; // consecutive days
}
