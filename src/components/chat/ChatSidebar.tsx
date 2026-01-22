'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { ChatSession } from '@/types/database';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  isLoading?: boolean;
  onSelectSession: (session: ChatSession) => void;
  onNewChat: () => void;
  onDeleteSession?: (sessionId: string) => void;
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  isLoading = false,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}: ChatSidebarProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'วันนี้';
    if (diffDays === 1) return 'เมื่อวาน';
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  };

  return (
    <aside className="w-64 border-r bg-zinc-50 dark:bg-zinc-900 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <Button
          onClick={onNewChat}
          className="w-full bg-pink-600 hover:bg-pink-700"
        >
          + แชทใหม่
        </Button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-center text-sm text-zinc-500 py-8">
            ยังไม่มีประวัติแชท
          </p>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  'group relative rounded-lg p-3 cursor-pointer transition-colors',
                  currentSessionId === session.id
                    ? 'bg-pink-100 dark:bg-pink-900/30'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                )}
                onClick={() => onSelectSession(session)}
              >
                <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate pr-6">
                  {session.title}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {formatDate(session.updated_at)}
                </p>

                {/* Delete Button */}
                {onDeleteSession && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <p className="text-xs text-center text-zinc-500">
          Human in the Loop
        </p>
      </div>
    </aside>
  );
}
