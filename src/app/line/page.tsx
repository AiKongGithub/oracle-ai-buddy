'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Liff } from '@line/liff';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { LogIn, User, Sparkles, MessageCircle, Loader2 } from 'lucide-react';

interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export default function LinePage() {
  const router = useRouter();
  const [liff, setLiff] = useState<Liff | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

  // Initialize LIFF
  useEffect(() => {
    const initLiff = async () => {
      if (!liffId) {
        setError('LIFF ID ยังไม่ได้ตั้งค่า');
        setIsLoading(false);
        return;
      }

      try {
        const liffModule = await import('@line/liff');
        const liffInstance = liffModule.default;

        await liffInstance.init({ liffId });
        setLiff(liffInstance);

        const loggedIn = liffInstance.isLoggedIn();
        setIsLoggedIn(loggedIn);

        if (loggedIn) {
          // Get profile
          const userProfile = await liffInstance.getProfile();
          setProfile({
            userId: userProfile.userId,
            displayName: userProfile.displayName,
            pictureUrl: userProfile.pictureUrl,
            statusMessage: userProfile.statusMessage,
          });

          // Redirect to chat after showing profile briefly
          setIsRedirecting(true);
          setTimeout(() => {
            router.push('/chat');
          }, 1500);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'LIFF init failed');
      } finally {
        setIsLoading(false);
      }
    };

    initLiff();
  }, [liffId, router]);

  // Handle LINE Login
  const handleLogin = () => {
    if (liff) {
      liff.login({ redirectUri: window.location.href });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-castle-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-sm w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-castle-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-sm w-full">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <span className="text-2xl">!</span>
            </div>
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              ลองใหม่อีกครั้ง
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Logged in - Show profile and redirect
  if (isLoggedIn && profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#00B900] to-[#00A000] flex items-center justify-center p-4">
        <Card className="max-w-sm w-full shadow-2xl">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center gap-4">
              {/* Profile Picture */}
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={profile.pictureUrl} alt={profile.displayName} />
                  <AvatarFallback className="bg-castle-100 text-castle-600">
                    <User className="w-10 h-10" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#00B900] rounded-full flex items-center justify-center border-2 border-white">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                  </svg>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">ยินดีต้อนรับ</p>
                <h2 className="text-2xl font-bold text-foreground">
                  {profile.displayName}
                </h2>
                {profile.statusMessage && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile.statusMessage}
                  </p>
                )}
              </div>

              {/* Redirecting indicator */}
              {isRedirecting && (
                <div className="flex items-center gap-2 text-castle-600 dark:text-castle-400 mt-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>กำลังพาไปหน้าแชท...</span>
                </div>
              )}

              {/* Manual redirect button */}
              <Button
                onClick={() => router.push('/chat')}
                className="w-full mt-4 bg-castle-500 hover:bg-castle-600 text-white"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                เริ่มคุยกับ AI Buddy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not logged in - Show login button
  return (
    <div className="min-h-screen bg-gradient-to-b from-castle-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-sm w-full shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-castle-400 to-castle-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl">Oracle AI Buddy</CardTitle>
          <p className="text-muted-foreground">
            เรียนรู้ AI ไปด้วยกัน กับเพื่อนที่เข้าใจคุณ
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Features */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-500">✓</span>
              <span>AI Buddy ที่จำคุณได้</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-500">✓</span>
              <span>คอร์สเรียน AI ภาษาไทย</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-500">✓</span>
              <span>Human in the Loop</span>
            </div>
          </div>

          {/* LINE Login Button */}
          <Button
            onClick={handleLogin}
            className="w-full bg-[#00B900] hover:bg-[#00A000] text-white font-medium"
            size="lg"
          >
            <LogIn className="w-5 h-5 mr-2" />
            เข้าสู่ระบบด้วย LINE
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            เข้าสู่ระบบเพื่อเริ่มต้นการเรียนรู้
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
