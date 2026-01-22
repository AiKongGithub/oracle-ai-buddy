'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCourses, mockStats } from '@/lib/mock-data';

export default function ProgressPage() {
  const progressPercent = mockStats.totalLessons > 0
    ? Math.round((mockStats.completedLessons / mockStats.totalLessons) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-zinc-950">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐉</span>
            <span className="font-bold text-zinc-900 dark:text-white">Oracle AI Buddy</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/chat">
              <Button variant="ghost">Chat</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">
          ความคืบหน้าการเรียน
        </h1>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>ภาพรวม</CardTitle>
            <CardDescription>ความคืบหน้าทั้งหมดของคุณ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="mb-2 flex justify-between text-sm">
                <span>ความคืบหน้า</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className="h-full rounded-full bg-pink-600 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 text-center">
              <div>
                <p className="text-2xl font-bold text-pink-600">{mockStats.completedCourses}</p>
                <p className="text-sm text-zinc-500">คอร์สเสร็จสิ้น</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-600">{mockStats.completedLessons}</p>
                <p className="text-sm text-zinc-500">บทเรียนเสร็จสิ้น</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-600">{mockStats.streak} 🔥</p>
                <p className="text-sm text-zinc-500">วันติดต่อกัน</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Progress */}
        <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
          ความคืบหน้าแต่ละคอร์ส
        </h2>
        <div className="space-y-4">
          {mockCourses.map((course) => {
            const totalLessons = course.modules.reduce(
              (acc, mod) => acc + mod.lessons.length,
              0
            );
            return (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.titleTh}</CardTitle>
                      <CardDescription>{course.title}</CardDescription>
                    </div>
                    <span className="rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-600 dark:bg-pink-900 dark:text-pink-300">
                      0/{totalLessons} บทเรียน
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div className="h-full rounded-full bg-pink-600" style={{ width: '0%' }} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
