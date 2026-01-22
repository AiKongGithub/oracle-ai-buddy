'use client';

import { useEffect, useState } from 'react';
import { DashboardHeader, StatsCard, CourseCard, QuickActions } from '@/components/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserStore } from '@/stores/useUserStore';
import { supabase } from '@/lib/supabase';
import { mockCourses } from '@/lib/mock-data';
import type { LearningProgress } from '@/types/database';
import type { DashboardStats } from '@/types';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading, initialize } = useUserStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Initialize auth
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Fetch learning progress from Supabase
  useEffect(() => {
    async function fetchProgress() {
      if (!user) {
        // Use mock data if not logged in
        setStats({
          totalCourses: mockCourses.length,
          completedCourses: 0,
          totalLessons: mockCourses.reduce(
            (sum, c) => sum + c.modules.reduce((s, m) => s + m.lessons.length, 0),
            0
          ),
          completedLessons: 0,
          totalTime: 0,
          streak: 1,
        });
        setLoading(false);
        return;
      }

      try {
        // Fetch user's learning progress
        const { data: progressData } = await supabase
          .from('learning_progress')
          .select('*')
          .eq('user_id', user.id);

        if (progressData) {
          // Calculate progress per course
          const courseProgress: Record<string, number> = {};
          let totalCompletedLessons = 0;
          let completedCourses = 0;

          progressData.forEach((p: LearningProgress) => {
            const course = mockCourses.find((c) => c.id === p.course_id);
            if (course) {
              const totalLessons = course.modules.reduce(
                (sum, m) => sum + m.lessons.length,
                0
              );
              const completed = p.completed_lessons?.length || 0;
              courseProgress[p.course_id] = Math.round((completed / totalLessons) * 100);
              totalCompletedLessons += completed;
              if (p.completed_at) completedCourses++;
            }
          });

          setProgress(courseProgress);

          // Calculate total stats
          const totalLessons = mockCourses.reduce(
            (sum, c) => sum + c.modules.reduce((s, m) => s + m.lessons.length, 0),
            0
          );

          setStats({
            totalCourses: mockCourses.length,
            completedCourses,
            totalLessons,
            completedLessons: totalCompletedLessons,
            totalTime: totalCompletedLessons * 15, // Estimate 15 min per lesson
            streak: calculateStreak(progressData),
          });
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
  }, [user, authLoading]);

  // Calculate learning streak (simplified)
  function calculateStreak(progressData: LearningProgress[]): number {
    if (!progressData.length) return 0;

    const today = new Date();
    const lastAccess = progressData.reduce((latest, p) => {
      const date = new Date(p.last_accessed_at);
      return date > latest ? date : latest;
    }, new Date(0));

    const diffDays = Math.floor(
      (today.getTime() - lastAccess.getTime()) / (1000 * 60 * 60 * 24)
    );

    // If last access was today or yesterday, maintain streak
    return diffDays <= 1 ? Math.max(1, progressData.length) : 0;
  }

  const isPageLoading = authLoading || loading;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
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
                      progress={progress[course.id] || 0}
                      isNew={!progress[course.id]}
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
            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/30 border-pink-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  💡 เคล็ดลับวันนี้
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  <strong>Human in the Loop</strong> — ให้ AI เป็นผู้ช่วย ไม่ใช่ผู้ตัดสินใจ
                  ตรวจสอบผลลัพธ์จาก AI เสมอก่อนนำไปใช้งานจริง
                </p>
              </CardContent>
            </Card>

            {/* AI Buddy Mini Chat */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  🐉 AI Buddy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  มีคำถามไหม? ผมพร้อมช่วยเสมอ!
                </p>
                <a
                  href="/chat"
                  className="block text-center text-sm text-pink-600 hover:text-pink-700 font-medium"
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
