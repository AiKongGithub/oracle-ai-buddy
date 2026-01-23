'use client';

import { useEffect, useState } from 'react';
import { DashboardHeader, StatsCard, CourseCard, QuickActions } from '@/components/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserStore } from '@/stores/useUserStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { mockCourses } from '@/lib/mock-data';
import type { DashboardStats } from '@/types';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading, initialize } = useUserStore();
  const {
    progress,
    stats: progressStats,
    isLoading: progressLoading,
    fetchProgress,
    subscribeToProgress,
    unsubscribeFromProgress,
  } = useProgressStore();

  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({});

  // Initialize auth
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Fetch progress and subscribe to realtime updates
  useEffect(() => {
    if (user?.id) {
      fetchProgress(user.id);
      subscribeToProgress(user.id);
      console.log('[BUDDY-INIT] Dashboard realtime connected');

      return () => {
        unsubscribeFromProgress();
      };
    }
  }, [user?.id, fetchProgress, subscribeToProgress, unsubscribeFromProgress]);

  // Calculate course progress percentages
  useEffect(() => {
    const newCourseProgress: Record<string, number> = {};

    progress.forEach((p) => {
      const course = mockCourses.find((c) => c.id === p.course_id);
      if (course) {
        const totalLessons = course.modules.reduce(
          (sum, m) => sum + m.lessons.length,
          0
        );
        const completed = p.completed_lessons?.length || 0;
        newCourseProgress[p.course_id] = totalLessons > 0
          ? Math.round((completed / totalLessons) * 100)
          : 0;
      }
    });

    setCourseProgress(newCourseProgress);
  }, [progress]);

  // Build stats object from progressStats
  const stats: DashboardStats = {
    totalCourses: mockCourses.length,
    completedCourses: progressStats.completedCourses,
    totalLessons: mockCourses.reduce(
      (sum, c) => sum + c.modules.reduce((s, m) => s + m.lessons.length, 0),
      0
    ),
    completedLessons: progressStats.completedLessons,
    totalTime: progressStats.completedLessons * 15, // Estimate 15 min per lesson
    streak: progressStats.currentStreak,
  };

  const isPageLoading = authLoading || progressLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-castle-50/50 to-background dark:from-castle-950/30 dark:to-background">
      {/* Header with Welcome Banner */}
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Content - 3 columns */}
          <div className="space-y-8 lg:col-span-3">
            {/* Stats Overview */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
                ภาพรวมการเรียน
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                  label="คอร์สทั้งหมด"
                  value={stats ? `${stats.completedCourses}/${stats.totalCourses}` : '-'}
                  loading={isPageLoading}
                />
                <StatsCard
                  label="บทเรียนที่เสร็จ"
                  value={stats ? `${stats.completedLessons}/${stats.totalLessons}` : '-'}
                  loading={isPageLoading}
                />
                <StatsCard
                  label="เวลาเรียน"
                  value={stats?.totalTime || 0}
                  subValue="นาที"
                  loading={isPageLoading}
                />
                <StatsCard
                  label="Streak"
                  value={stats ? `${stats.streak} 🔥` : '-'}
                  loading={isPageLoading}
                />
              </div>
            </section>

            {/* Course Grid */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  คอร์สเรียน
                </h2>
                {!isAuthenticated && (
                  <p className="text-sm text-zinc-500">
                    เข้าสู่ระบบเพื่อบันทึกความคืบหน้า
                  </p>
                )}
              </div>

              {isPageLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="mt-2 h-4 w-24" />
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-2 w-full" />
                        <Skeleton className="h-9 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {mockCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      progress={courseProgress[course.id] || 0}
                      isNew={!courseProgress[course.id]}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Recent Activity */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">กิจกรรมล่าสุด</CardTitle>
                </CardHeader>
                <CardContent>
                  {isPageLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="mt-1 h-3 w-24" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : isAuthenticated ? (
                    <p className="text-center text-zinc-500 py-8">
                      เริ่มเรียนเพื่อดูกิจกรรมของคุณ
                    </p>
                  ) : (
                    <p className="text-center text-zinc-500 py-8">
                      เข้าสู่ระบบเพื่อดูกิจกรรมของคุณ
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-royal-50 to-royal-100 dark:from-royal-700/20 dark:to-royal-600/10 border-royal-200 dark:border-royal-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-royal-700 dark:text-royal-300">
                  💡 เคล็ดลับวันนี้
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">
                  <strong className="text-royal-600 dark:text-royal-400">Human in the Loop</strong> — ให้ AI เป็นผู้ช่วย ไม่ใช่ผู้ตัดสินใจ
                  ตรวจสอบผลลัพธ์จาก AI เสมอก่อนนำไปใช้งานจริง
                </p>
              </CardContent>
            </Card>

            {/* AI Buddy Mini Chat */}
            <Card className="border-dragon-200 dark:border-dragon-800 hover:shadow-lg hover:shadow-dragon-500/10 transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-dragon-600 dark:text-dragon-400">
                  🐉 AI Buddy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  มีคำถามไหม? ผมพร้อมช่วยเสมอ!
                </p>
                <a
                  href="/chat"
                  className="block text-center text-sm text-primary hover:text-castle-700 dark:hover:text-castle-400 font-medium transition-colors"
                >
                  เริ่มแชทเลย →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
