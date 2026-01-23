'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CourseHeader, ModuleList, LessonViewer } from '@/components/course';
import { useUserStore } from '@/stores/useUserStore';
import { supabase } from '@/lib/supabase';
import { mockCourses } from '@/lib/mock-data';
import type { Course, Lesson } from '@/types';
import type { LearningProgress } from '@/types/database';

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;

  const { user, isAuthenticated, isLoading: authLoading, initialize } = useUserStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<LearningProgress | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Find course from mock data
  useEffect(() => {
    const foundCourse = mockCourses.find((c) => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      // Select first lesson by default
      if (foundCourse.modules.length > 0 && foundCourse.modules[0].lessons.length > 0) {
        setSelectedLesson(foundCourse.modules[0].lessons[0]);
      }
    }
    setLoading(false);
  }, [courseId]);

  // Fetch progress from Supabase
  useEffect(() => {
    async function fetchProgress() {
      if (!user?.id || !courseId) return;

      try {
        const { data } = await supabase
          .from('learning_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .single();

        if (data) {
          setProgress(data);
        }
      } catch {
        // No progress yet, that's fine
      }
    }

    if (!authLoading && user) {
      fetchProgress();
    }
  }, [user?.id, courseId, authLoading]);

  // Calculate progress
  const calculateProgress = () => {
    if (!course) return { percent: 0, completed: 0, total: 0 };

    const totalLessons = course.modules.reduce(
      (sum, m) => sum + m.lessons.length,
      0
    );
    const completedLessons = progress?.completed_lessons?.length || 0;
    const percent = totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

    return { percent, completed: completedLessons, total: totalLessons };
  };

  // Get all lessons in order
  const getAllLessons = (): Lesson[] => {
    if (!course) return [];
    return course.modules.flatMap((m) => m.lessons);
  };

  // Handle lesson completion
  const handleCompleteLesson = async () => {
    if (!selectedLesson || !user?.id || !course) return;

    const newCompletedLessons = [
      ...(progress?.completed_lessons || []),
      selectedLesson.id,
    ];

    // Update or create progress in Supabase
    if (progress) {
      await supabase
        .from('learning_progress')
        .update({
          completed_lessons: newCompletedLessons,
          current_lesson: selectedLesson.id,
          last_accessed_at: new Date().toISOString(),
        } as never)
        .eq('id', progress.id);
    } else {
      await supabase
        .from('learning_progress')
        .insert({
          user_id: user.id,
          course_id: course.id,
          completed_lessons: newCompletedLessons,
          current_lesson: selectedLesson.id,
        } as never);
    }

    // Update local state
    setProgress((prev) => ({
      ...prev!,
      completed_lessons: newCompletedLessons,
      current_lesson: selectedLesson.id,
    }));

    console.log('[BUDDY-ACTION] Lesson completed:', selectedLesson.id);
  };

  // Navigate to next/prev lesson
  const navigateLesson = (direction: 'next' | 'prev') => {
    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex((l) => l.id === selectedLesson?.id);

    if (direction === 'next' && currentIndex < allLessons.length - 1) {
      setSelectedLesson(allLessons[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      setSelectedLesson(allLessons[currentIndex - 1]);
    }
  };

  const progressData = calculateProgress();
  const allLessons = getAllLessons();
  const currentLessonIndex = allLessons.findIndex((l) => l.id === selectedLesson?.id);
  const isPageLoading = authLoading || loading;

  // Course not found
  if (!loading && !course) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="text-xl font-bold mb-2">ไม่พบคอร์สนี้</h2>
            <p className="text-zinc-500 mb-4">คอร์สที่คุณกำลังหาอาจถูกลบหรือไม่มีอยู่</p>
            <Link href="/dashboard">
              <Button className="bg-pink-600 hover:bg-pink-700">
                กลับไปหน้า Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-zinc-950">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐉</span>
            <span className="font-bold text-zinc-900 dark:text-white">Oracle AI Buddy</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link href="/progress">
              <Button variant="ghost" size="sm">Progress</Button>
            </Link>
          </nav>
        </div>
      </header>

      {isPageLoading ? (
        <div className="container mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-48 w-full" />
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-96 lg:col-span-1" />
            <Skeleton className="h-96 lg:col-span-2" />
          </div>
        </div>
      ) : course && (
        <>
          {/* Course Header */}
          <CourseHeader
            course={course}
            progress={progressData.percent}
            completedLessons={progressData.completed}
            totalLessons={progressData.total}
          />

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-pink-50 dark:bg-pink-950/30 rounded-lg text-center">
                <p className="text-sm text-pink-700 dark:text-pink-300">
                  💡 เข้าสู่ระบบเพื่อบันทึกความคืบหน้าการเรียน
                </p>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Sidebar - Module List */}
              <div className="lg:col-span-1">
                <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">
                  เนื้อหาคอร์ส
                </h2>
                <ModuleList
                  modules={course.modules}
                  completedLessons={progress?.completed_lessons || []}
                  currentLessonId={selectedLesson?.id}
                  onSelectLesson={setSelectedLesson}
                />
              </div>

              {/* Main - Lesson Viewer */}
              <div className="lg:col-span-2">
                {selectedLesson ? (
                  <LessonViewer
                    lesson={selectedLesson}
                    isCompleted={progress?.completed_lessons?.includes(selectedLesson.id) || false}
                    onComplete={handleCompleteLesson}
                    onNext={() => navigateLesson('next')}
                    onPrev={() => navigateLesson('prev')}
                    hasNext={currentLessonIndex < allLessons.length - 1}
                    hasPrev={currentLessonIndex > 0}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <p className="text-center text-zinc-500 py-8">
                        เลือกบทเรียนจากเมนูด้านซ้ายเพื่อเริ่มเรียน
                      </p>
                    </CardHeader>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
