'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/stores/useUserStore';

export function DashboardHeader() {
  const { user, isAuthenticated, signOut } = useUserStore();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 18) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

  const userName = user?.name || 'Buddy';
  const initials = userName.slice(0, 2).toUpperCase();

  return (
    <header className="border-b bg-white dark:bg-zinc-950">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐉</span>
          <span className="font-bold text-zinc-900 dark:text-white">Oracle AI Buddy</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-pink-600">
              Dashboard
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="ghost" size="sm">
              Chat
            </Button>
          </Link>
          <Link href="/progress">
            <Button variant="ghost" size="sm">
              Progress
            </Button>
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-2 md:flex">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-pink-100 text-pink-600 text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-zinc-900 dark:text-white">{userName}</p>
                  <Badge variant="outline" className="text-xs">
                    Buddy
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                ออกจากระบบ
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                เข้าสู่ระบบ
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-950/20 dark:to-pink-900/20 px-4 py-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            พร้อมเรียนรู้ AI ไปด้วยกันวันนี้ไหมครับ?
          </p>
        </div>
      </div>
    </header>
  );
}
