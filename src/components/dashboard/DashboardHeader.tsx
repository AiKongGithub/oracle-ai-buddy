'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme';
import { useUserStore } from '@/stores/useUserStore';

export function DashboardHeader() {
  const { user, isAuthenticated, signOut } = useUserStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="border-b border-castle-200 dark:border-castle-800 bg-white dark:bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:scale-110 transition-transform">🐉</span>
          <span className="font-bold text-foreground hidden sm:inline">Oracle AI Buddy</span>
          <span className="font-bold text-foreground sm:hidden">AI Buddy</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-primary font-medium">
              Dashboard
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              Chat
            </Button>
          </Link>
          <Link href="/progress">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              Progress
            </Button>
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-2 md:flex">
                <Avatar className="h-8 w-8 ring-2 ring-castle-200 dark:ring-castle-700">
                  <AvatarFallback className="bg-castle-100 dark:bg-castle-800 text-primary text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-foreground">{userName}</p>
                  <Badge variant="outline" className="text-xs border-dragon-300 text-dragon-600 dark:border-dragon-600 dark:text-dragon-400">
                    Buddy
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="hidden md:inline-flex text-muted-foreground hover:text-primary" onClick={signOut}>
                ออกจากระบบ
              </Button>
            </>
          ) : (
            <Link href="/login" className="hidden md:inline-flex">
              <Button size="sm" className="bg-primary hover:bg-castle-700 text-primary-foreground shadow-sm">
                เข้าสู่ระบบ
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-castle-200 dark:border-castle-800 bg-castle-50 dark:bg-castle-950 animate-fade-in-down">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded-lg text-primary font-medium bg-castle-100 dark:bg-castle-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              📊 Dashboard
            </Link>
            <Link
              href="/chat"
              className="block px-3 py-2 rounded-lg text-muted-foreground hover:bg-castle-100 dark:hover:bg-castle-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              💬 Chat
            </Link>
            <Link
              href="/progress"
              className="block px-3 py-2 rounded-lg text-muted-foreground hover:bg-castle-100 dark:hover:bg-castle-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              📈 Progress
            </Link>
            <div className="border-t border-castle-200 dark:border-castle-800 pt-2 mt-2">
              {isAuthenticated ? (
                <button
                  className="w-full px-3 py-2 rounded-lg text-left text-muted-foreground hover:bg-castle-100 dark:hover:bg-castle-900"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  🚪 ออกจากระบบ
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-lg text-primary font-medium hover:bg-castle-100 dark:hover:bg-castle-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🔐 เข้าสู่ระบบ
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-castle-50 via-castle-100 to-castle-50 dark:from-castle-950 dark:via-castle-900/50 dark:to-castle-950 px-4 py-4 sm:py-6">
        <div className="container mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            พร้อมเรียนรู้ AI ไปด้วยกันวันนี้ไหมครับ?
          </p>
        </div>
      </div>
    </header>
  );
}
