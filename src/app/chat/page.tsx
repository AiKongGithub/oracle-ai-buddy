'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChatMessage, ChatInput, ChatSidebar } from '@/components/chat';
import { useUserStore } from '@/stores/useUserStore';
import { useChatStore } from '@/stores/useChatStore';
import { mockWelcomeMessage } from '@/lib/mock-data';

export default function ChatPage() {
  const { user, isAuthenticated, initialize: initAuth } = useUserStore();
  const {
    sessions,
    currentSession,
    messages,
    isTyping,
    isLoading,
    fetchSessions,
    fetchMessages,
    createSession,
    saveMessage,
    deleteSession,
    addMessage,
    setTyping,
    setCurrentSession,
    setMessages,
  } = useChatStore();

  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize auth
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Fetch sessions when user is authenticated
  useEffect(() => {
    if (user?.id) {
      fetchSessions(user.id);
    }
  }, [user?.id, fetchSessions]);

  // Load welcome message for guest users
  useEffect(() => {
    if (!isAuthenticated && messages.length === 0) {
      setMessages([{
        id: mockWelcomeMessage.id,
        role: mockWelcomeMessage.role,
        content: mockWelcomeMessage.content,
        timestamp: mockWelcomeMessage.timestamp,
      }]);
    }
  }, [isAuthenticated, messages.length, setMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle selecting a session
  const handleSelectSession = async (session: typeof currentSession) => {
    if (!session) return;
    setCurrentSession(session);
    await fetchMessages(session.id);
  };

  // Handle new chat
  const handleNewChat = async () => {
    if (!user?.id) {
      // Guest mode - reset to welcome message
      setMessages([{
        id: mockWelcomeMessage.id,
        role: mockWelcomeMessage.role,
        content: mockWelcomeMessage.content,
        timestamp: mockWelcomeMessage.timestamp,
      }]);
      setCurrentSession(null);
      return;
    }

    await createSession(user.id, 'แชทใหม่');
  };

  // Handle delete session
  const handleDeleteSession = async (sessionId: string) => {
    if (confirm('ต้องการลบแชทนี้?')) {
      await deleteSession(sessionId);
    }
  };

  // Handle send message
  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    // Save to Supabase if authenticated
    if (currentSession?.id) {
      await saveMessage(currentSession.id, 'user', content);
    }

    // Simulate AI response (mock)
    setTyping(true);

    setTimeout(async () => {
      const aiResponse = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: generateAIResponse(content),
        timestamp: new Date(),
      };
      addMessage(aiResponse);
      setTyping(false);

      // Save AI response to Supabase
      if (currentSession?.id) {
        await saveMessage(currentSession.id, 'assistant', aiResponse.content);
      }
    }, 1000 + Math.random() * 1000);
  };

  // Generate mock AI response
  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('สวัสดี') || input.includes('hello')) {
      return `สวัสดีครับ! ยินดีที่ได้พบคุณ 😊

ผม **AI Buddy** พร้อมช่วยคุณเรียนรู้เกี่ยวกับ AI ครับ

มีอะไรให้ช่วยไหมครับ?`;
    }

    if (input.includes('ai') || input.includes('เอไอ')) {
      return `**AI (Artificial Intelligence)** คือปัญญาประดิษฐ์ครับ

หลักการสำคัญที่เราใช้คือ **Human in the Loop** — ให้มนุษย์ควบคุม AI ไม่ใช่ให้ AI ควบคุมมนุษย์

ต้องการเรียนรู้เพิ่มเติมไหมครับ? 🐉`;
    }

    if (input.includes('oracle')) {
      return `**Oracle** เป็นบริษัทเทคโนโลยีชั้นนำที่มีวิสัยทัศน์ด้าน AI ที่น่าสนใจครับ

- AI as Creative Partner
- Human Oversight ตลอดเวลา
- Cultural Transformation

เราใช้ปรัชญานี้ในการพัฒนา Oracle AI Buddy ครับ 🏰`;
    }

    return `ขอบคุณสำหรับข้อความครับ!

ผมกำลังเรียนรู้เพื่อตอบคำถามได้ดียิ่งขึ้น ในอนาคตเมื่อเชื่อมต่อกับ Claude API แล้ว ผมจะสามารถช่วยคุณได้มากขึ้นครับ

**[BUDDY-ACTION]** รอการเชื่อมต่อ API 🐉`;
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Sidebar - Sessions */}
      {showSidebar && isAuthenticated && (
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSession?.id}
          isLoading={isLoading}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="border-b bg-white dark:bg-zinc-950 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="lg:hidden"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                  </svg>
                </Button>
              )}
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🐉</span>
                <span className="font-bold text-zinc-900 dark:text-white">AI Buddy Chat</span>
              </Link>
            </div>
            <nav className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/login">
                  <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            {isTyping && <ChatMessage role="assistant" content="" isTyping />}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input */}
        <footer className="border-t bg-white dark:bg-zinc-950 p-4">
          <div className="mx-auto max-w-3xl">
            <ChatInput
              onSend={handleSendMessage}
              disabled={isTyping}
              placeholder={isAuthenticated ? 'พิมพ์ข้อความ...' : 'พิมพ์ข้อความ... (Guest Mode)'}
            />
            <p className="mt-2 text-center text-xs text-zinc-500">
              Human in the Loop — คุณควบคุม AI ได้
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
