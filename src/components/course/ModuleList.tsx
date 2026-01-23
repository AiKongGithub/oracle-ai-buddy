'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Module, Lesson } from '@/types';

interface ModuleListProps {
  modules: Module[];
  completedLessons: string[];
  currentLessonId?: string;
  onSelectLesson: (lesson: Lesson) => void;
}

export function ModuleList({
  modules,
  completedLessons,
  currentLessonId,
  onSelectLesson,
}: ModuleListProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>(
    modules.length > 0 ? [modules[0].id] : []
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const isLessonCompleted = (lessonId: string) =>
    completedLessons.includes(lessonId);

  const getModuleProgress = (module: Module) => {
    const completed = module.lessons.filter((l) =>
      completedLessons.includes(l.id)
    ).length;
    return {
      completed,
      total: module.lessons.length,
      percent: module.lessons.length > 0
        ? Math.round((completed / module.lessons.length) * 100)
        : 0,
    };
  };

  return (
    <div className="space-y-4">
      {modules.map((module, index) => {
        const isExpanded = expandedModules.includes(module.id);
        const progress = getModuleProgress(module);
        const isModuleComplete = progress.percent === 100;

        return (
          <Card key={module.id} className="overflow-hidden">
            {/* Module Header */}
            <CardHeader
              className={cn(
                'cursor-pointer transition-colors',
                isExpanded ? 'bg-pink-50 dark:bg-pink-950/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
              )}
              onClick={() => toggleModule(module.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                      isModuleComplete
                        ? 'bg-green-100 text-green-600'
                        : progress.completed > 0
                        ? 'bg-pink-100 text-pink-600'
                        : 'bg-zinc-100 text-zinc-500'
                    )}
                  >
                    {isModuleComplete ? '✓' : index + 1}
                  </div>
                  <div>
                    <CardTitle className="text-base">{module.titleTh}</CardTitle>
                    <p className="text-sm text-zinc-500">{module.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {progress.completed}/{progress.total}
                  </Badge>
                  <svg
                    className={cn(
                      'w-5 h-5 text-zinc-400 transition-transform',
                      isExpanded && 'rotate-180'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </CardHeader>

            {/* Lessons */}
            {isExpanded && (
              <CardContent className="pt-0 pb-4">
                <div className="space-y-1 mt-2">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isCompleted = isLessonCompleted(lesson.id);
                    const isCurrent = lesson.id === currentLessonId;

                    return (
                      <Button
                        key={lesson.id}
                        variant="ghost"
                        className={cn(
                          'w-full justify-start h-auto py-3 px-4',
                          isCurrent && 'bg-pink-50 dark:bg-pink-950/30',
                          isCompleted && 'text-zinc-500'
                        )}
                        onClick={() => onSelectLesson(lesson)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div
                            className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                              isCompleted
                                ? 'bg-green-100 text-green-600'
                                : isCurrent
                                ? 'bg-pink-100 text-pink-600'
                                : 'bg-zinc-100 text-zinc-400'
                            )}
                          >
                            {isCompleted ? '✓' : lessonIndex + 1}
                          </div>
                          <div className="flex-1 text-left">
                            <p className={cn(
                              'text-sm',
                              isCompleted && 'line-through'
                            )}>
                              {lesson.titleTh}
                            </p>
                          </div>
                          <span className="text-xs text-zinc-400">
                            {lesson.duration} นาที
                          </span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
