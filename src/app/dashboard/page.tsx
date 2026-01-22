'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCourses, mockStats } from '@/lib/mock-data';

export default function DashboardPage() {
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
            <Link href="/chat">
              <Button variant="ghost">Chat</Button>
            </Link>
            <Link href="/progress">
              <Button variant="ghost">Progress</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <section className="mb-8">
          <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
            Dashboard
          </h1>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>คอร์สทั้งหมด</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-pink-600">
                  {mockStats.completedCourses}/{mockStats.totalCourses}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>บทเรียนที่เสร็จ</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-pink-600">
                  {mockStats.completedLessons}/{mockStats.totalLessons}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>เวลาเรียน (นาที)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-pink-600">{mockStats.totalTime}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Streak (วัน)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-pink-600">{mockStats.streak} 🔥</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Courses */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
            คอร์สเรียน
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{course.titleTh}</CardTitle>
                  <CardDescription>{course.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {course.descriptionTh}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">
                      {course.modules.length} โมดูล • {course.totalDuration} นาที
                    </span>
                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                      เริ่มเรียน
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
