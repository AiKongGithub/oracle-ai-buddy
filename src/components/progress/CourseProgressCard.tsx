'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Course } from '@/types';

interface CourseProgressCardProps {
  course: Course;
  completedLessons: number;
  lastAccessedAt?: Date;
}

export function CourseProgressCard({
  course,
  completedLessons,
  lastAccessedAt,
}: CourseProgressCardProps) {
  const totalLessons = course.modules.reduce(
    (acc, mod) => acc + mod.lessons.length,
    0
  );
  const progressPercent = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  const getStatusBadge = () => {
    if (progressPercent === 100) {
      return <Badge className="bg-green-100 text-green-700">เสร็จสิ้น</Badge>;
    }
    if (progressPercent > 0) {
      return <Badge className="bg-pink-100 text-pink-700">กำลังเรียน</Badge>;
    }
    return <Badge variant="outline">ยังไม่เริ่ม</Badge>;
  };

  const formatLastAccessed = () => {
    if (!lastAccessedAt) return null;
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastAccessedAt.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'เรียนวันนี้';
    if (diffDays === 1) return 'เรียนเมื่อวาน';
    if (diffDays < 7) return `เรียน ${diffDays} วันที่แล้ว`;
    return lastAccessedAt.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{course.titleTh}</CardTitle>
            <CardDescription>{course.title}</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">
              {completedLessons}/{totalLessons} บทเรียน
            </span>
            <span className="font-medium text-pink-600">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Modules */}
        <div className="space-y-2">
          {course.modules.map((module, index) => {
            const moduleLessons = module.lessons.length;
            const moduleCompleted = Math.min(
              Math.max(0, completedLessons - course.modules.slice(0, index).reduce((a, m) => a + m.lessons.length, 0)),
              moduleLessons
            );
            const moduleProgress = moduleLessons > 0 ? Math.round((moduleCompleted / moduleLessons) * 100) : 0;

            return (
              <div key={module.id} className="flex items-center gap-3 text-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  moduleProgress === 100
                    ? 'bg-green-100 text-green-600'
                    : moduleProgress > 0
                    ? 'bg-pink-100 text-pink-600'
                    : 'bg-zinc-100 text-zinc-400'
                }`}>
                  {moduleProgress === 100 ? '✓' : index + 1}
                </div>
                <span className={moduleProgress === 100 ? 'text-zinc-500 line-through' : ''}>
                  {module.titleTh}
                </span>
                <span className="ml-auto text-xs text-zinc-400">
                  {moduleCompleted}/{moduleLessons}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          {lastAccessedAt && (
            <span className="text-xs text-zinc-500">{formatLastAccessed()}</span>
          )}
          <Link href={`/course/${course.id}`} className="ml-auto">
            <Button size="sm" variant={progressPercent > 0 ? 'default' : 'outline'} className={progressPercent > 0 ? 'bg-pink-600 hover:bg-pink-700' : ''}>
              {progressPercent === 100 ? 'ทบทวน' : progressPercent > 0 ? 'เรียนต่อ' : 'เริ่มเรียน'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
