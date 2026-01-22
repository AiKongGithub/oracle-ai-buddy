'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ProgressOverview, CourseProgressCard, LearningStreak } from '@/components/progress';
import { useUserStore } from '@/stores/useUserStore';
import { supabase } from '@/lib/supabase';
import { mockCourses } from '@/lib/mock-data';
import type { LearningProgress } from '@/types/database';

export default function ProgressPage() {
  const { user, isAuthenticated, isLoading: authLoading, initialize } = useUserStore();
  const [progressData, setProgressData] = useState<LearningProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize auth
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Fetch learning progress
  useEffect(() => {
    async function fetchProgress() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('learning_progress')
          .select('*')
          .eq('user_id', user.id);

        if (data) {
          setProgressData(data);
        }
      } catch (error) {
        console.error('[BUDDY-ERROR] Failed to fetch progress:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchProgress();
    }
  }, [user?.id, authLoading]);

  // Calculate stats
  const calculateStats = () => {
    let completedLessons = 0;
    let completedCourses = 0;

    progressData.forEach((p) => {
      completedLessons += p.completed_lessons?.length || 0;
      if (p.completed_at) completedCourses++;
    });

    const totalLessons = mockCourses.reduce(
      (sum, c) => sum + c.modules.reduce((s, m) => s + m.lessons.length, 0),
      0
    );

    return {
      totalCourses: mockCourses.length,
      completedCourses,
      totalLessons,
      completedLessons,
      totalTime: completedLessons * 15, // Estimate 15 min per lesson
      streak: calculateStreak(),
    };
  };

  // Calculate streak
  const calculateStreak = () => {
    if (!progressData.length) return 0;

    const today = new Date();
    const lastAccess = progressData.reduce((latest, p) => {
      const date = new Date(p.last_accessed_at);
      return date > latest ? date : latest;
    }, new Date(0));

    const diffDays = Math.floor(
      (today.getTime() - lastAccess.getTime()) / (1000 * 60 * 60 * 24)
    );

    return diffDays <= 1 ? Math.max(1, progressData.length) : 0;
  };

  // Get progress for a specific course
  const getCourseProgress = (courseId: string) => {
    const progress = progressData.find((p) => p.course_id === courseId);
    return {
      completedLessons: progress?.completed_lessons?.length || 0,
      lastAccessedAt: progress?.last_accessed_at ? new Date(progress.last_accessed_at) : undefined,
    };
  };

  // Get active days for streak calendar
  const getActiveDays = () => {
    const days: Date[] = [];
    progressData.forEach((p) => {
      if (p.last_accessed_at) {
        days.push(new Date(p.last_accessed_at));
      }
    });
    return days;
  };

  const stats = calculateStats();
  const isPageLoading = authLoading || loading;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-zinc-950">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐉</span>
            <span className="font-bold text-zinc-900 dark:text-white">Oracle AI Buddy</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link href="/chat">
              <Button variant="ghost" size="sm">Chat</Button>
            </Link>
            {!isAuthenticated && (
              <Link href="/login">
                <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                  เข้าสู่ระบบ
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              ความคืบหน้าการเรียน
            </h1>
            {!isAuthenticated && (
              <p className="text-sm text-zinc-500 mt-1">
                เข้าสู่ระบบเพื่อบันทึกความคืบหน้า
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Overview */}
            <ProgressOverview
              {...stats}
              loading={isPageLoading}
            />

            {/* Course Progress */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                ความคืบหน้าแต่ละคอร์ส
              </h2>

              {isPageLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-2 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {mockCourses.map((course) => {
                    const { completedLessons, lastAccessedAt } = getCourseProgress(course.id);
                    return (
                      <CourseProgressCard
                        key={course.id}
                        course={course}
                        completedLessons={completedLessons}
                        lastAccessedAt={lastAccessedAt}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Streak */}
            <LearningStreak
              streak={stats.streak}
              activeDays={getActiveDays()}
            />

            {/* Tips */}
            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/30 border-pink-200">
              <CardHeader className="pb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  💡 เคล็ดลับ
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  เรียนทุกวันอย่างน้อย 15 นาที จะช่วยให้จำได้ดีขึ้น
                  และรักษา streak ไว้ได้!
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold">ทางลัด</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/chat" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    💬 ถาม AI Buddy
                  </Button>
                </Link>
                <Link href="/dashboard" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    📚 ดูคอร์สทั้งหมด
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
