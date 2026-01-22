'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  progress?: number; // 0-100
  isNew?: boolean;
}

export function CourseCard({ course, progress = 0, isNew = false }: CourseCardProps) {
  const totalLessons = course.modules.reduce(
    (sum, mod) => sum + mod.lessons.length,
    0
  );
  const completedLessons = Math.round((progress / 100) * totalLessons);

  const getStatusBadge = () => {
    if (progress === 100) {
      return <Badge className="bg-green-100 text-green-700">เสร็จสิ้น</Badge>;
    }
    if (progress > 0) {
      return <Badge className="bg-pink-100 text-pink-700">กำลังเรียน</Badge>;
    }
    if (isNew) {
      return <Badge className="bg-blue-100 text-blue-700">ใหม่</Badge>;
    }
    return null;
  };

  return (
    <Card className="group transition-all hover:shadow-lg hover:border-pink-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{course.titleTh}</CardTitle>
            <CardDescription className="mt-1">{course.title}</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
          {course.descriptionTh}
        </p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">ความคืบหน้า</span>
            <span className="font-medium text-pink-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-zinc-500">
            {completedLessons}/{totalLessons} บทเรียน
          </p>
        </div>

        {/* Course Info */}
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <span>{course.modules.length} โมดูล</span>
          <span>{course.totalDuration} นาที</span>
        </div>

        {/* Action Button */}
        <Link href={`/course/${course.id}`} className="block">
          <Button
            className="w-full bg-pink-600 hover:bg-pink-700 group-hover:bg-pink-700"
            size="sm"
          >
            {progress > 0 ? 'เรียนต่อ' : 'เริ่มเรียน'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
