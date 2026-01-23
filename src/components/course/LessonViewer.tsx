'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Lesson } from '@/types';

interface LessonViewerProps {
  lesson: Lesson;
  isCompleted: boolean;
  onComplete: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export function LessonViewer({
  lesson,
  isCompleted,
  onComplete,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: LessonViewerProps) {
  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{lesson.titleTh}</CardTitle>
            <p className="text-sm text-zinc-500 mt-1">{lesson.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              ⏱️ {lesson.duration} นาที
            </Badge>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-700">
                ✓ เสร็จสิ้น
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Lesson Content */}
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {lesson.content}
          </p>

          {/* Placeholder for future content types */}
          <div className="my-8 p-8 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-center">
            <p className="text-zinc-500 mb-2">📺 Video Content</p>
            <p className="text-sm text-zinc-400">
              (ในอนาคตจะมี video, quiz, และ interactive content)
            </p>
          </div>

          {/* Key Points */}
          <div className="bg-pink-50 dark:bg-pink-950/30 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-300 mb-3">
              💡 สิ่งที่ได้เรียนรู้
            </h3>
            <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-pink-500">•</span>
                <span>เข้าใจแนวคิดพื้นฐานของ {lesson.titleTh}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500">•</span>
                <span>สามารถนำไปประยุกต์ใช้ในชีวิตจริงได้</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500">•</span>
                <span>พร้อมเรียนรู้บทเรียนถัดไป</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={!hasPrev}
          >
            ← บทก่อนหน้า
          </Button>

          <div className="flex gap-2">
            {!isCompleted && (
              <Button
                onClick={onComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                ✓ เรียนจบบทนี้
              </Button>
            )}
            {hasNext && (
              <Button
                onClick={onNext}
                className="bg-pink-600 hover:bg-pink-700"
              >
                บทถัดไป →
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
