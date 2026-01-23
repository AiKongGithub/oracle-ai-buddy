'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Course } from '@/types';

interface CourseHeaderProps {
  course: Course;
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

export function CourseHeader({
  course,
  progress,
  completedLessons,
  totalLessons,
}: CourseHeaderProps) {
  const getStatusBadge = () => {
    if (progress === 100) {
      return <Badge className="bg-green-100 text-green-700">เสร็จสิ้น</Badge>;
    }
    if (progress > 0) {
      return <Badge className="bg-pink-100 text-pink-700">กำลังเรียน</Badge>;
    }
    return <Badge variant="outline">ยังไม่เริ่ม</Badge>;
  };

  return (
    <div className="bg-gradient-to-r from-pink-600 to-pink-500 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-pink-100 text-sm">
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span>คอร์สเรียน</span>
        </nav>

        {/* Course Info */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">{course.titleTh}</h1>
              {getStatusBadge()}
            </div>
            <p className="text-pink-100 mb-4">{course.title}</p>
            <p className="text-pink-50 mb-6">{course.descriptionTh}</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-pink-200">📚</span>
                <span>{course.modules.length} โมดูล</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-200">📝</span>
                <span>{totalLessons} บทเรียน</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-200">⏱️</span>
                <span>{course.totalDuration} นาที</span>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 min-w-[280px]">
            <div className="text-center mb-4">
              <p className="text-4xl font-bold">{progress}%</p>
              <p className="text-pink-100 text-sm">ความคืบหน้า</p>
            </div>
            <Progress value={progress} className="h-2 mb-3" />
            <p className="text-center text-sm text-pink-100">
              {completedLessons}/{totalLessons} บทเรียน
            </p>
            <Button
              className="w-full mt-4 bg-white text-pink-600 hover:bg-pink-50"
            >
              {progress === 0 ? 'เริ่มเรียน' : progress === 100 ? 'ทบทวน' : 'เรียนต่อ'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
