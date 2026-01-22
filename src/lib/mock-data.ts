import type { Course, User, DashboardStats, ChatSession, Message } from '@/types';

// Mock User
export const mockUser: User = {
  id: '1',
  email: 'buddy@oracle-ai.com',
  name: 'AI Learner',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date(),
};

// Mock Courses - Thai AI Learning
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'AI Fundamentals',
    titleTh: 'พื้นฐาน AI',
    description: 'Learn the basics of Artificial Intelligence',
    descriptionTh: 'เรียนรู้พื้นฐานของปัญญาประดิษฐ์',
    totalDuration: 120,
    modules: [
      {
        id: 'mod-1',
        courseId: 'course-1',
        title: 'What is AI?',
        titleTh: 'AI คืออะไร?',
        order: 1,
        lessons: [
          {
            id: 'lesson-1-1',
            moduleId: 'mod-1',
            title: 'Introduction to AI',
            titleTh: 'แนะนำ AI',
            content: 'AI stands for Artificial Intelligence...',
            duration: 15,
            order: 1,
          },
          {
            id: 'lesson-1-2',
            moduleId: 'mod-1',
            title: 'History of AI',
            titleTh: 'ประวัติของ AI',
            content: 'AI has a rich history starting from...',
            duration: 20,
            order: 2,
          },
        ],
      },
      {
        id: 'mod-2',
        courseId: 'course-1',
        title: 'Types of AI',
        titleTh: 'ประเภทของ AI',
        order: 2,
        lessons: [
          {
            id: 'lesson-2-1',
            moduleId: 'mod-2',
            title: 'Machine Learning',
            titleTh: 'การเรียนรู้ของเครื่อง',
            content: 'Machine Learning is a subset of AI...',
            duration: 25,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'course-2',
    title: 'Human in the Loop',
    titleTh: 'มนุษย์ในวงจร AI',
    description: 'Understanding Human-AI collaboration',
    descriptionTh: 'เข้าใจการทำงานร่วมกันระหว่างมนุษย์และ AI',
    totalDuration: 90,
    modules: [
      {
        id: 'mod-3',
        courseId: 'course-2',
        title: 'Why Human in the Loop?',
        titleTh: 'ทำไมต้องมีมนุษย์ในวงจร?',
        order: 1,
        lessons: [
          {
            id: 'lesson-3-1',
            moduleId: 'mod-3',
            title: 'AI Limitations',
            titleTh: 'ข้อจำกัดของ AI',
            content: 'AI has limitations that require human oversight...',
            duration: 20,
            order: 1,
          },
          {
            id: 'lesson-3-2',
            moduleId: 'mod-3',
            title: 'Building Trust',
            titleTh: 'สร้างความไว้วางใจ',
            content: 'Trust between humans and AI is essential...',
            duration: 25,
            order: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'course-3',
    title: 'Oracle AI Strategy',
    titleTh: 'กลยุทธ์ AI ของ Oracle',
    description: 'Learn about Oracle AI-powered solutions',
    descriptionTh: 'เรียนรู้เกี่ยวกับโซลูชัน AI ของ Oracle',
    totalDuration: 150,
    modules: [
      {
        id: 'mod-4',
        courseId: 'course-3',
        title: 'Oracle Cloud AI',
        titleTh: 'Oracle Cloud AI',
        order: 1,
        lessons: [
          {
            id: 'lesson-4-1',
            moduleId: 'mod-4',
            title: 'OCI AI Services',
            titleTh: 'บริการ AI บน OCI',
            content: 'Oracle Cloud Infrastructure offers various AI services...',
            duration: 30,
            order: 1,
          },
        ],
      },
    ],
  },
];

// Mock Dashboard Stats
export const mockStats: DashboardStats = {
  totalCourses: 3,
  completedCourses: 0,
  totalLessons: 6,
  completedLessons: 0,
  totalTime: 0,
  streak: 1,
};

// Mock Chat Messages
export const mockWelcomeMessage: Message = {
  id: 'welcome-1',
  role: 'assistant',
  content: `สวัสดีครับ! ผม **AI Buddy** ยินดีต้อนรับสู่ Oracle AI Buddy 🐉

ผมพร้อมช่วยคุณเรียนรู้เกี่ยวกับ AI ในแบบที่เข้าใจง่าย

**สิ่งที่ผมช่วยได้:**
- อธิบายแนวคิด AI เป็นภาษาไทย
- แนะนำคอร์สเรียนที่เหมาะกับคุณ
- ตอบคำถามเกี่ยวกับ Oracle AI

ลองถามผมได้เลยครับ! 😊`,
  timestamp: new Date(),
};

// Mock Chat Session
export const mockChatSession: ChatSession = {
  id: 'session-1',
  userId: '1',
  title: 'Welcome Chat',
  messages: [mockWelcomeMessage],
  createdAt: new Date(),
  updatedAt: new Date(),
};
