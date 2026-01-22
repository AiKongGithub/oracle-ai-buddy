'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LearningStreakProps {
  streak: number;
  activeDays?: Date[];
}

export function LearningStreak({ streak, activeDays = [] }: LearningStreakProps) {
  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  const isActiveDay = (date: Date) => {
    return activeDays.some(
      (activeDate) =>
        activeDate.toDateString() === date.toDateString()
    );
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          🔥 Learning Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Streak Count */}
        <div className="text-center mb-4">
          <p className="text-4xl font-bold text-orange-500">{streak}</p>
          <p className="text-sm text-zinc-500">วันติดต่อกัน</p>
        </div>

        {/* Week Calendar */}
        <div className="flex justify-between">
          {last7Days.map((date, index) => {
            const active = isActiveDay(date);
            const today = isToday(date);

            return (
              <div key={index} className="flex flex-col items-center gap-1">
                <span className="text-xs text-zinc-500">
                  {dayNames[date.getDay()]}
                </span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                    active
                      ? 'bg-orange-500 text-white'
                      : today
                      ? 'border-2 border-orange-500 text-orange-500'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivation */}
        <p className="text-center text-sm text-zinc-500 mt-4">
          {streak === 0
            ? 'เริ่มเรียนวันนี้เลย!'
            : streak < 7
            ? 'ทำต่อไป! ใกล้ครบสัปดาห์แล้ว 💪'
            : 'ยอดเยี่ยม! รักษา streak ไว้นะ 🎉'}
        </p>
      </CardContent>
    </Card>
  );
}
