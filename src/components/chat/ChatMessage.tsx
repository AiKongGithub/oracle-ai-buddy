'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  isTyping?: boolean;
}

export function ChatMessage({ role, content, timestamp, isTyping }: ChatMessageProps) {
  const isUser = role === 'user';
  const isSystem = role === 'system';

  if (isTyping) {
    return (
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-pink-100 text-pink-600 text-sm">
            AI
          </AvatarFallback>
        </Avatar>
        <div className="rounded-2xl bg-white dark:bg-zinc-800 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
          {content}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-start gap-3', isUser && 'flex-row-reverse')}>
      <Avatar className="h-8 w-8">
        <AvatarFallback className={cn(
          'text-sm',
          isUser ? 'bg-zinc-200 text-zinc-700' : 'bg-pink-100 text-pink-600'
        )}>
          {isUser ? 'U' : 'AI'}
        </AvatarFallback>
      </Avatar>

      <div className={cn(
        'max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
        isUser
          ? 'bg-pink-600 text-white'
          : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
      )}>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
        {timestamp && (
          <p className={cn(
            'mt-1 text-xs',
            isUser ? 'text-pink-200' : 'text-zinc-400'
          )}>
            {timestamp.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}
