'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export type ActionType =
  | 'complete_lesson'
  | 'update_progress'
  | 'send_data'
  | 'execute_action'
  | 'custom';

interface ApprovalCardProps {
  actionType: ActionType;
  title: string;
  description: string;
  details?: string[];
  confidence: number; // 0-100
  onApprove: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

const actionLabels: Record<ActionType, { label: string; icon: string }> = {
  complete_lesson: { label: 'เรียนจบบท', icon: '📚' },
  update_progress: { label: 'อัพเดทความคืบหน้า', icon: '📊' },
  send_data: { label: 'ส่งข้อมูล', icon: '📤' },
  execute_action: { label: 'ดำเนินการ', icon: '⚡' },
  custom: { label: 'กำหนดเอง', icon: '🔧' },
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 80) return 'bg-green-500';
  if (confidence >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getConfidenceLabel = (confidence: number) => {
  if (confidence >= 80) return 'มั่นใจสูง';
  if (confidence >= 50) return 'มั่นใจปานกลาง';
  return 'ไม่แน่ใจ';
};

export function ApprovalCard({
  actionType,
  title,
  description,
  details,
  confidence,
  onApprove,
  onReject,
  isLoading = false,
}: ApprovalCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const action = actionLabels[actionType];

  const handleApprove = async () => {
    setIsProcessing(true);
    await onApprove();
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await onReject();
    setIsProcessing(false);
  };

  return (
    <Card className="border-2 border-pink-200 dark:border-pink-800 bg-pink-50/50 dark:bg-pink-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{action.icon}</span>
            <Badge variant="outline" className="text-pink-600 border-pink-300">
              {action.label}
            </Badge>
          </div>
          <Badge
            variant="secondary"
            className={`${getConfidenceColor(confidence)} text-white`}
          >
            {getConfidenceLabel(confidence)} ({confidence}%)
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2">{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>

        {details && details.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 space-y-1">
            {details.map((detail, index) => (
              <p key={index} className="text-sm flex items-start gap-2">
                <span className="text-pink-500">•</span>
                <span>{detail}</span>
              </p>
            ))}
          </div>
        )}

        {/* Confidence Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>ความมั่นใจของ AI</span>
            <span>{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-2" />
        </div>

        {/* Human in the Loop Notice */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2">
          <span>🔐</span>
          <span>Human in the Loop — คุณมีอำนาจตัดสินใจ</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleReject}
            variant="outline"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
            disabled={isLoading || isProcessing}
          >
            ✕ ไม่อนุมัติ
          </Button>
          <Button
            onClick={handleApprove}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={isLoading || isProcessing}
          >
            {isProcessing ? '...' : '✓ อนุมัติ'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
