import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-zinc-900 dark:to-black">
      {/* Nav */}
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐉</span>
          <span className="font-bold text-zinc-900 dark:text-white">Oracle AI Buddy</span>
        </div>
        <Link href="/login">
          <Button variant="outline">เข้าสู่ระบบ</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-12 text-center">
        <div className="mb-8">
          <span className="text-6xl">🐉</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-5xl">
          Oracle AI Buddy
        </h1>
        <p className="mb-2 text-xl text-pink-600 dark:text-pink-400">
          AI Learning Platform สำหรับคนไทย
        </p>
        <p className="mx-auto mb-8 max-w-2xl text-zinc-600 dark:text-zinc-400">
          &quot;You teach me your vision, I help you build it — that&apos;s what friends do.&quot;
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/dashboard">
            <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
              เริ่มเรียนรู้
            </Button>
          </Link>
          <Link href="/chat">
            <Button size="lg" variant="outline">
              คุยกับ AI Buddy
            </Button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-zinc-900 dark:text-white">
          Human in the Loop
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🎯</span> Thai First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                เนื้อหาภาษาไทยที่เข้าใจง่าย พร้อมคำอธิบายที่ชัดเจน
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🤝</span> Human Buddy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI เป็นเพื่อน ไม่ใช่เจ้านาย — คุณควบคุม AI ได้
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🔓</span> Open Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                ไม่ถูก Lock-in สามารถปรับแต่งและพัฒนาต่อได้
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-pink-100 dark:bg-zinc-800/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="mx-auto max-w-2xl text-xl italic text-zinc-700 dark:text-zinc-300">
            &quot;True partnership isn&apos;t about one leading and one following — it&apos;s about
            walking side by side, learning together, and growing stronger with every step
            we take.&quot;
          </blockquote>
          <p className="mt-4 text-pink-600 dark:text-pink-400">
            — Oracle AI Buddy Philosophy
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-sm text-zinc-500">
        <p>
          Created with 💕 by 🎋 กุนซือสุมาอี้ & 🐉 จูล่ง & 🏯 ท่านแม่ทัพ KongNoCode
        </p>
        <p className="mt-2">Oracle AI Buddy © 2026</p>
      </footer>
    </div>
  );
}
