'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/stores/useUserStore';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, isLoading } = useUserStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isSignUp) {
      const result = await signUpWithEmail(email, password, name);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('สมัครสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยัน');
      }
    } else {
      const result = await signInWithEmail(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white dark:from-zinc-900 dark:to-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4">
            <span className="text-5xl">🐉</span>
          </div>
          <CardTitle className="text-2xl">
            {isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </CardTitle>
          <CardDescription>
            Oracle AI Buddy — AI Learning Platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อ</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ชื่อของคุณ"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">อีเมล</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">รหัสผ่าน</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
                {success}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700"
              disabled={isLoading}
            >
              {isLoading ? 'กำลังดำเนินการ...' : isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <p>
                มีบัญชีแล้ว?{' '}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-pink-600 hover:underline"
                >
                  เข้าสู่ระบบ
                </button>
              </p>
            ) : (
              <p>
                ยังไม่มีบัญชี?{' '}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-pink-600 hover:underline"
                >
                  สมัครสมาชิก
                </button>
              </p>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700">
              กลับหน้าแรก
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
