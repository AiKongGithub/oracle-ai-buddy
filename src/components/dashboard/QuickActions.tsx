'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuickAction {
  label: string;
  href: string;
  icon: string;
  description: string;
}

const quickActions: QuickAction[] = [
  {
    label: 'Chat กับ AI Buddy',
    href: '/chat',
    icon: '💬',
    description: 'คุยกับ AI เพื่อนของคุณ',
  },
  {
    label: 'ดูความคืบหน้า',
    href: '/progress',
    icon: '📊',
    description: 'ติดตามการเรียนรู้',
  },
  {
    label: 'คอร์สทั้งหมด',
    href: '/courses',
    icon: '📚',
    description: 'ดูคอร์สเรียนทั้งหมด',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">ทางลัด</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button
              variant="ghost"
              className="w-full justify-start h-auto py-3 hover:bg-pink-50 dark:hover:bg-pink-950/20"
            >
              <span className="text-xl mr-3">{action.icon}</span>
              <div className="text-left">
                <p className="font-medium">{action.label}</p>
                <p className="text-xs text-zinc-500">{action.description}</p>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
