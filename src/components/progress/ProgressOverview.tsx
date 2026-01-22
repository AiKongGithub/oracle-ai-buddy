'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface ProgressOverviewProps {
  totalCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  totalTime: number;
  streak: number;
  loading?: boolean;
}

export function ProgressOverview({
  totalCourses,
  completedCourses,
  totalLessons,
  completedLessons,
  totalTime,
  streak,
  loading = false,
}: ProgressOverviewProps) {
  const progressPercent = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <div className="grid gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ภาพรวมการเรียน</CardTitle>
        <CardDescription>ความคืบหน้าทั้งหมดของคุณ</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">ความคืบหน้ารวม</span>
            <span className="font-medium text-pink-600">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-pink-50 dark:bg-pink-950/30 p-4 text-center">
            <p className="text-3xl font-bold text-pink-600">{completedCourses}/{totalCourses}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">คอร์สเสร็จสิ้น</p>
          </div>
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{completedLessons}/{totalLessons}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">บทเรียน</p>
          </div>
          <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{totalTime}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">นาทีที่เรียน</p>
          </div>
          <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{streak} 🔥</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">วันติดต่อกัน</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
