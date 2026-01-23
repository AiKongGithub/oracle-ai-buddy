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
      return <Badge className="bg-dragon-100 text-dragon-700 dark:bg-dragon-900 dark:text-dragon-300">เสร็จสิ้น</Badge>;
    }
    if (progress > 0) {
      return <Badge className="bg-castle-100 text-castle-700 dark:bg-castle-900 dark:text-castle-300">กำลังเรียน</Badge>;
    }
    if (isNew) {
      return <Badge className="bg-royal-100 text-royal-700 dark:bg-royal-700/30 dark:text-royal-300">ใหม่</Badge>;
    }
    return null;
  };

  return (
    <Card className="group card-hover hover-lift hover:border-castle-300 dark:hover:border-castle-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-foreground">{course.titleTh}</CardTitle>
            <CardDescription className="mt-1">{course.title}</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.descriptionTh}
        </p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">ความคืบหน้า</span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completedLessons}/{totalLessons} บทเรียน
          </p>
        </div>

        {/* Course Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{course.modules.length} โมดูล</span>
          <span>{course.totalDuration} นาที</span>
        </div>

        {/* Action Button */}
        <Link href={`/course/${course.id}`} className="block">
          <Button
            className="w-full bg-primary hover:bg-castle-700 text-primary-foreground shadow-sm group-hover:shadow-md transition-shadow btn-press"
            size="sm"
          >
            {progress > 0 ? 'เรียนต่อ' : 'เริ่มเรียน'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
