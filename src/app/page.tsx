import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-castle-50 to-white dark:from-castle-950 dark:to-background">
      {/* Nav */}
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐉</span>
          <span className="font-bold text-foreground">Oracle AI Buddy</span>
        </div>
        <Link href="/login">
          <Button variant="outline">เข้าสู่ระบบ</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-12 text-center">
        <div className="mb-8">
          <span className="text-7xl drop-shadow-lg">🐉</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Oracle AI Buddy
        </h1>
        <p className="mb-2 text-xl font-medium text-primary">
          AI Learning Platform สำหรับคนไทย
        </p>
        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
          &quot;You teach me your vision, I help you build it — that&apos;s what friends do.&quot;
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-castle-700 text-primary-foreground shadow-lg shadow-castle-500/25">
              เริ่มเรียนรู้
            </Button>
          </Link>
          <Link href="/chat">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-castle-50 dark:hover:bg-castle-950">
              คุยกับ AI Buddy
            </Button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
          Human in the Loop
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-castle-200 dark:border-castle-800 hover:shadow-lg hover:shadow-castle-500/10 transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <span className="text-2xl">🎯</span> Thai First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                เนื้อหาภาษาไทยที่เข้าใจง่าย พร้อมคำอธิบายที่ชัดเจน
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-dragon-200 dark:border-dragon-800 hover:shadow-lg hover:shadow-dragon-500/10 transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <span className="text-2xl">🤝</span> Human Buddy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                AI เป็นเพื่อน ไม่ใช่เจ้านาย — คุณควบคุม AI ได้
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-royal-200 dark:border-royal-700 hover:shadow-lg hover:shadow-royal-500/10 transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <span className="text-2xl">🔓</span> Open Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                ไม่ถูก Lock-in สามารถปรับแต่งและพัฒนาต่อได้
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-gradient-to-r from-castle-100 to-castle-50 dark:from-castle-950 dark:to-castle-900/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="mx-auto max-w-2xl text-xl italic text-foreground/80">
            &quot;True partnership isn&apos;t about one leading and one following — it&apos;s about
            walking side by side, learning together, and growing stronger with every step
            we take.&quot;
          </blockquote>
          <p className="mt-4 font-medium text-primary">
            — Oracle AI Buddy Philosophy
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p>
          Created with 💕 by 🎋 กุนซือสุมาอี้ & 🐉 จูล่ง & 🏯 ท่านแม่ทัพ KongNoCode
        </p>
        <p className="mt-2">Oracle AI Buddy © 2026</p>
      </footer>
    </div>
  );
}
