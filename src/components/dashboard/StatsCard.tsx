'use client';

import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
  className?: string;
}

export function StatsCard({
  label,
  value,
  subValue,
  icon,
  trend,
  loading = false,
  className,
}: StatsCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('transition-all hover:shadow-md', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription>{label}</CardDescription>
        {icon && <span className="text-zinc-400">{icon}</span>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-pink-600">{value}</p>
          {subValue && (
            <span className="text-sm text-zinc-500">{subValue}</span>
          )}
        </div>
        {trend && (
          <p className={cn(
            'mt-1 text-xs',
            trend === 'up' && 'text-green-600',
            trend === 'down' && 'text-red-600',
            trend === 'neutral' && 'text-zinc-500'
          )}>
            {trend === 'up' && '↑ เพิ่มขึ้น'}
            {trend === 'down' && '↓ ลดลง'}
            {trend === 'neutral' && '— คงที่'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
