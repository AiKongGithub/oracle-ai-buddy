import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CourseCard } from './CourseCard';
import type { Course } from '@/types';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('CourseCard', () => {
  const mockCourse: Course = {
    id: 'course-1',
    title: 'AI Basics',
    titleTh: 'พื้นฐาน AI',
    description: 'Learn the basics of AI',
    descriptionTh: 'เรียนรู้พื้นฐาน AI',
    totalDuration: 120,
    modules: [
      {
        id: 'mod-1',
        courseId: 'course-1',
        title: 'Module 1',
        titleTh: 'โมดูล 1',
        order: 1,
        lessons: [
          { id: 'l1', moduleId: 'mod-1', title: 'Lesson 1', titleTh: 'บทที่ 1', content: '', duration: 30, order: 1 },
          { id: 'l2', moduleId: 'mod-1', title: 'Lesson 2', titleTh: 'บทที่ 2', content: '', duration: 30, order: 2 },
        ],
      },
      {
        id: 'mod-2',
        courseId: 'course-1',
        title: 'Module 2',
        titleTh: 'โมดูล 2',
        order: 2,
        lessons: [
          { id: 'l3', moduleId: 'mod-2', title: 'Lesson 3', titleTh: 'บทที่ 3', content: '', duration: 30, order: 1 },
        ],
      },
    ],
  };

  it('should render course title in Thai', () => {
    render(<CourseCard course={mockCourse} />);

    expect(screen.getByText('พื้นฐาน AI')).toBeInTheDocument();
    expect(screen.getByText('AI Basics')).toBeInTheDocument();
  });

  it('should render course description in Thai', () => {
    render(<CourseCard course={mockCourse} />);

    expect(screen.getByText('เรียนรู้พื้นฐาน AI')).toBeInTheDocument();
  });

  it('should render module count', () => {
    render(<CourseCard course={mockCourse} />);

    expect(screen.getByText('2 โมดูล')).toBeInTheDocument();
  });

  it('should render duration', () => {
    render(<CourseCard course={mockCourse} />);

    expect(screen.getByText('120 นาที')).toBeInTheDocument();
  });

  it('should show "เริ่มเรียน" button when progress is 0', () => {
    render(<CourseCard course={mockCourse} progress={0} />);

    expect(screen.getByText('เริ่มเรียน')).toBeInTheDocument();
  });

  it('should show "เรียนต่อ" button when progress > 0', () => {
    render(<CourseCard course={mockCourse} progress={50} />);

    expect(screen.getByText('เรียนต่อ')).toBeInTheDocument();
  });

  it('should show "ใหม่" badge when isNew is true and progress is 0', () => {
    render(<CourseCard course={mockCourse} progress={0} isNew={true} />);

    expect(screen.getByText('ใหม่')).toBeInTheDocument();
  });

  it('should show "กำลังเรียน" badge when progress > 0 but < 100', () => {
    render(<CourseCard course={mockCourse} progress={50} />);

    expect(screen.getByText('กำลังเรียน')).toBeInTheDocument();
  });

  it('should show "เสร็จสิ้น" badge when progress is 100', () => {
    render(<CourseCard course={mockCourse} progress={100} />);

    expect(screen.getByText('เสร็จสิ้น')).toBeInTheDocument();
  });

  it('should display progress percentage', () => {
    render(<CourseCard course={mockCourse} progress={75} />);

    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should calculate completed lessons correctly', () => {
    // 3 total lessons, 50% progress = 2 completed (rounded)
    render(<CourseCard course={mockCourse} progress={50} />);

    expect(screen.getByText('2/3 บทเรียน')).toBeInTheDocument();
  });

  it('should link to course detail page', () => {
    render(<CourseCard course={mockCourse} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/course/course-1');
  });
});
