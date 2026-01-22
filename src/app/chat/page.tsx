'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockWelcomeMessage } from '@/lib/mock-data';
import type { Message } from '@/types';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([mockWelcomeMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response (mock)
    setTimeout(() => {
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `ขอบคุณสำหรับคำถามครับ!

ผม AI Buddy กำลังประมวลผล...

ในอนาคตเมื่อเชื่อมต่อกับ Claude API แล้ว ผมจะสามารถตอบคำถามได้อย่างละเอียดครับ 🐉

**[BUDDY-ACTION]** รอการเชื่อมต่อ API`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-zinc-950">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐉</span>
            <span className="font-bold text-zinc-900 dark:text-white">AI Buddy Chat</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-3xl space-y-4">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`p-4 ${
                message.role === 'user'
                  ? 'ml-auto max-w-[80%] bg-pink-600 text-white'
                  : 'mr-auto max-w-[80%] bg-white dark:bg-zinc-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">
                  {message.role === 'user' ? '👤' : '🐉'}
                </span>
                <div className="flex-1 whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
              </div>
            </Card>
          ))}
          {isTyping && (
            <Card className="mr-auto max-w-[80%] bg-white p-4 dark:bg-zinc-800">
              <div className="flex items-center gap-3">
                <span className="text-xl">🐉</span>
                <span className="text-sm text-zinc-500">กำลังพิมพ์...</span>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Input */}
      <footer className="border-t bg-white p-4 dark:bg-zinc-950">
        <form onSubmit={handleSubmit} className="container mx-auto max-w-3xl">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์ข้อความ..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button type="submit" disabled={isTyping || !input.trim()} className="bg-pink-600 hover:bg-pink-700">
              ส่ง
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-zinc-500">
            Human in the Loop — คุณควบคุม AI ได้
          </p>
        </form>
      </footer>
    </div>
  );
}
