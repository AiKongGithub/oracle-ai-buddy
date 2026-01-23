'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChatMessage, ChatInput, ChatSidebar } from '@/components/chat';
import { useUserStore } from '@/stores/useUserStore';
import { useChatStore } from '@/stores/useChatStore';
import { mockWelcomeMessage } from '@/lib/mock-data';

// API response type
interface ChatAPIResponse {
  message: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
  error?: string;
}

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
  const [error, setError] = useState<string | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate fallback AI response (when API unavailable)
  const generateFallbackResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('สวัสดี') || input.includes('hello') || input.includes('หวัดดี')) {
      return `สวัสดีครับ! ยินดีที่ได้พบคุณ 😊

ผม **AI Buddy** พร้อมช่วยคุณเรียนรู้เกี่ยวกับ AI ครับ

⚠️ *ขณะนี้อยู่ใน Fallback Mode — ตอบจาก template*

มีอะไรให้ช่วยไหมครับ? 🐉`;
    }

    if (input.includes('ai') || input.includes('เอไอ') || input.includes('ปัญญาประดิษฐ์')) {
      return `**AI (Artificial Intelligence)** คือปัญญาประดิษฐ์ครับ

หลักการสำคัญที่เราใช้คือ **Human in the Loop**:
- มนุษย์ควบคุม AI ไม่ใช่ AI ควบคุมมนุษย์
- AI เป็นเพื่อน ไม่ใช่เจ้านาย
- ทุก action สำคัญต้องได้รับการอนุมัติ

⚠️ *Fallback Mode*

ต้องการเรียนรู้เพิ่มเติมไหมครับ? 🐉`;
    }

    if (input.includes('oracle')) {
      return `**Oracle** เป็นบริษัทเทคโนโลยีชั้นนำที่มีวิสัยทัศน์ด้าน AI ครับ

ปรัชญาหลัก:
- **AI as Creative Partner** — AI เป็นพันธมิตรสร้างสรรค์
- **Human Oversight** — มนุษย์ดูแลตลอดเวลา
- **Cultural Transformation** — เปลี่ยน mindset ไม่ใช่แค่ deploy tools

เราใช้ปรัชญานี้ในการพัฒนา Oracle AI Buddy ครับ 🏰

⚠️ *Fallback Mode*`;
    }

    if (input.includes('human') || input.includes('loop') || input.includes('ควบคุม')) {
      return `**Human in the Loop** คือหลักการที่ให้มนุษย์มีส่วนร่วมในการตัดสินใจของ AI

วิธีการ:
1. **Approval Workflow** — User approve ก่อน AI ทำ action
2. **Exception Handling** — มนุษย์แก้ไขเมื่อ AI ไม่แน่ใจ
3. **Confidence Level** — แสดงความมั่นใจของ AI

ใน Oracle AI Buddy เราใช้หลักการนี้ทุก action สำคัญครับ 🐉

⚠️ *Fallback Mode*`;
    }

    return `ขอบคุณสำหรับข้อความครับ!

ขณะนี้ผมอยู่ใน **Fallback Mode** เนื่องจาก API ยังไม่พร้อมใช้งาน

สิ่งที่คุณสามารถถามได้:
- "AI คืออะไร"
- "Human in the Loop คืออะไร"
- "Oracle คืออะไร"

เมื่อเติม credit แล้ว ผมจะตอบได้ฉลาดขึ้นครับ 🐉`;
  };

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
    setError(null);

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

    // Call Claude API
    setTyping(true);

    try {
      // Prepare messages for API (include conversation history, exclude system messages)
      const apiMessages = [...messages, userMessage]
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data: ChatAPIResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const aiResponse = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: data.message,
        timestamp: new Date(),
      };
      addMessage(aiResponse);

      // Save AI response to Supabase
      if (currentSession?.id) {
        await saveMessage(currentSession.id, 'assistant', aiResponse.content);
      }

      console.log('[BUDDY-DATA] Token usage:', data.usage);
    } catch (err) {
      console.error('[BUDDY-ERROR] Chat error:', err);

      // Switch to fallback mode and use mock response
      setIsFallbackMode(true);
      console.log('[BUDDY-ACTION] Switching to Fallback Mode');

      const fallbackResponse = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: generateFallbackResponse(content),
        timestamp: new Date(),
      };
      addMessage(fallbackResponse);

      // Save fallback response to Supabase
      if (currentSession?.id) {
        await saveMessage(currentSession.id, 'assistant', fallbackResponse.content);
      }
    } finally {
      setTyping(false);
    }
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

        {/* Fallback Mode Banner */}
        {isFallbackMode && (
          <div className="mx-4 mt-2">
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
              <CardContent className="flex items-center justify-between p-3">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  ⚡ Fallback Mode — AI ตอบจาก template (API ยังไม่พร้อม)
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFallbackMode(false)}
                  className="text-amber-700 hover:text-amber-900"
                >
                  ลองใหม่
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

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
